"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddItemsForm } from "./add-items-form";

export const AddItemsModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="default" className="ml-auto">
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new grocery items</DialogTitle>
        </DialogHeader>
        <AddItemsForm />
      </DialogContent>
    </Dialog>
  );
};
