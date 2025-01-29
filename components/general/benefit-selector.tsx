import { benefits } from "@/app/utils/list-of-benefits";
import React from "react";
import { Badge } from "../ui/badge";
import { ControllerRenderProps } from "react-hook-form";

interface iAppProps {
  field: ControllerRenderProps;
}

const BenefitsSelector = ({ field }: iAppProps) => {
  const toggleBenefit = (benefitId: string) => {
    const currentBenefits = field.value || [];

    const newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id: string) => id !== benefitId)
      : [...currentBenefits, benefitId];

    field.onChange(newBenefits);
  };
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {benefits.map((benefit) => {
          const isSelected = (field.value || []).includes(benefit.id);
          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? "default": "outline"}
              onClick={() => toggleBenefit(benefit.id)}
              className="cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm px-4 py-1.5 rounded-full"
            >
              <span className="flex items-center gap-2">
                {benefit.icon}
                {benefit.label}
              </span>
            </Badge>
          );
        })}
          </div>
          <div className="mt-r text-sm text-muted-foreground">
              selected Benefits:
              <span className="text-primary">{(field.value || []).length}</span>
        </div>
    </div>
  );
};

export default BenefitsSelector;
