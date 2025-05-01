import * as React from "react";

import { cn } from "@/lib/utils";

const ShInput = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <div className="w-full m-0">
      <label htmlFor="input">
        <input
          type={type}
          className={cn(
            `peer flex h-9  rounded-sm outline-none  bg-transparent  px-3 py-1
         text-sm  transition-colors  
          disabled:cursor-not-allowed 
         disabled:opacity-50 text-secondary-foreground    `,
            className
          )}
          ref={ref}
          {...props}
        />
      </label>
    </div>
  );
});
ShInput.displayName = "Input";

export { ShInput };
