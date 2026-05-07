import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

// GET /api/projects/:id
export async function GET(
  _: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    // Validate project ID
    if (isNaN(projectId)) {
      return Response.json(
        { error: "Invalid project ID" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if project exists before updating
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // If project not found, return 404
    if (!project) {
      return Response.json(
        { error: "Project not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return Response.json(project, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch project" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PUT /api/projects/:id
export async function PUT(
  req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    // Validate project ID
    if (isNaN(projectId)) {
      return Response.json(
        { error: "Invalid project ID" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Add checking for empty body
    if (!body || Object.keys(body).length === 0) {
      return Response.json(
        { error: "Request body cannot be empty" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if project exists before updating
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // If project not found, return 404
    if (!existing) {
      return Response.json(
        { error: "Project not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update only the required fields, keep existing values for others
    // The updatedAt field will be automatically updated in the Prisma
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        clientName: body.clientName || existing.clientName,
        projectName: body.projectName || existing.projectName,
        status: body.status || existing.status
      },
    });

    return Response.json(updated, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("UPDATE ERROR:", message);

    return Response.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id
export async function DELETE(
  _: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || isNaN(Number(id))) {
      return Response.json(
        { error: "Invalid or missing project ID" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleted = await prisma.project.delete({
      where: { id: Number(id) },
    });

    return Response.json(
      {
        success: true,
        data: deleted,
      },
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Delete project error:", message);

    return Response.json(
      {
        error: "Internal server error",
        details: message,
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}