"use client";

import { DataTable } from "./_components/data-table";
import { GroceryItem, columns } from "./_components/columns";
import { AddItemsModal } from "./_components/add-items-modal";
import { format } from "date-fns";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemsHistoryCard } from "./_components/items-history-card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { AddCategoryModal } from "./_components/add-category-modal";

type ItemBody = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
};

export type CategoryBody = {
  name: string;
  discountedPercentage: number;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getItems = async () => {
  try {
    const res = await fetch(`/api/grocery-items`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch items");
    }

    return res.json();
  } catch (error: any) {
    toast.error(error.message);
  }
};

export const getCategories = async () => {
  try {
    const res = await fetch(`/api/categories`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    return res.json();
  } catch (error: any) {
    toast.error(error.message);
  }
};

export const ItemsTable = () => {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<CategoryBody[]>([]);
  const [storage, setStorage] = useState<ItemBody[]>([]);

  const fetchItems = async () => {
    const result = await getItems();

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
    console.log("items", result.data);
    setItems(result.data);
  };

  const fetchCategories = async () => {
    const result = await getCategories();

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
    console.log("categories", result.data);
    setCategories(result.data);
  };

  useEffect(() => {
    startTransition(() => {
      fetchItems();
      fetchCategories();
    });

    if (typeof window !== "undefined") {
      historyItems();
    }
  }, []);

  const formattedData = items.map((item: GroceryItem) => {
    const discountedPrice =
      item.price -
      (item.price * (item?.category?.discountedPercentage ?? 100)) / 100;

    return {
      ...item,
      createdAt: format(new Date(item.createdAt), "dd/MM/yyyy HH:MM:ss"),
      updatedAt: format(new Date(item.updatedAt), "dd/MM/yyyy HH:MM:ss"),
      discountedPrice: discountedPrice.toFixed(2),
    };
  });

  const historyItems = async () => {
    const existingItems = await JSON.parse(
      localStorage.getItem("grocery-items") || "[]"
    );

    if (existingItems.length > 0) {
      const reversedItems = existingItems.reverse();
      setStorage(existingItems);
    }
    console.log(existingItems);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          Grocery Inventory
          <RefreshCw
            onClick={() => {
              startTransition(() => fetchItems());
            }}
            className={cn("cursor-pointer", isPending && "animate-spin")}
          />
        </h1>
        <div className="flex gap-4">
          <AddCategoryModal />
          <AddItemsModal categories={categories} />
        </div>
      </div>
      {storage.length > 0 && (
        <div className="h-full w-full p-3 my-5 bg-stone-100">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-bold">Recently Added items...</h2>
            <Button
              onClick={() => {
                localStorage.removeItem("grocery-items");
                setStorage([]);
                redirect("/");
              }}
              variant="link"
            >
              Clear
            </Button>
          </div>
          <div className="flex mt-5 gap-x-10 overflow-x-scroll overflow-hidden">
            {storage.map((item, i) => (
              <ItemsHistoryCard
                key={i}
                name={item.name}
                description={item.description}
                price={item.price}
                quantity={item.quantity}
                category={item.category}
              />
            ))}
          </div>
        </div>
      )}
      <div className="text-center">
        <DataTable columns={columns} data={formattedData} />
      </div>
    </div>
  );
};
