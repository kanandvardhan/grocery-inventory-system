"use client";

import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Poppins } from "next/font/google";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const Navbar = () => {
  return (
    <nav
      className={cn(
        "fixed top-0 w-full h-20 z-[49] bg-[#252731] px-2 lg:px-4 flex justify-between items-center shadow-sm",
        font.className
      )}
    >
      <Logo />
      <div className="flex items-center text-right gap-x-4 hover:opacity-75 transition">
        <div className="block">
          <p className="text-white text-lg font-semibold">By Sai Anand</p>
          <p className="text-xs text-muted-foreground">
            GitHub:{" "}
            <Link
              href="https://github.com/kanandvardhan/grocery-inventory-system"
              target="_blank"
            >
              <span className="hover:text-white transition">kanandvardhan</span>
            </Link>
          </p>
        </div>
      </div>
    </nav>
  );
};
