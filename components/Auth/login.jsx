"use client";

import React, { useState, useContext, useEffect } from "react";
import { ShInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/auth";
import bg from "../../assets/login-bg.jpg";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserAuthForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser, isAuthenticated, loginUserGoogle } =
    useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = searchParams.get("redirect") || "/admin";
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    await loginUser({ email, password });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div key="1" className="flex h-screen ">
      <div className="hidden w-1/2 bg-secondary lg:block">
        <Image
          alt="abstract background"
          className="object-cover w-full h-full"
          src={bg}
          priority
        />
      </div>
      <div className="flex flex-col justify-center w-full max-w-md p-8 m-auto rounded-lg shadow-lg bg-secondary">
        <div className="mb-4">
          <SparklesIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-center">Welcome back!</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1 ">
            <label
              className="block text-sm font-medium text-slate-400"
              htmlFor="email"
            >
              Email *
            </label>
            <ShInput
              id="email"
              placeholder="Enter your mail address"
              type="email"
              className="!text-white"
              role="presentation"
              autoComplete="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1 ">
            <div className="flex justify-between">
              <label
                className="block text-sm font-medium text-slate-400"
                htmlFor="password"
              >
                Password *
              </label>
            </div>
            <ShInput
              id="password"
              className="text-white"
              placeholder="Enter password"
              type="password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a className="block text-sm text-right " href="/forgot-password">
            <span className="text-primary"> Forgot your password?</span>
          </a>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember" />
              <label
                className="block ml-2 text-sm text-slate-400"
                htmlFor="remember"
              >
                Remember me
              </label>
            </div>
          </div>
          <Button
            disabled={isLoading}
            className="w-full text-secondary bg-primary hover:bg-primary/90"
          >
            Log In
          </Button>
          <div className="flex items-center justify-between">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4" />
            <span className="text-sm">Login with</span>
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4" />
          </div>

          <Button
            type="button"
            onClick={() => loginUserGoogle()}
            className="w-full text-secondary bg-secondary-foreground hover:bg-secondary-foreground/90 "
          >
            <ChromeIcon className="w-4 h-4 mr-2 " />
            google
          </Button>
        </form>
        <div className="mt-6 text-sm text-center">
          Don't have an account ?{" "}
          <Link className="!text-primary hover:underline" href="/signup">
            Create one !
          </Link>
        </div>
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
