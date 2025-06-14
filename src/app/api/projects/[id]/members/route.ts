import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const projectId = context.params.id;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json();

  const userToInvite = await db.user.findUnique({ where: { email } });
  if (!userToInvite) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isAlreadyMember = await db.member.findFirst({
    where: {
      projectId,
      userId: userToInvite.id,
    },
  });

  if (isAlreadyMember) {
    return NextResponse.json({ message: "User already a member" }, { status: 400 });
  }

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await db.member.create({
    data: {
      userId: userToInvite.id,
      projectId,
    },
  });

  return NextResponse.json({ message: "User invited" }, { status: 200 });
}
