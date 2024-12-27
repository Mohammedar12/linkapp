"use client";
import { useContext, useRef, useState } from "react";

import { SideNavbar } from "@/components/Admin/SideNavbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useParams, usePathname } from "next/navigation";
import AuthContext from "@/context/auth";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Button as MuiBtn } from "@mui/material";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import SiteContext from "@/context/site";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LuCopy, LuCopyCheck } from "react-icons/lu";

export default function UserLayout({ children }) {
  const { userData, sendVerifyToken, tokenSent } = useContext(AuthContext);
  const [verify, setVerify] = useState(null);
  const { site } = useContext(SiteContext);
  const { loading, setLoading, iFrameReload, setIframReload } =
    useContext(SiteContext);

  const [alert, setAlert] = useState(false);
  const pathname = usePathname();

  const [copyStatus, setCopyStatus] = useState(false);

  const profileUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/${userData?.username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopyStatus(false);
    }
  };

  const iframeRef = useRef(null);

  const isSettingsPage =
    pathname === "/admin/settings" || pathname === "/admin/overview";

  useEffect(() => {
    // Once userData is available (either null or with data), we're no longer loading
    if (userData !== undefined) {
      console.log(userData);

      setLoading(false);
    }
  }, [userData]);

  if (isSettingsPage) {
    return (
      <>
        <div className="flex flex-col h-screen md:flex-row">
          <SideNavbar />

          {/* Main content area */}
          <div className="flex-1 ">
            <div className="py-8 mx-4 mt-4 md:mx-auto">{children}</div>
          </div>
        </div>
      </>
    );
  }

  if (pathname === "/admin/verify") {
    return <> {children}</>;
  }

  const Iframe = () => {
    return (
      <iframe
        id="previewIframe"
        ref={iframeRef}
        className="w-full h-full rounded-md "
        src={profileUrl}
      />
    );
  };
  const VerifyAlert = () => {
    return (
      <Alert className="flex flex-col justify-between gap-3 mb-6 space-x-2 border-none sm:flex-row bg-secondary">
        <div className="flex flex-col items-center space-x-2 text-center sm:text-start sm:flex-row ">
          <div className="flex flex-col items-center space-y-2 sm:items-start ">
            <AlertTitle className="flex items-center space-x-2 ">
              <IconAlertTriangleFilled className=" min-w-8" /> Your Accout Not
              Verified Yet
            </AlertTitle>
            <AlertDescription>
              your site is inacitve until your accout verified, check your email
              to verify
            </AlertDescription>
          </div>
        </div>
        <Button onClick={sendVerifyToken}>{tokenSent}</Button>
      </Alert>
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen md:flex-row">
        {/* Sidebar */}

        <SideNavbar />

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto xl:mt-32 ">
          <div className="max-w-3xl py-8 mx-4 mt-4 md:mx-auto  md:w-[clamp(400px,80%,740px)]  ">
            {userData?.isVerified === false && <VerifyAlert />}
            <div className="flex flex-col flex-wrap items-stretch justify-between gap-2 text-center sm:items-center sm:text-start sm:flex-row">
              <h1 className="flex-1 text-xl font-semibold">
                Manage Your Links
              </h1>
              <div
                className={`flex-1  flex justify-between items-center py-2 px-4  my-6 rounded-xl   duration-100 ${
                  copyStatus
                    ? "bg-card text-secondary-foreground/65  "
                    : "bg-secondary/70 text-secondary-foreground "
                }`}
              >
                <MuiBtn
                  className="lowercase text-text"
                  target="_blank"
                  href={profileUrl}
                >
                  {`${process.env.NEXT_PUBLIC_IFRAME_URL}/${userData?.username}`}
                </MuiBtn>
                <Button
                  type="button"
                  className={` duration-500 ${
                    copyStatus
                      ? "bg-primary/40 text-secondary-foreground  hover:bg-primary/40  "
                      : "bg-primary/90 text-secondary-foreground "
                  }`}
                  onClick={handleCopy}
                >
                  {copyStatus ? (
                    <LuCopyCheck className="animate-pop" />
                  ) : (
                    <LuCopy />
                  )}
                </Button>
              </div>
            </div>
            {children}{" "}
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="block m-auto mt-5 xl:hidden bg-primary text-text">
                  Preview Site
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="w-full max-w-sm mx-auto">
                  <div className="p-4 pb-0">
                    <div className="my-10">
                      <div className=" h-[650px] ">
                        <Iframe />{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        {/* Iframe container */}
        <div className="items-center justify-center hidden w-1/3 gap-10 xl:flex">
          <div className="w-0.5 h-full bg-foreground/50 hidden xl:flex" />
          <div className=" flex-col w-[380px] xl:flex items-center  justify-center">
            <div className="w-[380px] h-[650px]  ">
              <iframe className="w-full h-full rounded-md " src={profileUrl} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
