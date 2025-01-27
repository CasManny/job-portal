import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { ModeToggle } from "./theme-toggle";
import { auth, signOut } from "@/app/utils/auth";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex items-center justify-between py-5">
      <Link href={"/"}>
        <h1 className="text-2xl font-bold">
          Job <span className="text-primary">Next</span>
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button>Logout</Button>
          </form>
        ) : (
          <Link
            href={"/"}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Login
          </Link>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
