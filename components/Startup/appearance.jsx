"use client";

import React, { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ShInput } from "@/components/ui/input";
import { Shlabel } from "@/components/ui/label";
import AuthContext from "@/context/auth";
import { cn } from "@/lib/utils";
import ThemeSelector from "../ui/themeSelector";
import { AstroPurple, CosmicCandy } from "../Themes/Themes";
import AppearanceContext from "@/context/appearance";
export default function Appearance(props) {
  const {
    prevStep,
    submitHandler,
    profileTitle,
    setProfileTitle,
    about,
    setAbout,
    loading,
    genreate,
    className,
    theme,
    setTheme,
  } = props;

  const { avatar } = useContext(AppearanceContext);
  const themes = [CosmicCandy, AstroPurple];

  useEffect(() => {
    setTheme(CosmicCandy);
  }, []);
  useEffect(() => {
    console.log(avatar);
  }, [avatar]);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl space-y-8 rounded-xl bg-card/95 p-8 shadow-lg   sm:p-10 md:p-12 lg:p-14",
        className
      )}
    >
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <h1 className="text-2xl font-bold tracking-tight text-secondary-foreground">
            Appearance
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-secondary-foreground ">
                Avatar
              </h2>
              <p className="text-sm text-secondary-foreground/60">
                Update your profile picture.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  alt="@shadcn"
                  src={avatar.preview ? avatar.preview : avatar.image}
                />
                <AvatarFallback className="bg-secondary">JP</AvatarFallback>
              </Avatar>
              <Shlabel
                htmlFor="file"
                className="p-4 rounded-md bg-primary text-secondary "
              >
                <ShInput
                  id="file"
                  className="sr-only"
                  type="file"
                  onChange={avatar.handleImageChange}
                />
                Upload Your Photo
              </Shlabel>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-secondary-foreground">
                Theme
              </h2>
              <p className="text-sm text-secondary-foreground/60">
                Choose Your Theme.
              </p>
            </div>
            <ThemeSelector
              themes={themes}
              currentTheme={theme}
              setTheme={setTheme}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-secondary-foreground">
              Profile Title
            </h2>
            <p className="text-sm text-secondary-foreground/60">
              Update your Profile Title.
            </p>
          </div>
          <ShInput
            className="w-full py-6 text-white dark:bg-input"
            placeholder="Enter your  Profile Title..."
            onChange={(e) => setProfileTitle(e.target.value)}
            value={profileTitle}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-secondary-foreground">
              Description
            </h2>
            <p className="text-sm text-secondary-foreground/60">
              Update your profile description.
            </p>
          </div>

          <div className="flex items-center justify-between bg-input ">
            <Textarea
              className="min-h-[120px] pt-4 resize-none bg-input text-white !border-none !outline-none focus:outline-none"
              placeholder={
                loading ? "loading8..." : "Enter your description..."
              }
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              disabled={loading ? true : false}
            />
            {about && (
              <Button
                type="button"
                className="text-secondary me-4"
                onClick={genreate}
              >
                Re-Genreate
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center w-3/5 space-x-2">
          <Button onClick={() => prevStep()} className="flex-1 text-secondary">
            Previous
          </Button>
          <Button type="submit" className="flex-1 text-secondary">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
