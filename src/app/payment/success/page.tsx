"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // Refresh session to get updated premium status
  useEffect(() => {
    update();
  }, [update]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-lg mb-6">
        {session?.user?.premium
          ? "Your premium features are now active."
          : "Your payment was received. Premium will activate soon."}
      </p>
      <Button onClick={() => router.push("/")}>Go to Home</Button>
    </div>
  );
} 