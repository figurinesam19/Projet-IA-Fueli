import { ScanFlow } from "./scan-flow";

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  return <ScanFlow day={d ?? null} />;
}
