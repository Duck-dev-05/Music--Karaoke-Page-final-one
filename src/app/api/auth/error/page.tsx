"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const errorMessages: Record<string, { title: string; message: string; action: string }> = {
  Configuration: {
    title: "Configuration Error",
    message: "There is a problem with the authentication configuration.",
    action: "Please try again or contact support if the problem persists."
  },
  AccessDenied: {
    title: "Access Denied",
    message: "You have not granted the necessary permissions.",
    action: "Please try again and accept all required permissions."
  },
  Verification: {
    title: "Verification Failed",
    message: "Could not verify your account.",
    action: "Please try signing in again."
  },
  Default: {
    title: "Authentication Error",
    message: "An error occurred during authentication.",
    action: "Please try signing in again."
  },
  OAuthSignin: {
    title: "Sign In Failed",
    message: "Could not connect to the authentication provider.",
    action: "Please check your internet connection and try again."
  },
  OAuthCallback: {
    title: "Callback Error",
    message: "Error receiving response from the authentication provider.",
    action: "Please try signing in again."
  }
};

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/login";
  
  const errorDetails = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  useEffect(() => {
    if (error) {
      console.error("Auth error:", { error, callbackUrl });
      toast.error(errorDetails.message);
    }
  }, [error, callbackUrl, errorDetails.message]);

  const handleTryAgain = () => {
    router.push("/login");
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <CardTitle className="text-2xl">{errorDetails.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              {errorDetails.message}
            </p>
            <p className="text-sm font-medium">
              {errorDetails.action}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button onClick={handleTryAgain} className="flex items-center gap-2">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 
 