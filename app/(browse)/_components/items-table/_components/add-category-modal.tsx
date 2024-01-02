"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddCategoryForm } from "./add-category-form";

export const AddCategoryModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="default" className="ml-auto">
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Category</DialogTitle>
        </DialogHeader>
        <AddCategoryForm />
      </DialogContent>
    </Dialog>
  );
};
