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
import { CategoryBody } from "..";

interface AddItemsModalProps {
  categories: CategoryBody[];
}

export const AddItemsModal = ({ categories }: AddItemsModalProps) => {
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
        <AddItemsForm categories={categories} />
      </DialogContent>
    </Dialog>
  );
};
