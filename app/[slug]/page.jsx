"use client";
import { Button } from "@mui/material";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  motion,
  stagger,
  useAnimate,
  Transition,
  useScroll,
  useMotionValueEvent,
  useInView,
} from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import bnnar from "@/assets/9114923 1.png";
import user1 from "../../assets/user1.jpg";
import bgImage from "../../assets/bg-image3.jpg";

import {
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaTwitter,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";
import { SiYoutube } from "react-icons/si";
import { RiTwitterXLine } from "react-icons/ri";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "@/components/ui/typewriter-effect";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Particles from "@/components/ui/particles";
import WordRotate from "@/components/ui/word-rotate";

const iconMap = {
  x: RiTwitterXLine,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: SiYoutube,
  tiktok: FaTiktok,
  // Add more mappings as needed
};

function ListItem({ link, index }) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: false, amount: 0.5 });
  const isEven = index % 2 === 0;
  const xOffset = isEven ? 50 : -50;
  useEffect(() => {
    if (isInView) {
      animate(
        scope.current,
        { opacity: 1, y: 0, x: 0 },
        { duration: 0.5, delay: index * 0.2 }
      );
    } else {
      animate(
        scope.current,
        { opacity: 0, y: 0, x: xOffset },
        { duration: 0.5 }
      );
    }
  }, [isInView, animate, index]);

  return (
    <motion.li
      ref={scope}
      className={`w-full ${
        link.type === "Link"
          ? "col-span-1 rounded-xl bg-gradient-to-r    from-blue-200 to-cyan-200"
          : `xs:col-span-1 
               col-span-2  my-3 !bg-transparent ${
                 index !== 0 ? "border-b-4 border-t-4 " : "border-b-4 "
               } rounded-none border-pink-300 border-opacity-40`
      }`}
    >
      {link.type === "Link" ? (
        <Button
          className="!text-black py-5 w-[100%]"
          target="_blank"
          href={`https://${link?.url}`}
        >
          {link?.title}
        </Button>
      ) : (
        <Button
          className="!text-white font-bold py-5 w-[100%] pointer-events-none"
          target="_blank"
        >
          {link?.title}
        </Button>
      )}
    </motion.li>
  );
}

export default function UserSite() {
  const params = useParams();

  const [site, setSite] = useState();

  const getSite = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.base_url}/sites/site/${params.slug}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSite(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSite();
  }, []);

  const SocialLinks = ({ className }) => (
    <div className={`hidden justify-around my-4 ${className}`}>
      {site?.social.map((link, i) => {
        const Icon = iconMap[link.platform.toLowerCase()] || null;
        return (
          <Button
            key={i}
            target="_blank"
            href={`https://${link?.url}`}
            size="icon"
          >
            {Icon && <Icon className="text-white" size={20} />}
          </Button>
        );
      })}
    </div>
  );

  return (
    <>
      {site?.status !== false ? (
        <div className="relative w-full h-full min-h-screen ">
          <div className=" grid gap-4  grid-cols-none xl:grid-cols-2 xs:flex xs:flex-col px-5 justify-items-center items-center z-[1] ">
            <Card className="col-span-1 bg-transparent border-none shadow-none ">
              <CardContainer className="inter-var xs:w-full">
                <CardBody
                  className={` relative group/card mobile:w-[380px]  xs:w-[280px] xs:h-[370px] dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]   w-[30rem] h-auto rounded-xl p-6  `}
                  style={{
                    backgroundColor: site?.theme?.AvatarBgColor,
                  }}
                >
                  <CardItem translateZ="100" className="w-full mt-4 ">
                    <div className="relative flex items-center flex-col justify-center w-full mobile:h-[430px]  h-[545px]  xs:h-[260px]  ">
                      <div className="aspect-[4/5]  inset-0 w-full object-top object-cover rounded-xl group-hover/card:shadow-xl before:block before:absolute z-10 size-[110%]  before:bg-black relative inline-block">
                        <Image
                          src={site?.avatar?.url || user1}
                          width={500}
                          height={500}
                          className="aspect-[4/5] absolute inset-0 w-full object-top object-cover rounded-xl group-hover/card:shadow-xl "
                          alt="thumbnail"
                          priority
                          quality={100}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl aspect-[4/5]   w-full object-top object-cover   group-hover/card:shadow-xl"></div>
                      </div>
                      <div className="relative xs:bottom-[-45px] z-10 flex flex-col items-center justify-end h-full p-6 space-y-3 text-white">
                        <WordRotate
                          className="flex items-center space-x-1 xs:text-base"
                          words={[
                            ...(site?.title ? [site.title] : []),
                            ...(Array.isArray(site?.skills) ? site.skills : []),
                          ].filter(Boolean)}
                          duration={2500}
                          charDuration={0.6}
                          charDelayMultiple={0.03}
                        />

                        <div className="flex items-center space-x-2 xs:text-xs">
                          <span className="text-sm xs:text-[0.75rem]">
                            5 Years Of Experience
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 xs:text-xs">
                          <span className="text-sm xs:text-[0.75rem]">
                            KSA, Jeddah
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
              <SocialLinks className={"xl:flex z-20"} />
            </Card>
            <SocialLinks className="mxl:flex" />

            <div className="col-span-1 ">
              <div className="max-w-[420px] text-center m-auto border-b-2 border-pink-300 pb-6 mb-6">
                {site?.about}
              </div>
              <motion.ul
                className={`grid  grid-cols-[repeat(2,minmax(180px,_250px))] xs:grid-cols-[repeat(1,minmax(150px,_1fr))]
                 gap-4 p-4  `}
              >
                {site?.links?.map((link, i) => (
                  <>
                    <ListItem key={link._id} link={link} index={i} />
                  </>
                ))}
              </motion.ul>
            </div>
          </div>{" "}
          {site?.theme?.isParticles && (
            <Particles
              className="absolute inset-0 -z-10"
              quantity={200}
              ease={80}
              size={0.5}
              color={"#fff"}
              refresh
            />
          )}
          <div
            className="absolute inset-0 opacity-50 -z-20 h-svh xs:h-full" // bg-gradient-to-r from-gray-900 to-black
            style={{
              background: site?.theme.isGradient
                ? `linear-gradient(${site?.theme?.gradient?.dir}, ${site?.theme?.gradient?.from}, ${site?.theme?.gradient?.to})`
                : site?.theme.bgColor,
            }} // background: `linear-gradient(${direction}, ${fromColor}, ${toColor})`,
          />
          <div
            className="absolute inset-0 h-full -z-30 xs:h-full "
            style={{
              background: site?.theme.isGradient
                ? `linear-gradient(${site?.theme?.gradient?.dir}, ${site?.theme?.gradient?.from}, ${site?.theme?.gradient?.to})`
                : site?.theme.bgColor,
            }}
          >
            <Image
              src={bgImage}
              width={500}
              height={500}
              className="inset-0 object-cover object-center w-full h-full "
              alt="thumbnail"
              priority
              quality={100}
            />
          </div>
        </div>
      ) : (
        notFound()
      )}
    </>
  );
}
