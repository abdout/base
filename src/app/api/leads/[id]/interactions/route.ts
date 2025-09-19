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

// GET /api/leads/[id]/interactions - Get interactions for a lead
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify lead ownership
    const lead = await db.lead.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const interactions = await db.interaction.findMany({
      where: {
        leadId: params.id,
      },
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
    });

    return NextResponse.json(interactions);
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interactions" },
      { status: 500 }
    );
  }
}

// POST /api/leads/[id]/interactions - Add interaction to a lead
const createInteractionSchema = z.object({
  type: z.enum(["EMAIL", "CALL", "MEETING", "NOTE", "STATUS_CHANGE", "TASK", "DOCUMENT"]),
  subject: z.string().optional().nullable(),
  content: z.string().min(1),
  metadata: z.any().optional(),
});

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify lead ownership
    const lead = await db.lead.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = createInteractionSchema.parse(body);

    const interaction = await db.interaction.create({
      data: {
        ...validatedData,
        leadId: params.id,
        userId: user.id,
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
    });

    // Update lastContactedAt on the lead
    await db.lead.update({
      where: {
        id: params.id,
      },
      data: {
        lastContactedAt: new Date(),
      },
    });

    // Create history entry
    await db.leadHistory.create({
      data: {
        leadId: params.id,
        action: "STATUS_CHANGE",
        changes: {
          interaction: {
            type: validatedData.type,
            subject: validatedData.subject,
          },
        },
        userId: user.id,
      },
    });

    return NextResponse.json(interaction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating interaction:", error);
    return NextResponse.json(
      { error: "Failed to create interaction" },
      { status: 500 }
    );
  }
}