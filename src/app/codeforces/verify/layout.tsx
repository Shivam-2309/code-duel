// src/app/(dashboard)/layout.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      cfVerified: true,
    },
  });

  if (user?.cfVerified) {
    redirect("/battleground");
  }

  if (!user?.cfVerified) {
    redirect("/codeforces/verify");
  }

  return (
    <div className="dashboard-layout">
      <main>{children}</main>
    </div>
  );
}
