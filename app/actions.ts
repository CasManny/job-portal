"use server";

import { z } from "zod";
import { requireUser } from "./utils/require-user";
import { companySchema, createJobSchema, jobseekerSchema } from "./utils/zod-schemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "./utils/job-listing-duration-prices";
import { inngest } from "./utils/inngest/client";
import { revalidatePath } from "next/cache";

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

  let stripeCustomerId = company.user.stripeCustomerId
  
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,

    })

    stripeCustomerId = customer.id;

    // update use with stripe customer id
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        stripeCustomerId: customer.id
      }
    })
  }

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
    },
    select: {
      id: true
    }
  })

  const pricingTier = jobListingDurationPricing.find((tier) => tier.days === validateData.listingDuration)

  if (!pricingTier) {
    throw new Error("Invalid Listing duration selected")
  }

  await inngest.send({
    name: "job/created",
    data: {
      jobId: jobPost.id,
      expirationDays: validateData.listingDuration
    }
  })

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            // images: ["paste the link to your logo here to appear in checkout"]
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100, // since stripe uses cents for payments
        },
        quantity: 1
      }
    ],
    metadata: {
      jobId: jobPost.id
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL!}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL!}/payment/cancel`

  })

 return redirect(session.url as string)

}

export const saveJobPost = async (jobId: string) => {
  const user = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const job = await prisma.savedJobPost.create({
    data: {
      jobPostId: jobId,
      userId: user.id as string
    }
  })

  revalidatePath(`/job/${job.id}`)

}
export const unSaveJobPost = async (savedJobPostId: string) => {
  const user = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id as string
    },
    select: {
      jobPostId: true
    }
  })

  revalidatePath(`/job/${data.jobPostId}`)

}
