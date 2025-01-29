"use server";

import { z } from "zod";
import { requireUser } from "./utils/require-user";
import { companySchema, createJobSchema, jobseekerSchema } from "./utils/zod-schemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

const utapi = new UTApi();

export const createCompany = async (data: z.infer<typeof companySchema>) => {
  const session = await requireUser();
  // import from acrjet sdk
  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = companySchema.parse(data);
  const company = await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          ...validateData,
        },
      },
    },
  });
  return redirect("/");
};

export const deleteImage = async (url: string) => {
  const fileKey = url.split("/").pop();
  try {
    await utapi.deleteFiles(fileKey!);
    return { success: true, message: "file deleted successfully" };
  } catch (error) {
    return { success: false, message: "failed to delete File" };
  }
};

export const createJobSeeker = async (
  data: z.infer<typeof jobseekerSchema>
) => {
  const user = await requireUser();

  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  const validateData = jobseekerSchema.parse(data);

  const jobseeker = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validateData,
        },
      },
    },
  });

  return redirect("/");
};

export const createJob = async (data: z.infer<typeof createJobSchema>) => {
  const user = await requireUser()
  const req = await request()

  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const validateData = createJobSchema.parse(data)

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true
        }
      }
    }
  })

  if (!company?.id) {
    return redirect("/")
  }

  let stripeCustomerId = 

  const jobPost = await prisma.jobPost.create({
    data: {
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      employmentType: validateData.employmentType,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      listingDuration: validateData.listingDuration,
      benefits: validateData.benefits,
      companyId: company.id
    }
  })

  redirect('/')

}
