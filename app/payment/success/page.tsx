import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="flex w-full min-h-screen flex-1 items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment successful</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              congrats your payment was successful. your job posting is now
              active
            </p>
            <Button asChild className="w-full mt-5">
              <Link href={"/"}>Go back to Homepage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
