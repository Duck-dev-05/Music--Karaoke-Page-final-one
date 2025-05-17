"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserCircle2, Crown, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebook, FaSpotify } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [selectedTestAccount, setSelectedTestAccount] = useState<"free" | "premium" | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const searchParams = new URLSearchParams(window.location.search);
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      toast.success(`Welcome back${session.user.name ? `, ${session.user.name}` : ''}!`);
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const TEST_ACCOUNTS = {
    free: {
      email: "free@test.com",
      password: "test123",
      description: "Try basic features with limited access (2 favorites max)"
    },
    premium: {
      email: "premium@test.com",
      password: "test123",
      description: "Experience all premium features (unlimited favorites)"
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: callbackUrl
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        const accountType = formData.email === TEST_ACCOUNTS.premium.email ? "Premium" : "Free";
        toast.success(`Login successful! (${accountType} Account)`);
        router.replace(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAccountSelect = (type: "free" | "premium") => {
    setSelectedTestAccount(type);
    setFormData({
      email: TEST_ACCOUNTS[type].email,
      password: TEST_ACCOUNTS[type].password
    });
    toast.info(`Selected ${type === 'premium' ? 'Premium' : 'Free'} test account`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Card>
      </div>
    );
  }

  // Don't show login page if already authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-2">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl animate-fade-in-up border-0">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 drop-shadow-lg">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full shadow-md"
            />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back!</CardTitle>
          <CardDescription className="text-base mt-1 text-gray-500">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-7">
            {!showTestAccounts ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-lg py-3 px-4 text-base border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pr-12 rounded-lg py-3 px-4 text-base border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Label className="text-base">Select Test Account Type</Label>
                <RadioGroup
                  value={selectedTestAccount || ""}
                  onValueChange={(value: string) => handleTestAccountSelect(value as "free" | "premium")}
                  className="grid gap-4"
                >
                  <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-shadow ${selectedTestAccount === 'free' ? 'border-indigo-400 shadow-md' : 'border-gray-200'}`}> 
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <UserCircle2 className="h-4 w-4" />
                        <span>Free Account</span>
                      </div>
                      <p className="text-sm text-gray-500">{TEST_ACCOUNTS.free.description}</p>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-shadow ${selectedTestAccount === 'premium' ? 'border-yellow-400 shadow-md' : 'border-gray-200'}`}> 
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span>Premium Account</span>
                      </div>
                      <p className="text-sm text-gray-500">{TEST_ACCOUNTS.premium.description}</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 mt-2">
            <Button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="flex items-center w-full gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 flex items-center gap-2 justify-center py-2 rounded-lg border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition"
                onClick={() => signIn('google', { callbackUrl })}
                disabled={isLoading}
              >
                <FaGoogle className="h-5 w-5" /> Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 flex items-center gap-2 justify-center py-2 rounded-lg border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition"
                onClick={() => signIn('facebook', { callbackUrl })}
                disabled={isLoading}
              >
                <FaFacebook className="h-5 w-5" /> Facebook
              </Button>
            </div>
            <p className="text-sm text-center text-gray-500 mt-2">
              Don't have an account?{' '}
              <Link href="/register" className="underline hover:text-indigo-600 font-medium">
                Register
              </Link>
            </p>
            <p className="text-xs text-center text-gray-400 mt-1">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-indigo-600">
                Terms of Service
              </Link>{' '}and{' '}
              <Link href="/privacy" className="underline hover:text-indigo-600">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 