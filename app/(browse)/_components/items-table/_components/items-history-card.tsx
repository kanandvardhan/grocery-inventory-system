"use client";

import { redirect } from "next/navigation";
import { addItems } from "./add-items-form";
import { toast } from "sonner";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemsHistoryCardProps {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

export const ItemsHistoryCard = ({
  description,
  name,
  price,
  quantity,
  category,
}: ItemsHistoryCardProps) => {
  const [isPending, startTransition] = useTransition();

  const postItem = async () => {
    const values = { description, name, price, quantity, category };
    const result = await addItems(values);

    if (result.status === "success") {
      if (typeof window !== "undefined") {
        await JSON.parse(localStorage.getItem("grocery-items") || "[]");
      }

      toast.success(result.message);
      redirect("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      onClick={() => startTransition(() => postItem())}
      className="group flex flex-col cursor-pointer relative p-5 rounded-xl"
    >
      <div className="group-hover:opacity-90 group-hover:backdrop-blur-2xl transition absolute top-0 left-0 h-full w-full bg-stone-800/40  opacity-0 rounded-xl">
        <div className="flex items-center justify-center h-full ">
          {isPending ? (
            <RefreshCw className={cn("animate-spin")} />
          ) : (
            <p className="text-xl font-bold">Add again</p>
          )}
        </div>
      </div>
      <p>Name: {name}</p>
      <p>Description: {description}</p>
      <p>Category: {category}</p>
      <p>Price: {price}</p>
      <p>Quantity: {quantity}</p>
    </div>
  );
};
