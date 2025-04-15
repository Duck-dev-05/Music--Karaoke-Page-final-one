"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";

const errorMessages: Record<string, { title: string; message: string; action: string }> = {
  Configuration: {
    title: "Configuration Error",
    message: "There is a problem with the Spotify authentication configuration.",
    action: "Please try again or contact support if the problem persists."
  },
  AccessDenied: {
    title: "Spotify Access Denied",
    message: "You have not granted the necessary Spotify permissions.",
    action: "Please try again and accept all required permissions."
  },
  Verification: {
    title: "Verification Failed",
    message: "Could not verify your Spotify account.",
    action: "Please try signing in again."
  },
  Default: {
    title: "Authentication Error",
    message: "An error occurred during Spotify authentication.",
    action: "Please try signing in again."
  },
  OAuthSignin: {
    title: "Spotify Sign In Failed",
    message: "Could not connect to Spotify.",
    action: "Please check your internet connection and try again."
  },
  OAuthCallback: {
    title: "Spotify Callback Error",
    message: "Error receiving response from Spotify.",
    action: "Please try signing in again."
  }
};

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const errorDetails = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  useEffect(() => {
    if (error) {
      console.error("Auth error:", { error, callbackUrl });
      toast.error(errorDetails.message);
    }
  }, [error, callbackUrl, errorDetails.message]);

  const handleTryAgain = () => {
    const loginUrl = new URL("/login", window.location.origin);
    if (callbackUrl) {
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }
    window.location.href = loginUrl.toString();
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

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">What you can try:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Check your internet connection</li>
              <li>Make sure you're logged into Spotify</li>
              <li>Accept all required Spotify permissions</li>
              <li>Clear your browser cookies</li>
              <li>Try using a different browser</li>
            </ul>
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
            <FaSpotify className="w-4 h-4" />
            Try Again with Spotify
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 
 