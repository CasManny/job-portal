import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { ModeToggle } from "./theme-toggle";
import { auth, signOut } from "@/app/utils/auth";
import UserDropdown from "./user-dropdown";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex items-center justify-between py-5">
      <Link href={"/"}>
        <h1 className="text-2xl font-bold">
          Job <span className="text-primary">Next</span>
        </h1>
      </Link>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ModeToggle />
        <Link href={"/post-job"} className={buttonVariants({ size: "lg" })}>
          Post Job
        </Link>
        {session?.user ? (
          <UserDropdown
            email={session.user.email as string}
            image={session.user.image as string}
            name={session.user.name as string}
          />
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
