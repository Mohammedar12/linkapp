"use client";
import { useEffect, useState } from "react";
import Benefits from "@/components/Landing/benefits";
import { benefitOne, benefitTwo } from "@/components/Landing/data";
import Cta from "@/components/Landing/cta";
import Faq from "@/components/Landing/faq";
import Footer from "@/components/Landing/footer";
import { Button } from "@/components/ui/button";
import { Button as MuiBtn } from "@mui/material";
import { ShInput } from "@/components/ui/input";
import Hero from "@/components/Landing/hero";
import Navbar from "@/components/Landing/navbar";
// import PopupWidget from "@/components/Landing/popupWidget";
import SectionTitle from "@/components/Landing/sectionTitle";
import Testimonials from "@/components/Landing/testimonials";
import app1 from "../assets/app-1.png";
import app2 from "../assets/app-2.png";
import { Video, LinkIcon, CheckCircle, Share2, Zap } from "lucide-react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

const Home = () => {
  let images = [app1, app2];

  const [userName, setUserName] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
      setKey((prev) => prev + 1);
    }, 2400); // Match the total animation duration (2s * 3 keyframes = 6s)

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Nextly - Free Nextjs & TailwindCSS Landing Page Template</title>
        <meta
          name="description"
          content="Nextly is a free landing page template built with next.js & Tailwind CSS"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <section className="w-full py-12 ">
            <div className="container flex flex-col gap-20 px-4 md:px-6">
              <div className="flex items-center justify-center w-full mx-auto wrap-original-transform perspective-distant">
                {images.map((src, index) => (
                  <div
                    className={`original-transform relative  w-[300px] overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-gray-900 shadow-xl
                  ${
                    activeIndex === index ? "opacity-100" : "opacity-0 hidden"
                  }`}
                  >
                    <Image key={index} src={src} alt={`Image ${index + 1}`} />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center space-y-8 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Connect Your World with Wasl
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    One link to rule them all. Share your content, social
                    profiles, and more with a single, customizable link.
                  </p>
                </div>
                <div className="w-full max-w-xl space-y-2">
                  <div className="flex items-center space-x-2 border-2 rounded-xl border-primary">
                    <ShInput
                      className="flex-1 max-w-lg py-6 border-2 "
                      placeholder="Yourusername"
                      type="text"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <Link
                      href={`/signup?username=${userName}`}
                      className="   w-[40%] text-sm py-6 text-center rounded-md !text-secondary bg-primary  "
                    >
                      Claim Your Wasl
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 bg-gray-100 md:py-24 lg:py-32 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <CheckCircle className="w-10 h-10 text-blue-600" />
                  <h2 className="text-xl font-bold">Easy to Use</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Create your Wasl link in minutes. No technical skills
                    required.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Share2 className="w-10 h-10 text-blue-600" />
                  <h2 className="text-xl font-bold">Share Anywhere</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Use your Wasl link on social media, email signatures, or
                    anywhere you want.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Zap className="w-10 h-10 text-blue-600" />
                  <h2 className="text-xl font-bold">Powerful Analytics</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Track clicks and engagement to optimize your online
                    presence.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col items-center w-full gap-2 px-4 py-6 border-t sm:flex-row shrink-0 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Wasl. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default Home;
