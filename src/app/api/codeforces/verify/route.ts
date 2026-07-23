// src/app/api/codeforces/verify/route.ts
import { prisma } from "@/lib/prisma";
import { fetchCFUserInfo } from "@/lib/codeforces";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.name || !session.user.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { username: session.user.name },
  });

  if (!dbUser?.cfHandle || !dbUser.cfVerificationToken) {
    return NextResponse.json(
      { error: "No pending verification found" },
      { status: 400 },
    );
  }

  if (dbUser.cfTokenExpiresAt && dbUser.cfTokenExpiresAt < new Date()) {
    return NextResponse.json(
      { error: "Token expired, generate a new one" },
      { status: 410 },
    );
  }

  const cfUser = await fetchCFUserInfo(dbUser.cfHandle);
  if (!cfUser)
    return NextResponse.json(
      { error: "Could not fetch CF profile" },
      { status: 404 },
    );
  const matched = cfUser.firstName?.trim() === dbUser.cfVerificationToken;

  if (!matched) {
    return NextResponse.json({
      verified: false,
      message: "Token not found in profile yet",
    });
  }

  await prisma.user.update({
    where: { username: session.user.name },
    data: {
      cfVerified: true,
      cfVerificationToken: null,
      cfTokenExpiresAt: null,
    },
  });

  return NextResponse.json({
    verified: true,
    rating: cfUser.rating,
    rank: cfUser.rank,
  });
}
