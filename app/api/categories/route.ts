import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/category";
import { NextRequest, NextResponse } from "next/server";

interface ValidationErrors {
  field: string;
  message: string;
}

export type Category = {
  name: string;
  discountedPercentage: number;
};

export async function POST(req: any, res: object) {
  await connectDB();

  try {
    const { name, discountedPercentage }: Category = await req.json();

    const ifExist = await CategoryModel.findOne({ name });
    if (ifExist) {
      ifExist.discountedPercentage = discountedPercentage;

      await ifExist.save();

      return NextResponse.json(
        {
          status: "success",
          message: "Category already exists, updated discounted percentage",
        },
        { status: 200 }
      );
    }

    const newItem = await CategoryModel.create({
      name,
      discountedPercentage,
    });

    if (!newItem) {
      throw new Error();
    }

    return NextResponse.json(
      { status: "success", message: "Added new Category to the inventory" },
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
    const allCategories = await CategoryModel.find();

    if (allCategories.length === 0) {
      return NextResponse.json(
        {
          status: "success",
          message: "No categories in the Inventory",
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Fetched all categories",
        data: allCategories,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Something went wrong." },
      { status: 400 }
    );
  }
}
