import { prisma } from "@/app/utils/db";
import React from "react";
import { EmptyJobListing } from "./empty-job-listing";
import { JobCard } from "./job-card";

const getData = async () => {
  const data = await prisma.jobPost.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      jobTitle: true,
      id: true,
      salaryFrom: true,
      salaryTo: true,
      employmentType: true,
      location: true,
        createdAt: true,
      Company: {
        select: {
          name: true,
          logo: true,
          about: true,
          location: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

export const JobListing = async () => {
  const data = await getData();
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col gap-6">
          {data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyJobListing
          title="No jobs found"
          description="Try searching for a different job title or location"
          href="/"
          buttonText="Clear all filters"
        />
      )}
    </>
  );
};
