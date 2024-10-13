"use client";

import React, { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/auth";
import bg from "../../assets/login-bg.jpg";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword, isAuthenticated, loginUserGoogle } =
    useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const redirectUrl = searchParams.get("redirect") || "/admin";
  //     router.push(redirectUrl);
  //   }
  // }, [isAuthenticated, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    await forgotPassword({ email });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div key="1" className="flex h-screen bg-gray-900">
      <div className="flex flex-col justify-center w-full max-w-md p-8 m-auto bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-4">
          <SparklesIcon className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-center">Password Reset</h1>
          <p className="mt-2 text-sm text-center text-slate-400">
            Enter your email to sent reset link.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1">
            <label
              className="block text-sm font-medium text-slate-400"
              htmlFor="email"
            >
              Email *
            </label>
            <Input
              id="email"
              placeholder="Enter your mail address"
              type="email"
              className="!text-white"
              role="presentation"
              autocomplete="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            disabled={isLoading}
            className="w-full text-white bg-purple-600 hover:bg-purple-500"
          >
            Reset
          </Button>
        </form>
      </div>
    </div>
  );
}

function AppleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  );
}

function ChromeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function SparklesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
