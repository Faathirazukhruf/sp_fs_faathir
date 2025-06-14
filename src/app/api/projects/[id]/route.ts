import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const project = await db.project.findUnique({
    where: { id: context.params.id },
    include: {
      owner: true,
      members: { include: { user: true } },
    },
  });

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  // Check if user is owner or member
  if (project.ownerId !== session.user.id && !project.members.some(m => m.userId === session.user.id)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(project);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const project = await db.project.findUnique({
    where: { id: context.params.id },
  });

  if (!project || project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { title } = await req.json();
  
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const updatedProject = await db.project.update({
    where: { id: context.params.id },
    data: { title },
    include: {
      owner: true,
      members: { include: { user: true } },
    },
  });

  return NextResponse.json(updatedProject);
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const project = await db.project.findUnique({
    where: { id: context.params.id },
  });

  if (!project || project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await db.project.delete({ where: { id: context.params.id } });
  return NextResponse.json({ message: "Project deleted" });
}
