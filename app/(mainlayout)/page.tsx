import JobFilters from "@/components/general/job-filters";
import { JobListing } from "@/components/general/job-listing";
export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />
      <div className="col-span-2 flex flex-col gap-6">
        <JobListing />
      </div>
    </div>
  );
}
