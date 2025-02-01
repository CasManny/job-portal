import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/require-user";
import { EmptyJobListing } from "@/components/general/empty-job-listing";
import { JobCard } from "@/components/general/job-card";
import React from "react";

const getFavorites = async (userId: string) => {
  const data = await prisma.savedJobPost.findMany({
    where: {
      userId,
    },
    select: {
      JobPost: {
        select: {
          id: true,
          jobTitle: true,
          salaryFrom: true,
          salaryTo: true,
          employmentType: true,
          location: true,
          createdAt: true,
          Company: {
            select: {
              name: true,
              logo: true,
              location: true,
              about: true,
            },
          },
        },
      },
    },
  });

  return data;
};

const FavoritesPage = async () => {
  const session = await requireUser();
  const favorites = await getFavorites(session.id as string);

  if (favorites.length === 0) {
    return (
      <EmptyJobListing
        title="No favorites found"
        description="You don't have any favorites yet."
        buttonText="Find a job"
        href="/jobs"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5   gap-4">
      {favorites.map((favorite) => (
        <JobCard job={favorite.JobPost} key={favorite.JobPost.id} />
      ))}
    </div>
  );
};

export default FavoritesPage;
