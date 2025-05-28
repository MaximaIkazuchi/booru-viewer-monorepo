import { Badge, Button } from "@repo/shadcn-ui";
import { AppTooltip } from "../components/Tooltip";
import { RotateCcw } from "lucide-react";
import React from "react";
import { useTagsStore } from "../stores/tags.store";

export const useTagsControl = () => {
  const { tags, add, remove, clear } = useTagsStore();

  const TagsControlComponent = ({ ...props }: React.ComponentProps<"div">) =>
    tags.length > 0 && (
      <div {...props}>
        <AppTooltip
          trigger={
            <Button
              variant={"outline"}
              size={"sm"}
              className="hover:cursor-pointer"
              onClick={() => clear()}
            >
              <RotateCcw />
            </Button>
          }
          content={<p>Reset</p>}
        />
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <AppTooltip
              key={t}
              trigger={
                <Badge
                  className="flex gap-2 hover:cursor-pointer"
                  onClick={() => remove(t)}
                >
                  {t}
                </Badge>
              }
              content={<p>Click to remove</p>}
            />
          ))}
        </div>
      </div>
    );

  return {
    tags,
    add,
    remove,
    clear,
    TagsControlComponent,
  };
};
