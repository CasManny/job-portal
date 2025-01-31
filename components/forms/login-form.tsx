import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { auth, signIn } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import Github from "../svgs/github";
import Google from "../svgs/google";
import { GeneralSubmitButton } from "../general/submit-button";

const LoginForm = async () => {
    const session = await auth()
    if (session?.user) {
        redirect("/")
    }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Goggle or GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <form
              action={async () => {
                "use server";
                await signIn("github", {
                  redirectTo: "/onboarding",
                });
              }}
            >
              <GeneralSubmitButton
                text="Login with GitHub"
                variant={"outline"}
                className="w-full"
                icon={<Github className="size-8" />}
              />
            </form>
            <form action="">
            <GeneralSubmitButton
                text="Login with Google"
                variant={"outline"}
                className="w-full"
                icon={<Google className="size-8" />}
              />
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground text-balance">
        By Clicking continue, you agree to our terms and service and privacy
        policy.
      </div>
    </div>
  );
};

export default LoginForm;
