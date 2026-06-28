import AdminApp from "@/components/AdminApp";
import { readData } from "@/lib/data";
import { normalizeData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = normalizeData(await readData());
  return <AdminApp initial={data} />;
}
