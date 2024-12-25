"use client";

import { useContext, useEffect, useState } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import Gradient from "@/components/ui/gradient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Social from "@/components/Startup/socials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import _ from "lodash";
import { Shlabel } from "@/components/ui/label";
import { ShInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppearanceContext from "@/context/appearance";
import SiteContext from "@/context/site";
import { IoIosRemoveCircleOutline } from "react-icons/io";

import user1 from "@/assets/user1.jpg";

import PickColor from "@/components/ui/pickColor";
import { AstroPurple, CosmicCandy } from "@/components/Themes/Themes";
import ThemeSelector from "@/components/ui/themeSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
export const dynamic = "force-dynamic";
export default function AppearancePage() {
  const { userSite, updateSite, loading, setLoading } = useContext(SiteContext);
  const {
    handleInputChange,
    convertValuesToPayload,
    socials,
    platforms,
    initialSocialValues,
    profileTitle,
    setProfileTitle,
    about,
    setAbout,
    setSlug,
    slug,
    avatar,
    bgImage,
    skills,
    setSkills,
    theme,
    setTheme,
    bgOpacity,
    setbgOpacity,
    location,
    setLocation,
    experience,
    setExperience,
  } = useContext(AppearanceContext);

  const [bgColor, setBgColor] = useState(theme?.bgColor || "#3B82F6");
  const [linkBgColor, setLinkBgColor] = useState(
    theme?.linkStyle?.bgColor || "#fff"
  );
  const [headerBgColor, setHeaderBgColor] = useState(
    theme?.headerStyle?.bgColor || "#ffffff00"
  );
  const [avatarBgColor, setAvatarBgColor] = useState(
    theme?.AvatarBgColor || userSite?.theme?.AvatarBgColor || "#000000"
  );

  const [isParticles, setIsParticles] = useState(theme?.isParticles || true);

  useEffect(() => {
    setTheme({
      ...theme,
      bgColor: bgColor,
      AvatarBgColor: avatarBgColor,
      isParticles,
      linkStyle: { ...theme?.linkStyle, bgColor: linkBgColor },
    });
  }, [bgColor, avatarBgColor, isParticles, linkBgColor]);

  const [newSkill, setNewSkill] = useState("");

  const addSkill = (e) => {
    e.preventDefault();
    console.log("Current skills:", skills);
    if (newSkill && skills.length < 3 && !skills.includes(newSkill)) {
      console.log("Adding skill:", newSkill);
      setSkills((prevSkills) => {
        console.log("Previous skills:", prevSkills);
        return [...prevSkills, newSkill];
      });
      setNewSkill("");
    } else {
      console.log("Cannot add skill");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills?.filter((skill) => skill !== skillToRemove));
  };

  const themes = [CosmicCandy, AstroPurple];

  const submitHandler = (event) => {
    event.preventDefault(); // This is necessary for React synthetic events
    setLoading(true);
    debouncedHandler(event);
  };

  const debouncedHandler = debounce((event) => {
    const payload = convertValuesToPayload(socials);
    console.log("working");

    let isReadyTheme = theme.isReadyTheme || false; // Add this flag to your theme object
    let allThemesDifferent = true;
    const newProfile = {
      skills,
      title: profileTitle,
      theme: {
        ...theme,
        isReadyTheme, // Include the flag in the theme object
        bgImage: null, // We'll handle bgImage separately
      },
      slug: slug,
      slug: slug,
      social: payload,
      about,
      experience,
      location,
      avatar: null, // We'll handle avatar separately
    };

    const changedFields = _.omitBy(newProfile, (value, key) => {
      return _.isEqual(value, _.get(userSite, key));
    });

    console.log("Changed Fields:", changedFields.theme);

    const formData = new FormData();

    // Handle theme as a single JSON string

    themes.forEach((theme) => {
      const isEqual = _.isEqual(theme, changedFields.theme);
      console.log(
        `Theme: ${theme.themeName || "Unnamed"}, Is Equal: ${isEqual}`
      );

      if (isEqual) {
        allThemesDifferent = false;
      }
    });

    if (changedFields.theme) {
      formData.append(
        "theme",
        JSON.stringify({
          ...changedFields.theme,
          bgImage: { ...theme.bgImage, url: bgImage.image },
          isReadyTheme: !allThemesDifferent ? true : false, // Include the flag here as well
        })
      );
    }

    // Handle other fields
    Object.entries(changedFields).forEach(([key, value]) => {
      if (key !== "theme") {
        if (_.isObject(value) && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });

    // Handle file uploads separately
    if (avatar && avatar.image instanceof File) {
      formData.append("avatar", avatar.image, avatar.image.name);
    }
    if (bgImage && bgImage.image instanceof File) {
      formData.append("bgImage", bgImage.image, bgImage.image.name);
    }

    // Log the FormData content
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name);
      } else {
        console.log(`${key}:`, value);
      }
    }

    updateSite(formData);
    setLoading(false);
    setLoading(false);
  }, 700);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if within a form
      addSkill(e); // Call your main function
    }
  };

  const handleSwitchChange = async () => {
    const newChecked = !isParticles;
    setIsParticles(newChecked);
  };

  return (
    <div className="w-full max-w-3xl p-8 mx-auto space-y-8 shadow-lg bg-secondary rounded-xl sm:p-10 md:p-12 lg:p-14">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <h1 className="text-2xl font-bold tracking-tight text-secondary-foreground">
          Appearance
        </h1>
      </div>
      <form onSubmit={submitHandler}>
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="socials">Socials</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium text-secondary-foreground">
                    Profile Picture
                  </h2>

                  <p className="text-sm text-secondary-foreground">
                    Update your profile picture.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20 rounded-md ">
                    <AvatarImage
                      alt="@shadcn"
                      src={
                        avatar.preview ? avatar.preview : avatar.image || user1
                      }
                    />

                    <AvatarFallback className="bg-input">JP</AvatarFallback>
                  </Avatar>

                  <Shlabel
                    htmlFor="file"
                    className="p-4 rounded-md text-primary-foreground bg-primary/80 hover:bg-primary"
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
              <div className="flex justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-secondary-foreground">
                      Profile Title
                    </h2>
                    <p className="text-sm text-secondary-foreground/70">
                      Update your Profile Title.
                    </p>
                  </div>
                  <ShInput
                    className="w-full py-6 text-secondary-foreground bg-input"
                    placeholder="Enter your  Profile Title..."
                    onChange={(e) => setProfileTitle(e.target.value)}
                    value={profileTitle}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-secondary-foreground">
                      Page Slug <q>Username</q>
                    </h2>
                    <p className="text-sm text-secondary-foreground/70">
                      Update your Page slug <q>Username</q>.
                    </p>
                  </div>
                  <ShInput
                    className="w-full py-6 text-secondary-foreground bg-input"
                    placeholder="Enter your  Profile Title..."
                    onChange={(e) => setSlug(e.target.value)}
                    value={slug}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-secondary-foreground">
                  Description
                </h2>

                <p className="text-sm text-secondary-foreground/70">
                  Update your profile description.
                </p>
              </div>

              <Textarea
                className="min-h-[120px] bg-input text-secondary-foreground"
                placeholder={
                  loading ? "loading8..." : "Enter your description..."
                }
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                disabled={loading ? true : false}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-secondary-foreground">
                  Add Your Skills
                </h2>
                <p className="text-sm text-secondary-foreground/70">
                  Enter 1-3 Skills.
                </p>
              </div>

              <div className="flex items-center w-full gap-4">
                <div className="flex items-center flex-1 gap-4 bg-input">
                  {skills?.length !== 3 && (
                    <>
                      <ShInput
                        className="py-6 text-secondary-foreground"
                        placeholder="Skills"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        disabled={skills?.length >= 3}
                        onKeyDown={handleKeyDown}
                      />
                    </>
                  )}
                  {skills?.length !== 0 && (
                    <ul className="flex items-center gap-2 py-3 mx-3">
                      {skills?.map((skill, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 p-1 px-2 text-sm rounded-md bg-primary-foreground w-max"
                        >
                          {skill}
                          <IoIosRemoveCircleOutline
                            onClick={() => removeSkill(skill)}
                            className="cursor-pointer"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium text-secondary-foreground">
                    Experience
                  </h2>
                  <p className="text-sm text-secondary-foreground/70">
                    Add your experience years.
                  </p>
                </div>
                <ShInput
                  type="number"
                  className="w-full py-6 text-secondary-foreground bg-input"
                  placeholder="Enter your  Profile Title..."
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium text-secondary-foreground">
                    Location
                  </h2>
                  <p className="text-sm text-secondary-foreground/70">
                    Add your location if you want.
                  </p>
                </div>
                <ShInput
                  type="text"
                  className="w-full py-6 text-secondary-foreground bg-input"
                  placeholder="Enter your  Profile Title..."
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                />
              </div>
            </div>

            <div className="space-y-4 ">
              <Button type="submit">Save</Button>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <div className="font-medium"></div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">
                  Background
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="space-y-4">
                    <h2 className="text-sm font-medium text-secondary-foreground">
                      Background Image
                    </h2>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20 rounded-md ">
                        <AvatarImage
                          alt="@shadcn"
                          src={
                            bgImage.preview
                              ? bgImage.preview
                              : bgImage.image || user1
                          }
                        />
                        <AvatarFallback>JP</AvatarFallback>
                      </Avatar>

                      <Shlabel
                        htmlFor="file"
                        className="p-4 rounded-md text-primary-foreground bg-primary/80 hover:bg-primary"
                        variant="outline"
                      >
                        <ShInput
                          id="file"
                          className="sr-only"
                          type="file"
                          onChange={bgImage.handleImageChange}
                        />
                        Upload
                      </Shlabel>
                      {/* <Input type="file" /> */}
                    </div>
                  </div>
                  <Tabs defaultValue="gradient" className="space-y-6">
                    <TabsList className="mt-3">
                      <TabsTrigger
                        value="gradient"
                        onClick={() => setTheme({ ...theme, isGradient: true })}
                      >
                        Gradient
                      </TabsTrigger>
                      <TabsTrigger
                        value="color"
                        onClick={() =>
                          setTheme({ ...theme, isGradient: false })
                        }
                      >
                        Flat Color
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="gradient">
                      <Gradient type="background" />
                    </TabsContent>
                    <TabsContent value="color">
                      <PickColor color={theme?.bgColor} setColor={setBgColor} />
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg">
                  {" "}
                  Avatar Border Color
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <PickColor
                    color={avatarBgColor}
                    setColor={setAvatarBgColor}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg">Links</AccordionTrigger>
                <AccordionContent className="px-4 ">
                  <Tabs defaultValue="gradient" className="space-y-6">
                    <TabsList className="mt-3">
                      <TabsTrigger
                        value="gradient"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            linkStyle: {
                              ...theme.linkStyle,
                              isGradient: true,
                            },
                          })
                        }
                      >
                        Gradient
                      </TabsTrigger>
                      <TabsTrigger
                        value="color"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            linkStyle: {
                              ...theme.linkStyle,
                              isGradient: false,
                            },
                          })
                        }
                      >
                        Flat Color
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="gradient">
                      <Gradient type="link" />
                    </TabsContent>
                    <TabsContent value="color">
                      <PickColor
                        color={linkBgColor}
                        setColor={setLinkBgColor}
                        IsGradient={false}
                      />
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">Headers</AccordionTrigger>
                <AccordionContent className="px-4 ">
                  <Tabs defaultValue="gradient" className="space-y-6">
                    <TabsList className="mt-3">
                      <TabsTrigger
                        value="gradient"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            headerStyle: {
                              ...theme.headerStyle,
                              isGradient: true,
                            },
                          })
                        }
                      >
                        Gradient
                      </TabsTrigger>
                      <TabsTrigger
                        value="color"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            headerStyle: {
                              ...theme.headerStyle,
                              isGradient: false,
                            },
                          })
                        }
                      >
                        Flat Color
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="gradient">
                      <Gradient type="header" />
                    </TabsContent>
                    <TabsContent value="color">
                      <PickColor
                        color={headerBgColor}
                        setColor={setHeaderBgColor}
                        IsGradient={false}
                      />
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg">
                  {" "}
                  Particles
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between px-4">
                  <h3>Show Particles</h3>
                  <Switch onClick={handleSwitchChange} checked={isParticles} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="space-y-4 ">
              <Button disabled={loading ? true : false} type="submit">
                Save
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <ThemeSelector
              themes={themes}
              currentTheme={theme}
              setTheme={setTheme}
            />
            <div className="space-y-4 ">
              <Button type="submit">Save</Button>
            </div>
          </TabsContent>

          <TabsContent value="socials" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-secondary-foreground">
                  Add Social Links
                </h2>
                <p className="text-sm text-secondary-foreground/70">
                  Enter your social links.
                </p>
              </div>

              <Social
                values={socials}
                platforms={platforms}
                initialSocialValues={initialSocialValues}
                handleInputChange={handleInputChange}
                page="appearance"
              />
            </div>

            <Button type="submit">Save</Button>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
