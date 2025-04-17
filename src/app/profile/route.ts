import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Redirect based on user type
  if (session.user.premium) {
    redirect("/profile/premium");
  } else {
    redirect("/profile/free");
  }
} 