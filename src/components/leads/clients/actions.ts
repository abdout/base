"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  leadCreateSchema,
  leadUpdateSchema,
  bulkImportSchema,
  extractionSchema,
  interactionSchema,
  leadSearchSchema
} from "./validation";
import { LeadStatus, LeadSource, Priority } from "./types";

// Helper to check authentication
async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: Please log in to continue");
  }
  return user;
}

// Helper to create audit trail
async function createAuditEntry(
  leadId: string,
  userId: string,
  action: string,
  changes?: any
) {
  return db.leadHistory.create({
    data: {
      leadId,
      userId,
      action,
      changes: changes || {},
      metadata: {
        timestamp: new Date().toISOString(),
        userAgent: "web"
      }
    }
  });
}

// ==================== CREATE ====================

export async function createLead(input: z.infer<typeof leadCreateSchema>) {
  console.log("[CREATE LEAD] Starting with input:", input);

  try {
    const user = await requireAuth();
    console.log("[CREATE LEAD] User authenticated:", user.id);

    const validated = leadCreateSchema.parse(input);
    console.log("[CREATE LEAD] Input validated:", validated);

    // Check for duplicate by email
    if (validated.email) {
      const existing = await db.lead.findFirst({
        where: {
          email: validated.email,
          userId: user.id
        }
      });

      if (existing) {
        return {
          success: false,
          error: "A lead with this email already exists",
          duplicateId: existing.id
        };
      }
    }

    // Create the lead
    console.log("[CREATE LEAD] Creating lead in database...");

    // Extract autoEnrich flag and remove it from data
    const { autoEnrich, ...leadData } = validated;

    const lead = await db.lead.create({
      data: {
        ...leadData,
        userId: user.id,
        tags: leadData.tags || [],
        extractionMetadata: leadData.rawInput ? {
          extractedAt: new Date().toISOString(),
          method: "manual",
          confidence: 1
        } : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log("[CREATE LEAD] Lead created successfully:", lead.id);

    // Create audit entry
    await createAuditEntry(lead.id, user.id, "CREATE", { initial: validated });

    // Revalidate cache
    revalidatePath("/leads");
    revalidatePath(`/${user.locale || 'en'}/leads`);
    revalidateTag("leads");

    console.log("[CREATE LEAD] Cache revalidated, returning success");

    return {
      success: true,
      data: lead
    };
  } catch (error) {
    console.error("[CREATE LEAD] Error creating lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create lead"
    };
  }
}

// ==================== UPDATE ====================

export async function updateLead(input: z.infer<typeof leadUpdateSchema>) {
  try {
    const user = await requireAuth();
    const validated = leadUpdateSchema.parse(input);
    const { id, ...data } = validated;

    // Get current lead for comparison
    const currentLead = await db.lead.findUnique({
      where: { id, userId: user.id }
    });

    if (!currentLead) {
      return {
        success: false,
        error: "Lead not found or you don't have permission to update it"
      };
    }

    // Determine what changed
    const changes: any = {};
    Object.keys(data).forEach((key) => {
      const newValue = (data as any)[key];
      const oldValue = (currentLead as any)[key];
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        changes[key] = { old: oldValue, new: newValue };
      }
    });

    // Update the lead
    const lead = await db.lead.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create audit entry
    if (Object.keys(changes).length > 0) {
      await createAuditEntry(lead.id, user.id, "UPDATE", changes);
    }

    // Revalidate cache
    revalidatePath("/leads");
    revalidatePath(`/leads/${id}`);
    revalidateTag(`lead-${id}`);
    revalidateTag("leads");

    return {
      success: true,
      data: lead
    };
  } catch (error) {
    console.error("Error updating lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update lead"
    };
  }
}

// ==================== DELETE ====================

export async function deleteLead(id: string) {
  try {
    const user = await requireAuth();

    // Verify ownership
    const lead = await db.lead.findUnique({
      where: { id, userId: user.id }
    });

    if (!lead) {
      return {
        success: false,
        error: "Lead not found or you don't have permission to delete it"
      };
    }

    // Create final audit entry before deletion
    await createAuditEntry(lead.id, user.id, "DELETE", { final: lead });

    // Delete the lead (cascade will handle related records)
    await db.lead.delete({
      where: { id }
    });

    // Revalidate cache
    revalidatePath("/leads");
    revalidateTag("leads");

    return {
      success: true,
      message: "Lead deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete lead"
    };
  }
}

// ==================== BULK DELETE ====================

export async function deleteLeads(ids: string[]) {
  try {
    const user = await requireAuth();

    // Verify ownership of all leads
    const leads = await db.lead.findMany({
      where: {
        id: { in: ids },
        userId: user.id
      }
    });

    if (leads.length !== ids.length) {
      return {
        success: false,
        error: "Some leads not found or you don't have permission to delete them"
      };
    }

    // Create audit entries
    await Promise.all(
      leads.map(lead =>
        createAuditEntry(lead.id, user.id, "DELETE", { final: lead })
      )
    );

    // Delete all leads
    await db.lead.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id
      }
    });

    // Revalidate cache
    revalidatePath("/leads");
    revalidateTag("leads");

    return {
      success: true,
      message: `${ids.length} leads deleted successfully`
    };
  } catch (error) {
    console.error("Error deleting leads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete leads"
    };
  }
}

// ==================== GET SINGLE ====================

export async function getLead(id: string) {
  try {
    const user = await requireAuth();

    const lead = await db.lead.findUnique({
      where: {
        id,
        userId: user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        interactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10,
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        history: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 20,
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            interactions: true
          }
        }
      }
    });

    if (!lead) {
      return {
        success: false,
        error: "Lead not found"
      };
    }

    return {
      success: true,
      data: lead
    };
  } catch (error) {
    console.error("Error getting lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get lead"
    };
  }
}

// ==================== LIST WITH FILTERS ====================

export async function listLeads(params?: z.infer<typeof leadSearchSchema>) {
  console.log("[LIST LEADS] Starting with params:", params);

  try {
    const user = await requireAuth();
    console.log("[LIST LEADS] User authenticated:", user.id);

    const validated = params ? leadSearchSchema.parse(params) : leadSearchSchema.parse({});
    console.log("[LIST LEADS] Validated params:", validated);

    const {
      search,
      status,
      source,
      priority,
      dateFrom,
      dateTo,
      scoreMin,
      scoreMax,
      tags,
      assigned,
      page = 1,
      perPage = 20,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = validated;

    // Build where clause
    const where: any = {
      userId: user.id
    };

    // Search across multiple fields
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Status filter
    if (status && status.length > 0) {
      where.status = { in: status };
    }

    // Source filter
    if (source && source.length > 0) {
      where.source = { in: source };
    }

    // Priority filter
    if (priority && priority.length > 0) {
      where.priority = { in: priority };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    // Score range filter
    if (scoreMin !== undefined || scoreMax !== undefined) {
      where.score = {};
      if (scoreMin !== undefined) where.score.gte = scoreMin;
      if (scoreMax !== undefined) where.score.lte = scoreMax;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      where.tags = { hasEvery: tags };
    }

    // Assignment filter
    if (assigned !== undefined) {
      where.assignedTo = assigned ? { not: null } : null;
    }

    // Execute query with pagination
    console.log("[LIST LEADS] Query where clause:", where);

    const [total, leads] = await Promise.all([
      db.lead.count({ where }),
      db.lead.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              interactions: true
            }
          }
        }
      })
    ]);

    console.log(`[LIST LEADS] Found ${leads.length} leads, total: ${total}`);

    return {
      success: true,
      data: {
        leads,
        pagination: {
          total,
          page,
          perPage,
          totalPages: Math.ceil(total / perPage)
        }
      }
    };
  } catch (error) {
    console.error("[LIST LEADS] Error listing leads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list leads"
    };
  }
}

// ==================== ADD INTERACTION ====================

export async function addInteraction(input: z.infer<typeof interactionSchema>) {
  try {
    const user = await requireAuth();
    const validated = interactionSchema.parse(input);

    // Verify lead ownership
    const lead = await db.lead.findUnique({
      where: {
        id: validated.leadId,
        userId: user.id
      }
    });

    if (!lead) {
      return {
        success: false,
        error: "Lead not found or you don't have permission"
      };
    }

    // Create interaction
    const interaction = await db.interaction.create({
      data: {
        ...validated,
        userId: user.id
      }
    });

    // Update last contacted date if applicable
    if (["EMAIL", "CALL", "MEETING"].includes(validated.type)) {
      await db.lead.update({
        where: { id: validated.leadId },
        data: { lastContactedAt: new Date() }
      });
    }

    // Create audit entry
    await createAuditEntry(
      validated.leadId,
      user.id,
      "INTERACTION_ADDED",
      { type: validated.type, subject: validated.subject }
    );

    // Revalidate cache
    revalidateTag(`lead-${validated.leadId}`);

    return {
      success: true,
      data: interaction
    };
  } catch (error) {
    console.error("Error adding interaction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add interaction"
    };
  }
}

// ==================== GET STATISTICS ====================

export async function getLeadStats() {
  try {
    const user = await requireAuth();

    const [
      total,
      byStatus,
      bySource,
      byPriority,
      recentActivity,
      avgScore
    ] = await Promise.all([
      // Total leads
      db.lead.count({ where: { userId: user.id } }),

      // By status
      db.lead.groupBy({
        by: ['status'],
        where: { userId: user.id },
        _count: true
      }),

      // By source
      db.lead.groupBy({
        by: ['source'],
        where: { userId: user.id },
        _count: true
      }),

      // By priority
      db.lead.groupBy({
        by: ['priority'],
        where: { userId: user.id },
        _count: true
      }),

      // Recent activity (last 7 days)
      db.lead.count({
        where: {
          userId: user.id,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Average score
      db.lead.aggregate({
        where: { userId: user.id },
        _avg: {
          score: true
        }
      })
    ]);

    // Calculate conversion rate
    const wonCount = byStatus.find(s => s.status === 'CLOSED_WON')?._count || 0;
    const lostCount = byStatus.find(s => s.status === 'CLOSED_LOST')?._count || 0;
    const closedTotal = wonCount + lostCount;
    const conversionRate = closedTotal > 0 ? (wonCount / closedTotal) * 100 : 0;

    return {
      success: true,
      data: {
        total,
        byStatus: Object.fromEntries(
          byStatus.map(s => [s.status, s._count])
        ),
        bySource: Object.fromEntries(
          bySource.map(s => [s.source, s._count])
        ),
        byPriority: Object.fromEntries(
          byPriority.map(p => [p.priority, p._count])
        ),
        averageScore: avgScore._avg.score || 0,
        recentActivity,
        conversionRate
      }
    };
  } catch (error) {
    console.error("Error getting lead stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get statistics"
    };
  }
}