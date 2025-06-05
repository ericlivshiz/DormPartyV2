"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowLogin: () => void;
  onSuccess?: () => void;
}

export function RegisterDialog({ open, onOpenChange, onShowLogin, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Helper to check for .edu email
  function isEduEmail(email: string) {
    return email.trim().toLowerCase().endsWith(".edu");
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side .edu check
    if (!isEduEmail(email)) {
      setError("You must use a .edu email address to register.");
      return;
    }

    // Username required check
    if (!username.trim()) {
      setError("Please enter your name.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error(data.message || 'An account with this email already exists.');
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid registration data.');
        }
        if (response.status === 500 && data.code === 'TABLE_NOT_FOUND') {
          throw new Error('Database error. Please try again later.');
        }
        throw new Error(data.message || 'Registration failed');
      }

      // Show verification pending message
      setVerificationSent(true);
      toast.success("Account created!", {
        description: "Please check your email to verify your account",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during registration";
      setError(errorMessage);
      toast.error("Registration failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = () => {
    onOpenChange(false);
    onShowLogin();
  };

  if (verificationSent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white">Check Your Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-gray-300">
              We've sent a verification link to <span className="text-white font-semibold">{email}</span>
            </p>
            <p className="text-gray-300">
              Please check your email and click the link to verify your account. You'll be able to sign in after verification.
            </p>
            <Button 
              onClick={handleSignInClick}
              className="w-full bg-[#A855F7] text-white font-semibold rounded-xl hover:bg-[#9333EA] transition-all duration-200 shadow-lg shadow-[#A855F7]/20 hover:cursor-pointer"
            >
              Back to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">Create Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">Your Name</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="bg-[#2A2A2A] border border-[#3A3A3A] text-white focus:ring-[#A855F7] focus:border-[#A855F7] rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your .edu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-[#2A2A2A] border border-[#3A3A3A] text-white focus:ring-[#A855F7] focus:border-[#A855F7] rounded-xl"
            />
            <p className="text-xs text-gray-400">
              You must use a <span className="font-semibold text-white">.edu</span> email address to register.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-[#2A2A2A] border border-[#3A3A3A] text-white focus:ring-[#A855F7] focus:border-[#A855F7] rounded-xl"
            />
          </div>
          {error && (
            <p className="text-sm text-[#ff3b3b] text-center">{error}</p>
          )}
          <Button 
            type="submit" 
            className="w-full bg-[#A855F7] text-white font-semibold rounded-xl hover:bg-[#9333EA] transition-all duration-200 shadow-lg shadow-[#A855F7]/20 hover:cursor-pointer" 
            disabled={isLoading || !email || !password || !username}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              className="text-[#A855F7] underline-offset-4 hover:underline hover:cursor-pointer"
              onClick={handleSignInClick}
            >
              Sign in here
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
