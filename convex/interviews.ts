import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkMutationAuth, checkQueryAuth } from "./utils/helpers";

//create interview
export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await checkMutationAuth(ctx);

    return await ctx.db.insert("interviews", {
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      status: args.status,
      streamCallId: args.streamCallId,
      candidateId: args.candidateId,
      interivewerIds: args.interviewerIds,
    });
  },
});

export const updateInterviews = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === "completed" ? { endTime: Date.now() } : {}),
    });
  },
});

//get all interviews
export const getAllInterviews = query({
  handler: async (ctx) => {
    const identity = await checkQueryAuth(ctx);
    return await ctx.db.query("interviews").collect();
  },
});

export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await checkQueryAuth(ctx);
    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject),
      )
      .collect();

    return interviews;
  },
});

export const getInterviewByStreamId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId),
      )
      .collect();
  },
});
