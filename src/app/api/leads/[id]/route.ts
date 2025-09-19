export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/leads/[id] - Get a single lead
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lead = await db.lead.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        interactions: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        history: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/[id] - Update a lead
const updateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  companySize: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST", "ARCHIVED"]).optional(),
  source: z.enum(["MANUAL", "IMPORT", "API", "WEBSITE", "REFERRAL", "SOCIAL_MEDIA", "EMAIL_CAMPAIGN", "COLD_CALL", "CONFERENCE", "PARTNER"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  tags: z.array(z.string()).optional(),
  score: z.number().min(0).max(100).optional(),
  assignedTo: z.string().optional().nullable(),
  lastContactedAt: z.string().datetime().optional().nullable(),
  nextFollowUp: z.string().datetime().optional().nullable(),
});

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateLeadSchema.parse(body);

    // Check if lead exists and user has access
    const existingLead = await db.lead.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Track changes for history
    const changes: any = {};
    Object.keys(validatedData).forEach((key) => {
      const typedKey = key as keyof typeof validatedData;
      if (validatedData[typedKey] !== existingLead[typedKey]) {
        changes[key] = {
          old: existingLead[typedKey],
          new: validatedData[typedKey],
        };
      }
    });

    // Update the lead
    const updatedLead = await db.lead.update({
      where: {
        id: params.id,
      },
      data: {
        ...validatedData,
        lastContactedAt: validatedData.lastContactedAt ? new Date(validatedData.lastContactedAt) : undefined,
        nextFollowUp: validatedData.nextFollowUp ? new Date(validatedData.nextFollowUp) : undefined,
        updatedAt: new Date(),
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create history entry if there were changes
    if (Object.keys(changes).length > 0) {
      await db.leadHistory.create({
        data: {
          leadId: params.id,
          action: "UPDATE",
          changes,
          userId: user.id,
        },
      });
    }

    return NextResponse.json(updatedLead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete a single lead
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if lead exists and user has access
    const existingLead = await db.lead.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Delete the lead (cascade will handle related records)
    await db.lead.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}