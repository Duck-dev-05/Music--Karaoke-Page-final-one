'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();

  // Get the redirect URL from query params
  const from = searchParams.get('from') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would normally make an API call to your backend
      // For demo purposes, we'll simulate a successful login
      const response = await new Promise(resolve => setTimeout(() => {
        resolve({ 
          user: { id: 1, email },
          token: 'demo-token'
        });
      }, 1000));

      // Set the auth token in a cookie
      document.cookie = `auth-token=${response.token}; path=/`;
      
      // Update auth state
      setAuth(response.user);
      
      // Redirect to the original page or home
      router.push(from);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Here you would implement OAuth flow with the provider
      console.log(`Logging in with ${provider}`);
      
      // Simulate successful social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful OAuth login:
      document.cookie = `auth-token=social-token; path=/`;
      setAuth({ id: 1, provider });
      router.push(from);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-11"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <FaGoogle className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="h-11"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
              >
                <FaFacebook className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="h-11"
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading}
              >
                <FaGithub className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}