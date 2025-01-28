import OnboardingForm from "@/components/forms/onboarding/onboarding-form";
import React from "react";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/require-user";

const checkIfUserHasFinishedOnboarding = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      onBoardingCompleted: true
    }
  })

  if (user?.onBoardingCompleted === true) {
    redirect('/')
  }
  return user
}

const OnboardingHomepage = async () => {
  const user = await requireUser()
  await checkIfUserHasFinishedOnboarding(user.id as string)
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center py-10">
      <OnboardingForm />
    </div>
  );
};

export default OnboardingHomepage;
