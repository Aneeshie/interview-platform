import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUserRole() {
  const { user } = useUser();

  const data = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  const isLoading = data === undefined;

  return {
    isLoading,
    isInterviewer: data?.role === "interviewer",
    isCandidate: data?.role === "candidate",
  };
}
