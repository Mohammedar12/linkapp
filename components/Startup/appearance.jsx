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
        "mx-auto w-full max-w-3xl space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 sm:p-10 md:p-12 lg:p-14",
        className
      )}
    >
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Appearance
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                Avatar
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your profile picture.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  alt="@shadcn"
                  src={avatar.preview ? avatar.preview : avatar.image}
                />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <Shlabel
                htmlFor="file"
                className="p-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                variant="outline"
              >
                <ShInput
                  id="file"
                  className="sr-only"
                  type="file"
                  onChange={avatar.handleImageChange}
                />
                Upload Your Photo
              </Shlabel>
              {/* <Input type="file" /> */}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                Theme
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
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
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
              Profile Title
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your Profile Title.
            </p>
          </div>
          <ShInput
            className="w-full py-6 text-white dark:bg-slate-900"
            placeholder="Enter your  Profile Title..."
            onChange={(e) => setProfileTitle(e.target.value)}
            value={profileTitle}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
              Description
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your profile description.
            </p>
          </div>

          <div className="flex items-center justify-between bg-slate-900 ">
            <Textarea
              className="min-h-[120px] pt-4 resize-none bg-slate-900 text-white !border-none !outline-none focus:outline-none"
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
                className="text-white bg-blue-300 hover:bg-blue-600 me-4"
                onClick={genreate}
              >
                Re-Genreate
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => prevStep()}
            className="text-white bg-blue-500 hover:bg-blue-600"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            type="submit"
            className="text-white bg-blue-500 hover:bg-blue-600"
            variant="outline"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
