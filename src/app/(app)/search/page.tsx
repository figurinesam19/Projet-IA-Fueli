import { SearchFlow } from "./search-flow";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  return <SearchFlow day={d ?? null} />;
}
