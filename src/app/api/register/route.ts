import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: "Email already used" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { name, email, password: hashed },
  });

  return NextResponse.json(user);
}
