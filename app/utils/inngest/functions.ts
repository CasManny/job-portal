import { prisma } from "../db";
import { inngest } from "./client";

export const handleJobExpiration = inngest.createFunction(
    { id: "job-expiration" },
    { event: "job/created" },

    async ({ event, step}) => {
        const { jobId, expirationDays } = event.data
        
        await step.sleep('wait-for-expiration', `${expirationDays}d`)
        await step.run("update-job-status", async () => {
            await prisma.jobPost.update({
                where: {
                    id: jobId,
                },
                data: {
                    status: 'EXPIRED'
                }
            })

            return {jobId, message: "Job marked as expired"}
        })
    }
    
)

export const sendperiodicJobListing = inngest.createFunction(
    { id: "send-job-listings" },
    { event: "jobseeker/created" },
    async ({event, step}) => {
        const { userId, email } = event.data;
        const totalDays = 30;
        const intervalDays = 2
        let currentDay = 0

        while (currentDay < totalDays) {
            await step.sleep('wait-interval', `${intervalDays}d`),
            currentDay += intervalDays
            const recentJobs = await step.run("fetch-recent-jobs", async () => {
                return await prisma.jobPost.findMany({
                    where: {
                        status: 'ACTIVE'
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 10,
                    include: {
                        Company: {
                            select: {
                                name: true,
                            }
                        }
                    }
                })
            })

            if (recentJobs.length > 0) {
                await step.run('send-email', async () => {
                    console.log('sending email') // use RESEND OR EMAILJS =-> check resend for documentation
                })
            }
        }

        return { userId, message: "completed 30 day job listing notifications"}
    }
)