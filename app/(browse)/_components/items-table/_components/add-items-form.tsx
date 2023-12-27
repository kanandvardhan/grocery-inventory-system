"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ElementRef, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { redirect } from "next/navigation";
type PostBody = {
  name: string;
  description?: string;
  price: number;
  quantity: number;
};

export const addItems = async (values: Partial<PostBody>) => {
  try {
    const res = await fetch(`/api/grocery-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Failed to post items");
    }

    return res.json();
  } catch (error: any) {
    toast.error(error);
  }
};

export const AddItemsForm = () => {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z
      .string()
      .min(2, { message: "Descripttion must not me empty" }),
    price: z.coerce
      .number()
      .min(0.01, { message: "Price must be greater than 0." }),
    quantity: z.coerce
      .number()
      .min(1, { message: "Quantity must be at least 1." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
    },
  });

  const postItem = async (values: any) => {
    const result = await addItems(values);

    if (result.status === "success") {
      if (typeof window !== "undefined") {
        const existingItems = await JSON.parse(
          localStorage.getItem("grocery-items") || "[]"
        );
        const updatedItems = [...existingItems, values];
        localStorage.setItem("grocery-items", JSON.stringify(updatedItems));
      }

      toast.success(result.message);
      closeRef?.current?.click();
      redirect("/");
    } else {
      toast.error(result.message);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => postItem(values));
  }

  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Describe the item here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-x-5">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    min="0"
                    type="number"
                    step="1"
                    placeholder="0.01"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the price of the item.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input min="0" type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the quantity of the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          <DialogClose ref={closeRef} asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isPending} variant="default" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
