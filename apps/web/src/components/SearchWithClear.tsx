import { Button, Input } from "@repo/shadcn-ui";
import { CopyMinus } from "lucide-react";
import React, { SetStateAction } from "react";

export const SearchWithClear = ({
  placeholder = "",
  search,
  setSearch,
  ...props
}: {
  placeholder?: string;
  search: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
} & React.ComponentProps<"div">) => {
  return (
    <div className="flex items-center gap-1" {...props}>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        value={search}
      />
      <Button variant={"outline"} onClick={() => setSearch("")}>
        <CopyMinus />
      </Button>
    </div>
  );
};
