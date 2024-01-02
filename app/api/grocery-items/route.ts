import { connectDB } from "@/lib/mongodb";
import GroceryItem from "@/models/grocery-item";
import { NextRequest, NextResponse } from "next/server";

interface ValidationErrors {
  field: string;
  message: string;
}

type GroceryItemBody = {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category: string;
};

export async function POST(req: any, res: object) {
  await connectDB();

  try {
    const { name, quantity, price, description, category }: GroceryItemBody =
      await req.json();

    const ifExist = await GroceryItem.findOne({ name });
    if (ifExist) {
      ifExist.quantity += quantity;
      ifExist.price = price;
      ifExist.category = category;

      await ifExist.save();

      return NextResponse.json(
        {
          status: "success",
          message: "Item already exists, updated quantity and price",
        },
        { status: 200 }
      );
    }

    const newItem = await GroceryItem.create({
      name,
      quantity,
      price,
      description,
      category,
    });

    if (!newItem) {
      throw new Error();
    }

    return NextResponse.json(
      { status: "success", message: "Added new item to the inventory" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);

    if (error.name === "ValidationError") {
      const validationErrors: ValidationErrors[] = Object.keys(
        error.errors
      ).map((field) => ({
        field,
        message: (error.errors as any)[field].message,
      }));

      return NextResponse.json({ message: validationErrors }, { status: 400 });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Something went wrong, did not add item to the inventory",
        },
        { status: 400 }
      );
    }
  }
}

export async function GET(req: any, res: any) {
  await connectDB();
  try {
    const allItems = await GroceryItem.find().populate("category");

    if (allItems.length === 0) {
      return NextResponse.json(
        { status: "success", message: "No items in the Inventory", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: "success", message: "Fetched all items", data: allItems },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Something went wrong." },
      { status: 400 }
    );
  }
}
