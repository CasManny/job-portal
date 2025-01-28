"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState } from "react";
import UserTypeFormSelection from "./user-type-form";
import CompanyForm from "./company-form";
import JobSeekerForm from "./job-seeker-form";

export type UserSelectionType = "company" | "jobSeeker" | null;

const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserSelectionType>(null);

  const handleUserTypeSelection = (type: UserSelectionType) => {
    setUserType(type);
    setStep(2);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UserTypeFormSelection onSelect={handleUserTypeSelection} />
      case 2:
        return userType === "company" ? <CompanyForm /> : <JobSeekerForm />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="flex items-center gap-4 mb-10">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">
            Job <span className="text-primary">Next</span>
          </h1>
        </Link>
      </div>

      <Card className="w-full max-w-lg py-3">
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </>
  );
};

export default OnboardingForm;
