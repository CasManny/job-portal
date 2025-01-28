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

export const createJobSchema = z.object({
    jobTitle: z.string().min(2, "Job title must be atleast 2 characters"),
    employmentType: z.string().min(2, "Please select an employment type"),
    location: z.string().min(1, 'please select location'),
    salaryFrom: z.coerce.number().min(1, "salary from is required"),
    salaryTo: z.coerce.number().min(1, "salary to is required"),
    jobDescription: z.string().min(1, "job description is required"),
    listingDuration: z.coerce.number().min(1, "listing duration is required"),
    benefits: z.array(z.string()).min(1, "select at least 1 benefit"),
    companyName: z.string().min(1, "company name is required"),
    companyLocation: z.string().min(1, "company location is required"),
    companyAbout: z.string().min(10, "company description is required"),
    companyLogo: z.string().min(1, "Logo is required"),
    companyWebsite: z.string().url("Please enter a valid url"),
    companyXAccount: z.string().optional(),
})