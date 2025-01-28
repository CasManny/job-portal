import { z } from 'zod'
export const companySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters long"),
    location: z.string().min(1, "location must be defined"),
    about: z.string().min(10, "Please provide some information about your compay"),
    logo: z.string().min(1, "Please upload a website"),
    website: z.string().url("Please enter a valid url"),
    xAccount: z.string().optional(),
})

export const jobseekerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    about: z.string().min(10, "please provide more information about yourself"),
    resume: z.string().min(1, "upload your resume")
})