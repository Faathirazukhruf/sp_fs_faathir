import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const tasks = await db.task.findMany({
    where: { projectId: params.id },
    include: { assignee: true },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const { title, description } = await req.json();
  const task = await db.task.create({
    data: {
      title,
      description,
      status: "todo",
      projectId: params.id,
    },
  });

  return NextResponse.json(task);
}
