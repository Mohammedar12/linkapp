"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Links } from "@/components/Link/Link";

import { useCallback, useContext, useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { IoIosAdd } from "react-icons/io";
import SiteContext from "@/context/site";

import IframeResizer from "@iframe-resizer/react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const [url, setUrl] = useState("");

  const {
    items,
    setItems,
    userSite,
    newLink,
    remove,

    updateBackend,
    getSite,
  } = useContext(SiteContext);

  const placeholders = [
    "Add Your Link Here !",
    "Have A Store ? Add The Link Here !",
    "mysite.com !",
  ];

  // const params = useParams();

  // const updateBackend = useCallback(async (updatedItems) => {
  //   try {
  //     const response = await axios.put(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/sites/reorder`,
  //       {
  //         links: updatedItems.map((item, index) => ({
  //           id: item._id,
  //           index: index,
  //         })),
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     // handleRefresh();
  //     console.log("Order updated in backend", response.data);
  //   } catch (error) {
  //     console.error("Error updating order in backend", error);
  //   }
  // }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (items.length > 0) {
        updateBackend(items);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [items, updateBackend]);

  const handleReorder = (newOrder) => {
    setItems(newOrder.map((item, index) => ({ ...item, index })));
  };

  return (
    <>
      <Card className="col-span-4 border-none bg-secondary">
        <CardContent className="">
          <Card className="px-2 py-2 mx-auto my-4 bg-transparent border-none shadow-none sm:py-5 sm:px-8">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              className="w-auto py-6 text-xl border-b-2 rounded-none bg-primary text-secondary-foreground"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onSubmit={() => {
                newLink(url, "Link");
                setUrl("");
              }}
            />

            <Button
              onClick={() => {
                newLink("", "Header");
              }}
              className="w-full py-6 my-3 bg-foreground text-primary-foreground"
            >
              <IoIosAdd /> Add Header
            </Button>
          </Card>
          <Card className="bg-transparent border-none shadow-none ">
            {" "}
            {items && (
              <Reorder.Group axis="y" values={items} onReorder={handleReorder}>
                {items?.map((item, i) => (
                  <Links
                    key={item._id}
                    value={item}
                    type={item.type}
                    index={item.index}
                    remove={remove}
                    items={items}
                    setItems={setItems}
                    reorder={updateBackend}
                  />
                ))}
              </Reorder.Group>
            )}
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
