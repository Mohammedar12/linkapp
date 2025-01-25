"use client";
import { Button } from "@mui/material";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState, useRef } from "react";
import { Unlink } from "lucide-react";
import {
  motion,
  stagger,
  useAnimate,
  Transition,
  useScroll,
  useMotionValueEvent,
  useTransform,
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
import user1 from "../../assets/user1.jpg";
import bgImage from "../../assets/bg-image3.jpg";

import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { SiYoutube } from "react-icons/si";
import { RiTwitterXLine } from "react-icons/ri";
import Particles from "@/components/ui/particles";
import WordRotate from "@/components/ui/word-rotate";
import { TbMailFast } from "react-icons/tb";
import { Cover } from "@/components/ui/cover";
import SiteContext from "@/context/site";
import { Skeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/hooks/useSocket";
import AuthContext from "@/context/auth";
import { delay } from "lodash";

const iconMap = {
  x: RiTwitterXLine,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: SiYoutube,
  tiktok: FaTiktok,
};

const LoadingSkeleton = ({ site }) => (
  <>
    <div
      className="absolute z-10 inset-[50%] translate-y-[-50%] translate-x-[-50%] flex items-center justify-center   size-full "
      style={{
        background: site?.theme?.isGradient
          ? `linear-gradient(${site?.theme?.gradient?.dir}, ${site?.theme?.gradient?.from}, ${site?.theme?.gradient?.to})`
          : site?.theme?.bgColor,
      }}
    />
  </>
);

const InactiveSite = ({ site }) => (
  <div className="flex items-center justify-center h-dvh bg-secondary/40">
    <Card className="flex flex-col items-center justify-center space-y-8 w-[500px] h-[600px] bg-secondary">
      <CardHeader className="pb-0">
        <Cover className="w-[490px]">
          <TbMailFast className="text-[130px] text-primary m-auto" />
        </Cover>
      </CardHeader>
      <CardTitle className="text-3xl">
        {!site.isActive && (!site.isExists ? "Not Exist " : "Inactive")}
      </CardTitle>
      <CardDescription className="text-lg">
        {!site.isActive &&
          (!site.isExists
            ? " Sorry This Site Not Exist"
            : " Sorry This Site Is Inactive")}
      </CardDescription>
      <CardContent>
        {!site.isActive &&
          (!site.isExists ? (
            <Link href="/">Create Your Site</Link>
          ) : (
            <Link href="/admin">Active Your Site</Link>
          ))}
      </CardContent>
    </Card>
  </div>
);

const ListItem = ({ link, index, site, addClicks }) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: false, amount: 0.5 });
  const isEven = index % 2 === 0;
  const xOffset = isEven ? 50 : -50;

  const links = site?.links || [];

  const getColumnSpan = () => {
    const prevType = index > 0 ? links[index - 1]?.type : null;
    const nextType = index < links.length - 1 ? links[index + 1]?.type : null;

    if (links.length === 1) return "col-span-2";
    if (link.type === "Link") {
      if (prevType === "Header" && nextType === "Link") return "col-span-1";
      if (prevType === "Link" && nextType === "Header") return "col-span-1";
      if (prevType === "Header" && nextType === "Header") return "col-span-2";
      if (prevType === "Header" && nextType === null) return "col-span-2";
      return "col-span-1";
    }
    return "col-span-2";
  };

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
  }, [isInView, animate, index, xOffset]);

  const columnSpanClass = getColumnSpan();

  return (
    <>
      {link.type === "Link" ? (
        <motion.li
          ref={scope}
          className={`w-full rounded-xl border-pink-300 border-opacity-40 ${columnSpanClass}`}
          style={{
            background: site?.theme?.linkStyle?.isGradient
              ? `linear-gradient(${site?.theme?.linkStyle?.gradient?.dir}, ${site?.theme?.linkStyle?.gradient?.from}, ${site?.theme?.linkStyle?.gradient?.to})`
              : site?.theme?.linkStyle?.bgColor,
          }}
        >
          <Button
            className="!text-black py-5 w-[100%]"
            target="_blank"
            onClick={() => addClicks(link?._id)}
            href={`https://${link?.url}`}
          >
            {link?.title}
          </Button>
        </motion.li>
      ) : (
        <motion.li
          ref={scope}
          className={`w-full 
            ${columnSpanClass}
            my-3 !bg-transparent 
            ${index !== 0 ? "border-b-4 border-t-4 " : "border-b-4 "}
            rounded-none border-pink-300 border-opacity-40`}
        >
          <Button
            className="!text-white font-bold py-5 w-[100%] pointer-events-none"
            target="_blank"
          >
            {link?.title}
          </Button>
        </motion.li>
      )}
    </>
  );
};

export default function UserSite() {
  const { getSite, site, setSite, updateReports, addClicks } =
    useContext(SiteContext);
  const { userData } = useContext(AuthContext);
  const params = useParams();
  const socket = useSocket(userData?._id);
  const hasCalledAPI = useRef(false);

  const path = site?.svgSlug;
  const [loading, setLoading] = useState(true);
  const transitionTime = 1;

  const pathVariants = {
    hidden: {
      pathLength: 0,
      fill: "rgba(240, 248, 255, 0)",
      stroke: "rgba(240, 248, 255, 1)",
    },
    visible: {
      pathLength: 1,
      fill: [
        "rgba(240, 248, 255,  0)",
        "rgba(240, 248, 255, 1)",
        "rgba(240, 248, 255,  0)",
      ],
      stroke: "rgba(240, 248, 255, 0)",

      transition: {
        pathLength: {
          duration: 3.5 + transitionTime,
          ease: "easeInOut",
        },
        fill: {
          duration: 1.5 + transitionTime,
          ease: "easeInOut",
          times: [0, 0.8, 1],
          delay: 0.8, // Start filling after path is partially drawn
        },
        stroke: {
          duration: 1.5 + transitionTime,
          ease: "easeInOut",

          delay: 0.8,
        },
      },
    },
  };

  useEffect(() => {
    if (!socket) return;

    const handleSiteUpdate = (data) => {
      if (data.type === "SITE_UPDATE") {
        setSite((prevSite) => {
          const newSite = { ...prevSite, ...data.payload.site };

          console.log("Site updated:", newSite);

          return newSite;
        });
      }
    };

    // Add the event listener
    socket.on("site:update", handleSiteUpdate);

    // Cleanup function
    return () => {
      socket.off("site:update", handleSiteUpdate);
    };
  }, [socket]);

  useEffect(() => {
    getSite(params.slug);
  }, []);

  useEffect(() => {
    if (!hasCalledAPI.current) {
      const timer = setTimeout(() => {
        updateReports(params.slug);
        hasCalledAPI.current = true;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [params.slug]);

  useEffect(() => {
    setLoading(false);
  }, [site]);

  const SocialLinks = ({ className }) => (
    <div className={`hidden justify-around my-4 ${className}`}>
      {site?.social?.map((link, i) => {
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

  const Mainsite = () => {
    return (
      <>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: [1, 1, 0, 0],
            display: ["block", "block", "block", "none"],
          }}
          transition={{
            duration: 1 + transitionTime,
            delay: 2,
            times: [0, 0.5, 0.9, 1],
            ease: "easeInOut",
          }}
          className="absolute z-10 inset-[50%] translate-y-[-50%] translate-x-[-50%] flex items-center justify-center   size-full "
          style={{
            background: site?.theme?.isGradient
              ? `linear-gradient(${site?.theme?.gradient?.dir}, ${site?.theme?.gradient?.from}, ${site?.theme?.gradient?.to})`
              : site?.theme?.bgColor,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible absolute z-10 inset-[50%] translate-y-[-50%] translate-x-[-50%]"
          >
            <motion.path
              d={path}
              strokeWidth="2"
              strokeLinecap="round"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={pathVariants}
            />
          </svg>
          <div className="absolute z-[3]  opacity-55  inset-[50%] translate-y-[-50%] translate-x-[-50%] flex items-center justify-center bg-black  size-full " />
        </motion.div>
        <div className="relative w-full h-full min-h-screen overflow-hidden">
          <div className=" grid gap-4  grid-cols-none xl:grid-cols-2 xs:flex xs:flex-col px-5 justify-items-center items-center z-[1] ">
            <Card className="col-span-1 bg-transparent border-none shadow-none">
              <CardContainer className="inter-var xs:w-full">
                <CardBody
                  className={` relative group/card mobile:w-[380px]  xs:w-[280px] xs:h-[350px] dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]   w-[30rem] h-auto rounded-xl p-6  `}
                  style={{
                    backgroundColor: site?.theme?.AvatarBgColor,
                  }}
                >
                  <CardItem translateZ="100" className="w-full mt-4">
                    <div className="relative flex items-center flex-col justify-center w-full mobile:h-[430px]  h-[545px]  xs:h-[260px]  ">
                      <div className="aspect-[4/5] top-[80px] inset-0 w-full object-top object-cover rounded-xl group-hover/card:shadow-xl before:block before:absolute z-10 size-[110%]  before:bg-black relative inline-block">
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
                      <div className="relative gap-[10px] xs:gap-[5px] xs:bottom-[40px] bottom-[75px] z-10 flex flex-col items-center justify-end h-full p-6 space-y-3 text-white">
                        <WordRotate
                          className="flex items-center xs:text-base"
                          words={[
                            ...(site?.title ? [site.title] : []),
                            ...(Array.isArray(site?.skills) ? site.skills : []),
                          ].filter(Boolean)}
                          duration={2500}
                          charDuration={0.6}
                          charDelayMultiple={0.03}
                        />
                        {site?.experience !== 0 && (
                          <div className="flex items-center !m-0 xs:text-xs">
                            <span className="text-sm xs:text-[0.75rem]">
                              {site?.experience} Years Of Experience
                            </span>
                          </div>
                        )}

                        <div className="flex items-center !m-0 xs:text-xs">
                          <span className="text-sm xs:text-[0.75rem]">
                            {site?.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
              <SocialLinks className={"z-20 xl:flex"} />
            </Card>
            <SocialLinks className="mxl:flex" />

            <div className="col-span-1">
              <div className="max-w-[420px] text-center m-auto border-b-2 border-pink-300 pb-6 mb-6">
                {site?.about}
              </div>
              <motion.ul className="grid grid-cols-2 gap-4 p-4 xs:grid-cols-1">
                {site?.links?.map((link, i) => (
                  <ListItem
                    key={link._id}
                    addClicks={addClicks}
                    link={link}
                    index={i}
                    site={site}
                  />
                ))}
              </motion.ul>
            </div>
            <div className="my-4 ">
              <span className="flex items-center gap-2">
                Made By
                <span className="flex items-center gap-2 text-primary">
                  <Unlink className="w-[20px] " />
                  Wasl App
                </span>
              </span>
            </div>
          </div>
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
            className="absolute inset-0 opacity-50 -z-20 xs:w-full xs:h-full"
            style={{
              background: site?.theme?.isGradient
                ? `linear-gradient(${site?.theme?.gradient?.dir}, ${site?.theme?.gradient?.from}, ${site?.theme?.gradient?.to})`
                : site?.theme?.bgColor,
            }}
          />
          <div className="absolute inset-0 h-full -z-30 xs:h-full">
            {site?.theme?.bgImage.url !== "" && (
              <Image
                src={site?.theme?.bgImage?.url}
                width={500}
                height={500}
                className="inset-0 object-cover object-center w-full h-full"
                alt="thumbnail"
                priority
                quality={100}
              />
            )}
          </div>
        </div>
      </>
    );
  };

  if (loading || site === undefined) {
    return <LoadingSkeleton site={site} />;
  }

  return site?.isActive ? <Mainsite /> : <InactiveSite site={site} />;
}
