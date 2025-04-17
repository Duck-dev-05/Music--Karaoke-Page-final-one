"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard, Star, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/subscription/cancel", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast.success("Subscription cancelled successfully");
      router.refresh();
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  if (!session.user.premium) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No Active Subscription</CardTitle>
            <CardDescription>
              You currently don't have an active subscription
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              onClick={() => router.push("/premium")}
            >
              <Star className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
            <div className="space-y-1">
              <h3 className="font-medium">Premium Plan</h3>
              <p className="text-sm text-muted-foreground">$9.99/month</p>
            </div>
            <Star className="h-5 w-5 text-primary" />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Next billing date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.user.subscription?.currentPeriodEnd || Date.now()), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Payment method</p>
                <p className="text-sm text-muted-foreground">
                  •••• •••• •••• 4242
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push("/settings/billing")}
          >
            Update Payment Method
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleCancelSubscription}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        </CardFooter>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Example billing history items */}
            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <p className="font-medium">Premium Plan</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">$9.99</p>
                <p className="text-sm text-green-500">Paid</p>
              </div>
            </div>
            {/* Add more billing history items as needed */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 