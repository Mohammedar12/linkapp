import React, { useState, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { ShInput } from "../ui/input";
import { Button } from "../ui/button";
import { TbPencilPlus } from "react-icons/tb";

export default function Inputs({ name, placeholder, blur, ...props }) {
  // const [inputName, setInputName] = useState(name);
  const [show, setShow] = useState(false);

  const input = useRef();

  const key = (e) => {
    if (e.key == "Enter" || e.key == "Escape") {
      setShow(false);
    }
  };

  return (
    <CardContent className="grid p-2 select-none">
      <div
        className={` row-start-1 col-start-1 +
         ${show ? " opacity-100 " : " opacity-0 pointer-events-none"}`}
      >
        <ShInput
          className="w-full "
          tabIndex={show ? 0 : -1}
          onBlur={() => {
            setShow(false);
            blur();
          }}
          onKeyDown={key}
          ref={input}
          {...props}
        />
      </div>
      <div
        className={` row-start-1 col-start-1 +
        ${show ? " hidden " : "inline-flex"}`}
      >
        <Button
          className={`bg-transparent text-secondary-foreground    hover:bg-card-foreground/10 `}
          onClick={() => {
            setShow(true);
            input.current.focus();
          }}
        >
          <p className={!name ? "opacity-40" : ""}>
            {name ? name : placeholder}
          </p>
          <span className="mx-2">
            <TbPencilPlus />
          </span>
        </Button>
      </div>
    </CardContent>
  );
}
