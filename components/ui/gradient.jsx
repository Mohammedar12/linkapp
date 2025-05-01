"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyIcon, ShuffleIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import AppearanceContext from "@/context/appearance";
import { useEffect } from "react";
import { ShInput } from "./input";
import PickColor from "./pickColor";

const gradientDirections = [
  { value: "to right", label: "Left to Right" },
  { value: "to left", label: "Right to Left" },
  { value: "to bottom", label: "Top to Bottom" },
  { value: "to top", label: "Bottom to Top" },
  { value: "to bottom right", label: "Top Left to Bottom Right" },
  { value: "to bottom left", label: "Top Right to Bottom Left" },
  { value: "to top right", label: "Bottom Left to Top Right" },
  { value: "to top left", label: "Bottom Right to Top Left" },
];

export default function Gradient({ type }) {
  const { theme, setTheme } = useContext(AppearanceContext);
  const [gradients, setGradients] = useState({
    background: {
      from: theme?.gradient?.from || "#10b981",
      to: theme?.gradient.to || "#84cc16",
      dir: theme?.gradient.dir || "to right",
    },
    link: {
      from: theme?.linkStyle?.gradient?.from || "#10b981",
      to: theme?.linkStyle?.gradient?.to || "#84cc16",
      dir: theme?.linkStyle?.gradient?.dir || "to right",
    },
    header: {
      from: theme?.headerStyle?.gradient?.from || "#10b981",
      to: theme?.headerStyle?.gradient?.to || "#84cc16",
      dir: theme?.headerStyle?.gradient?.dir || "to right",
    },
  });

  const { from, to, dir } = gradients[type];

  const setFrom = (color) => {
    setGradients((prev) => ({
      ...prev,
      [type]: { ...prev[type], from: color },
    }));
  };

  const setTo = (color) => {
    setGradients((prev) => ({
      ...prev,
      [type]: { ...prev[type], to: color },
    }));
  };

  const setDirection = (direction) => {
    setGradients((prev) => ({
      ...prev,
      [type]: { ...prev[type], dir: direction },
    }));
  };

  const handleRandom = () => {
    const randomColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16);
    setFrom(randomColor());
    setTo(randomColor());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `background: linear-gradient(${dir}, ${from}, ${to});`
    );
  };

  useEffect(() => {
    setTheme((prev) => ({
      ...prev,
      gradient: type === "background" ? gradients.background : prev.gradient,
      linkStyle: {
        ...prev.linkStyle,
        gradient: type === "link" ? gradients.link : prev.linkStyle.gradient,
      },
      headerStyle: {
        ...prev.headerStyle,
        gradient:
          type === "header" ? gradients.header : prev.headerStyle.gradient,
      },
    }));
  }, [gradients, type]);

  return (
    <div className="w-full max-w-4xl p-6 mx-auto ">
      <div className="flex gap-4">
        <Tabs defaultValue="from" className="relative w-full ">
          <TabsList className="flex py-6 justify-between w-full border-b-[3px] rounded-none border-secondary-foreground/50">
            <TabsTrigger value="from">From Color</TabsTrigger>
            <TabsTrigger value="to">To Color</TabsTrigger>
          </TabsList>
          <TabsContent value="from">
            <PickColor color={from} setColor={setFrom} IsGradient={true} />
          </TabsContent>
          <TabsContent value="to">
            <PickColor color={to} setColor={setTo} IsGradient={true} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-6 space-y-2">
        <span className="font-medium">Select Gradient Direction :</span>
        <Select onValueChange={setDirection} defaultValue={dir}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select gradient direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Gradient Direction</SelectLabel>
              {gradientDirections.map((direction) => (
                <SelectItem key={direction.value} value={direction.value}>
                  {direction.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="relative mt-4">
        <div
          className="w-full h-40 rounded-lg"
          style={{
            background: `linear-gradient(${dir}, ${from}, ${to})`,
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute bg-black top-2 right-2"
          onClick={handleCopy}
        >
          <CopyIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="outline" type={"button"} onClick={handleRandom}>
          <ShuffleIcon className="w-4 h-4 mr-2" />
          Random
        </Button>
      </div>
    </div>
  );
}
