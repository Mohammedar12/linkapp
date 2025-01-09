/**
 * v0 by Vercel.
 * @see https://v0.dev/t/oceZ2KRlhb4
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { ShInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const inputStyle =
  "flex text-secondary-foreground   px-4  items-center bg-input w-full";

export default function Social(props) {
  const {
    nextStep,
    prevStep,
    handleInputChange,
    values,
    platforms,
    initialSocialValues,
    page,
  } = props;

  return (
    <Card
      className={`w-full  bg-transparent border-0 ${
        page === "appearance" ? " " : "max-w-md bg-card p-4 rounded-md"
      }`}
    >
      {page !== "appearance" && (
        <CardHeader>
          <CardTitle>Add Social Links</CardTitle>
          <CardDescription>
            Enter your social network profiles and links.
          </CardDescription>
        </CardHeader>
      )}

      <div className={`w-full space-y-4  `}>
        {Object.keys(initialSocialValues).map((platform) => (
          <div key={platform} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <div className="flex items-center gap-2 px-4 rounded-md bg-input">
                {platforms[platform].icon}
                <div className={inputStyle}>
                  {platforms[platform].baseUrl}
                  <ShInput
                    onChange={handleInputChange}
                    value={values[platform].username}
                    name={platform}
                    placeholder={`username`}
                    className="w-full ps-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {page !== "appearance" && (
        <CardFooter className="mt-4">
          <div className="flex items-center w-full space-x-2">
            <Button
              onClick={() => prevStep()}
              className="flex-1 text-secondary"
            >
              Previous
            </Button>
            <Button
              className="flex-1 text-secondary"
              onClick={() => nextStep()}
            >
              Continue
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
