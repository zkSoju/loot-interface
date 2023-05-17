import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <>
      <Skeleton className="mb-2 h-6 w-1/4" />
      <Skeleton className="mb-4 h-8 w-full" />
      <Skeleton className="mb-2 h-6 w-1/4" />
      <Skeleton className="mb-4 h-8 w-full" />
      <Skeleton className="mb-2 h-6 w-1/4" />
      <Skeleton className="mb-4 h-8 w-full" />
      <Skeleton className="mt-4 h-12 w-full" />
    </>
  );
}
