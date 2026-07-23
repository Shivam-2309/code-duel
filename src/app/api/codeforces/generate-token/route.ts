// src/app/api/codeforces/generate-token/route.ts
import { prisma } from "@/lib/prisma";
import { fetchCFUserInfo, generateVerificationToken } from "@/lib/codeforces";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.name || !session.user.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { handle } = await req.json();
  if (!handle)
    return NextResponse.json({ error: "Handle required" }, { status: 400 });

  // 1. does this handle exist on CF?
  const cfUser = await fetchCFUserInfo(handle);
  if (!cfUser)
    return NextResponse.json(
      { error: "Handle not found on Codeforces" },
      { status: 404 },
    );

  // 2. is it already claimed by someone else?
  const existing = await prisma.user.findUnique({
    where: { cfHandle: handle },
  });

  if (existing && existing.username !== session.user.name) {
    return NextResponse.json(
      { error: "Handle already linked to another account" },
      { status: 409 },
    );
  }

  // 3. generate + store token
  const token = generateVerificationToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { username: session.user.name },
    data: {
      cfHandle: handle,
      cfVerificationToken: token,
      cfTokenExpiresAt: expiresAt,
      cfVerified: false,
    },
  });

  return NextResponse.json({ token, expiresAt });
}
