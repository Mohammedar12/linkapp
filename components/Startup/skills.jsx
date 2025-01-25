"use client ";
import { useContext, useState } from "react";

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
import { IoIosRemoveCircleOutline } from "react-icons/io";
import AppearanceContext from "@/context/appearance";

export default function Skills(props) {
  const {
    nextStep,
    prevStep,
    // skills,
    // setSkills,
    // newSkill,
    // setNewSkill,
    // addSkill,
    // removeSkill,
  } = props;

  const [newSkill, setNewSkill] = useState("");
  const { skills, setSkills } = useContext(AppearanceContext);

  const addSkill = (e) => {
    e.preventDefault();
    console.log(skills);
    if (newSkill && skills && !skills?.includes(newSkill)) {
      console.log(skills);

      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills?.filter((skill) => skill !== skillToRemove));
  };

  return (
    <Card className="w-full max-w-md border-none bg-card">
      <CardHeader className="pb-2">
        <CardTitle>Add Your Skills</CardTitle>
        <CardDescription>Enter 1-3 Skills.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {skills?.length !== 3 && (
          <form onSubmit={addSkill} className="flex items-center ">
            <ShInput
              placeholder="Skills"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              disabled={skills?.length >= 3}
            />
            <Button type="submit" disabled={skills?.length >= 3 || !newSkill}>
              Add
            </Button>
          </form>
        )}
        {skills?.length !== 0 && (
          <ul className="flex flex-wrap gap-2 mx-4 mb-3">
            {skills?.map((skill, index) => (
              <li
                key={index}
                className="flex items-center gap-2 p-1 px-2 text-sm rounded-md bg-primary-foreground w-fit"
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
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full space-x-2">
          <Button onClick={() => prevStep()} className="flex-1 text-secondary">
            Previous
          </Button>
          <Button className="flex-1 text-secondary" onClick={() => nextStep()}>
            Continue
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
