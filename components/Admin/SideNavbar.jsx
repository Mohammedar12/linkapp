"use client";

import { useEffect, useState, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarBody,
  SidebarButton,
  SidebarLink,
} from "@/components/ui/sidebar";
import { TbBrandGoogleAnalytics, TbLogout2 } from "react-icons/tb";
import { RiHome4Line, RiSettings2Line } from "react-icons/ri";
import { LuShapes } from "react-icons/lu";
import AuthContext from "@/context/auth";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/icons/logo.svg";

export function SideNavbar() {
  // getCookie("id");
  const { logoutUser, userData } = useContext(AuthContext);

  const links = [
    {
      label: "admin",
      href: "/admin",
      icon: (
        <RiHome4Line className="flex-shrink-0 w-6 h-6 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Overview",
      href: "/admin/overview",
      icon: (
        <TbBrandGoogleAnalytics className="flex-shrink-0 w-6 h-6 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Appearance",
      href: "/admin/appearance",
      icon: (
        <LuShapes className="flex-shrink-0 w-6 h-6 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <RiSettings2Line className="flex-shrink-0 w-6 h-6 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
          <Image className="w-6 mt-6" src={logo} alt="" />
          <div className="flex flex-col gap-2 mt-20">
            <div className="flex flex-col gap-2 mt-8">
              {links.map((link, idx) => (
                <SidebarLink
                  onClick={() => setOpen(!open)}
                  key={idx}
                  link={link}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: userData?.username,
              href: "#",
              icon: (
                <Avatar className="flex justify-center w-8 h-8 text-white capitalize">
                  {userData?.username?.slice(0, 2)}
                </Avatar>
              ),
            }}
          />
          <SidebarButton
            onClick={() => logoutUser()}
            button={{
              label: " Logout",
              icon: (
                <TbLogout2 className="flex-shrink-0 w-6 h-6 text-neutral-700 dark:text-neutral-200" />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userData?.avatar?.url} alt={userData?.username} />
            <AvatarFallback className="uppercase">
              {" "}
              {userData?.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logoutUser()}>
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
