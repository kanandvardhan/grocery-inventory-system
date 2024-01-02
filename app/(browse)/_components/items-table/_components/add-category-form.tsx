"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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

type CategoryBody = {
  name: string;
  discountedPercentage: number;
};

export const addCategory = async (values: Partial<CategoryBody>) => {
  try {
    const res = await fetch(`/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Failed to post category");
    }

    return res.json();
  } catch (error: any) {
    toast.error(error);
  }
};

export const AddCategoryForm = () => {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    discountedPercentage: z.coerce
      .number()
      .min(0, { message: "Discount percentage must be at least 0." })
      .max(100, { message: "Discount percentage cannot be more than 100." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      discountedPercentage: 0,
    },
  });

  const postCategory = async (values: any) => {
    const result = await addCategory(values);

    if (result.status === "success") {
      toast.success(result.message);
      closeRef?.current?.click();
      redirect("/");
    } else {
      toast.error(result.message);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => postCategory(values));
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
                <Input placeholder="Enter category name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountedPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Percentage</FormLabel>
              <FormControl>
                <Input
                  min="0"
                  max="100"
                  type="number"
                  step="1"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
