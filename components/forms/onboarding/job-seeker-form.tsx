"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { jobseekerSchema } from "@/app/utils/zod-schemas";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { createJobSeeker, deleteImage } from "@/app/actions";
import { X } from "lucide-react";
import { UploadDropzone } from "@/components/general/uploadthing";
import { useState } from "react";

const JobSeekerForm = () => {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof jobseekerSchema>>({
    resolver: zodResolver(jobseekerSchema),
    defaultValues: {
      about: "",
      name: "",
      resume: "",
    },
  });

  async function onSubmit(values: z.infer<typeof jobseekerSchema>) {
    try {
      setPending(true);
      await createJobSeeker(values);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("something went wrong");
      }
    } finally {
      setPending(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div className="">
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        width={100}
                        height={100}
                        className="rounded-lg"
                        alt="logo png"
                      />
                      <Button
                        size={"icon"}
                        className="absolute -top-2 -right-2"
                        type="button"
                        variant={"destructive"}
                        onClick={async () => {
                          await deleteImage(field.value);
                          field.onChange("");
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint={"resumeUploader"}
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                      }}
                      onUploadError={() => {
                        console.log("something went wrong");
                      }}
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "submiting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default JobSeekerForm;
