import { ShInput } from "@/components/ui/input";

export function Search() {
  return (
    <div>
      <ShInput
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
