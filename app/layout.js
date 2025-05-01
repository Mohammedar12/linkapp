import { Poppins } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "./GlobalProviders";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Suspense } from "react";
import { Toaster, toast } from "sonner";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Wasl App",
  description:
    "Create Your Own Wasl Link. Share your content, social profiles, and more with a single, customizable link.",
};
export const dynamic = "force-dynamic";
export default function RootLayout({ children, ...props }) {
  return (
    <html lang="en">
      <GlobalProvider>
        <body className={poppins.className}>
          {" "}
          <NextThemesProvider
            {...props}
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </NextThemesProvider>
        </body>
      </GlobalProvider>
    </html>
  );
}
