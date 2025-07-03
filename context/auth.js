"use client";

import axios from "axios";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { Toaster, toast } from "sonner";
import {
  setEncodedCookie,
  decodeCookieValue,
  getDecodedCookie,
} from "@/utils/encoding";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [verify, setVerify] = useState(false);
  const [tokenSent, setTokenSent] = useState("Send email to verify");
  const [error, setError] = useState(null);
  const [isOk, setIsOk] = useState();

  // const auth = useSearchParams().get("authenticated");

  useEffect(() => {
    const authenticatedParam = searchParams.get("authenticated");

    // Only run authentication logic if 'authenticated' parameter is present
    if (authenticatedParam === "true") {
      const checkAuthentication = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          // Store user data in localStorage
          localStorage.setItem("userdata", JSON.stringify(data));

          // Set authenticated cookie
          setEncodedCookie("authenticated", true);

          // Remove the query parameter and navigate
          router.replace("/admin", { scroll: false });

          toast.success("authenticated");
        } catch (error) {
          toast.error(error?.response?.data?.message);
          console.error(error);

          // Redirect to login or handle authentication failure
          router.replace("/login");
        }
      };

      checkAuthentication();
    } else if (getDecodedCookie("authenticated") === true) {
      const checkExistingAuth = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          localStorage.setItem("userdata", JSON.stringify(data));
          setUserData(JSON.parse(localStorage.getItem("userdata")));
          setVerify(userData?.isVerified);
          setEncodedCookie("authenticated", true);
        } catch (error) {
          // If validation fails, clear authentication
          console.error("Authentication validation failed");
          setEncodedCookie("authenticated", false);
          router.replace("/login");
        }
      };

      checkExistingAuth();
    }
  }, [searchParams]); // Empty dependency array to run only once

  const registerUser = async ({ username, email, password }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,
        { email, username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setEncodedCookie("authenticated", true);
      // getUser();
      setCookie("user", data?.token);

      setUserData(data);

      router.push("/signup/startup");
      toast.success("Signed-up in Successfully");
    } catch (err) {
      toast.error(error?.response?.data?.message);
      console.log(err);
      setError(err);
    }
  };

  // Login user
  const loginUser = async ({ email, password }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // getUser();
      setEncodedCookie("authenticated", true);
      router.push("/admin");
      toast.success("Logged in Successfully");
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    }
  };

  // Login user
  const loginUserGoogle = async () => {
    try {
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`);
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error(err);
    }
  };

  // verfiy

  const sendVerifyToken = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/send-verifyToken`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setLoading(false);

      setTokenSent("Email Sent Successfully");

      setTimeout(() => setTokenSent("Send email to verify"), 4000);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.log(error);
      setTokenSent("Error :Email not sent");
      setTimeout(() => setTokenSent("Send email to verify"), 4000);
    }
  };

  // forgot Password

  const forgotPassword = async ({ email }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Email Sent Successfully");
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    }
  };

  const resetPassword = async ({ password, token }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
        { password, token },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      router.push("/login");
      toast.success("Password Changed Successfully");
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      deleteCookie("jwt");
      deleteCookie("user");
      deleteCookie("registerSteps");
      deleteCookie("authenticated");

      setUserData("");
      localStorage.removeItem("userdata");
      localStorage.removeItem("userSite");
      localStorage.removeItem("userID");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Clear errors
  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        registerUser,
        loginUser,
        loginUserGoogle,
        setUserData,
        userData,
        error,
        setIsOk,
        isOk,
        loading,
        clearErrors,
        logoutUser,
        verify,
        setVerify,
        sendVerifyToken,
        tokenSent,
        setTokenSent,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
