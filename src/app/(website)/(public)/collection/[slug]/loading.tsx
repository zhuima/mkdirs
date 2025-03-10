import Container from "@/components/container";
import { ItemGridSkeleton } from "@/components/item/item-grid";
import { HeaderSection } from "@/components/shared/header-section";

export default function Loading() {
  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Collection"
            titleAs="h2"
            title="Explore by collections"
          />
        </div>
      </div>

      <Container className="mt-8">
        <ItemGridSkeleton />
      </Container>
    </div>
  );
}
