"use client";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-4 hover:opacity-75 transition">
        <div className=" rounded-full p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
          <Image src="/logo.png" alt="Gamehub" height="64" width="64" />
        </div>
        <div className={cn("hidden lg:block", font.className)}>
          <p className="text-white text-lg font-semibold">
            Grocery Inventory System
          </p>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
      </div>
    </Link>
  );
};
