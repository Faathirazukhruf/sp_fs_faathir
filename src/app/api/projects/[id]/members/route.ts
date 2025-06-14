import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();

  const userToInvite = await db.user.findUnique({ where: { email } });
  if (!userToInvite) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isAlreadyMember = await db.member.findFirst({
    where: { projectId: id, userId: userToInvite.id },
  });

  if (isAlreadyMember) {
    return NextResponse.json({ message: "Already a member" }, { status: 400 });
  }

  const project = await db.project.findUnique({ where: { id } });

  if (!project || project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await db.member.create({
    data: { userId: userToInvite.id, projectId: id },
  });

  return NextResponse.json({ message: "Invited" }, { status: 200 });
}

