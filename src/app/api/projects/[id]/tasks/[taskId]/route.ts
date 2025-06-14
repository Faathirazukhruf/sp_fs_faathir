import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string; taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const task = await db.task.findUnique({ where: { id: params.taskId } });
  if (!task) return NextResponse.json({ message: "Not found" }, { status: 404 });

  await db.task.delete({ where: { id: params.taskId } });
  return NextResponse.json({ message: "Deleted" });
}
