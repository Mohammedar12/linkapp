"use client";

import Social from "@/components/Startup/socials";
import Appearance from "@/components/Startup/appearance";
import Specialization from "@/components/Startup/Specialization";
import Skills from "@/components/Startup/skills";
import { Suspense, useContext, useEffect, useState } from "react";
import SiteContext from "@/context/site";
import AppearanceContext from "@/context/appearance";
import { useSearchParams, useRouter } from "next/navigation";
import AuthContext from "@/context/auth";
export const dynamic = "force-dynamic";

function SuspenseComp() {
  const { userData } = useContext(AuthContext);
  const { createSite, updateUser } = useContext(SiteContext);
  const {
    handleInputChange,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    convertValuesToPayload,
    main,
    onAvatarChange,
    nextStep,
    prevStep,
    socials,
    currentStep,
    platforms,
    initialSocialValues,
    profileTitle,
    setProfileTitle,
    slug,
    setSlug,
    about,
    setAbout,
    loading,
    setLoading,
    avatar,
    setAvatar,
    avatarPreview,
    setAvatarPreview,
    skills,
    setSkills,
    newSkill,
    setNewSkill,
    addSkill,
    removeSkill,
    theme,
    setTheme,
  } = useContext(AppearanceContext);

  const submitHandler = (e) => {
    e.preventDefault();

    const payload = convertValuesToPayload(socials);

    let isAcitve = userData?.isVerified;

    let slugFromParams = localStorage.getItem("usernameFromParams");

    const formData = new FormData();
    formData.set("slug", slugFromParams ? slugFromParams : slug);
    formData.set("title", slugFromParams ? slugFromParams : profileTitle);
    formData.set("social", JSON.stringify(payload));
    formData.set("about", about);
    formData.set("theme", JSON.stringify(theme));
    formData.set("skills", JSON.stringify(skills));

    if (avatar && avatar.image instanceof File) {
      formData.append("avatar", avatar.image, avatar.image.name);
    }

    if (userData?.isVerified) {
      console.log(userData?.isVerified);

      formData.set("isAcitve", userData?.isVerified);
    }

    console.log(formData);

    createSite(formData);
    updateUser({ registerSteps: true });
  };

  const renderStep = () => {
    switch (currentStep.toLowerCase()) {
      case "specialization":
        return (
          <>
            <Specialization
              nextStep={nextStep}
              setAbout={setAbout}
              genreate={main}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedCategory={setSelectedCategory}
              setSelectedSubCategory={setSelectedSubCategory}
            />
          </>
        );
      case "skills":
        return (
          <Skills
            prevStep={prevStep}
            nextStep={nextStep}
            skills={skills}
            setSkills={setSkills}
          />
        );
      case "socials":
        return (
          <Social
            prevStep={prevStep}
            nextStep={nextStep}
            values={socials}
            platforms={platforms}
            initialSocialValues={initialSocialValues}
            handleInputChange={handleInputChange}
          />
        );
      case "appearance":
        return (
          <Appearance
            nextStep={nextStep}
            prevStep={prevStep}
            submitHandler={submitHandler}
            profileTitle={profileTitle}
            setProfileTitle={setProfileTitle}
            about={about}
            setAbout={setAbout}
            genreate={main}
            onAvatarChange={onAvatarChange}
            avatar={avatarPreview}
            setAvatar={setAvatar}
            setTheme={setTheme}
            theme={theme}
            loading={loading}
          />
        );
      // Add more cases for additional steps if necessary
      default:
        return <Specialization />;
    }
  };

  return (
    <main className="flex items-center justify-center w-full min-h-screen px-4 py-12 bg-secondary gap sm:px-6 lg:px-8">
      {renderStep()}
    </main>
  );
}

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspenseComp />
    </Suspense>
  );
}
