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
};

export async function POST(req: any, res: object) {
  await connectDB();

  try {
    const { name, quantity, price, description }: GroceryItemBody =
      await req.json();

    const ifExist = await GroceryItem.findOne({ name });
    if (ifExist) {
      ifExist.quantity += quantity;
      await ifExist.save();

      return NextResponse.json(
        { message: "Item already exists, added quantity" },
        { status: 200 }
      );
    }

    const newItem = await GroceryItem.create({
      name,
      quantity,
      price,
      description,
    });

    if (!newItem) {
      throw new Error();
    }

    return NextResponse.json(
      { message: "Added new item to the inventory" },
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

      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    } else {
      return NextResponse.json(
        { message: "Something went wrong, did not add item to the inventory" },
        { status: 400 }
      );
    }
  }
}
