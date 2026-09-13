import { BarcodeFlow } from "./barcode-flow";

export default async function BarcodePage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  return <BarcodeFlow day={d ?? null} />;
}
