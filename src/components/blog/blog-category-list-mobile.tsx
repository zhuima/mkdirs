"use client";

import type { BlogCategoryListQueryResult } from "@/sanity.types";
import { LayoutListIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";
import FilterItemMobile from "../shared/filter-item-mobile";

export type BlogCategoryListMobileProps = {
  categoryList: BlogCategoryListQueryResult;
};

export function BlogCategoryListMobile({
  categoryList,
}: BlogCategoryListMobileProps) {
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug?: string };
  const selectedCategory = categoryList.find(
    (category) => category.slug.current === slug,
  );

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer.Root open={open} onClose={closeDrawer}>
      <Drawer.Trigger
        onClick={() => setOpen(true)}
        className="flex items-center w-full p-3 border-y text-foreground/90"
      >
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2">
            <LayoutListIcon className="size-5" />
            <span className="text-sm">Category</span>
          </div>
          <span className="text-sm">
            {selectedCategory?.name ? `${selectedCategory?.name}` : "All"}
          </span>
        </div>
      </Drawer.Trigger>
      <Drawer.Overlay
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      <Drawer.Portal>
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
          <Drawer.Title className="sr-only">Category</Drawer.Title>
          <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
            <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
          </div>

          <ul className="mb-14 w-full p-3 text-muted-foreground">
            <FilterItemMobile
              title="All"
              href="/blog"
              active={!slug}
              clickAction={closeDrawer}
            />

            {categoryList.map((item) => (
              <FilterItemMobile
                key={item.slug.current}
                title={item.name}
                href={`/blog/category/${item.slug.current}`}
                active={item.slug.current === slug}
                clickAction={closeDrawer}
              />
            ))}
          </ul>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
