import { Suspense } from "react";
import { ItemsTable } from "./_components/items-table";

export default async function HomePage() {
  return (
    <div className="h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ItemsTable />
      </Suspense>
    </div>
  );
}
