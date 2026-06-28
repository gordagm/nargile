import PublicApp from "@/components/PublicApp";
import { readData } from "@/lib/data";
import { normalizeData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = normalizeData(await readData());
  return <PublicApp brands={data.brands} />;
}
