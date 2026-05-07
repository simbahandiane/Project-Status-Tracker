import { prisma } from "@/lib/prisma";

// GET /api/projects
export async function GET() {
  
  try{
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return Response.json(projects, {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch projects" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST /api/projects
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Add additional check for required fields
    if (!body.clientName || !body.projectName || !body.status) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const project = await prisma.project.create({
      data: body,
    });

    return Response.json(project, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}