import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkMutationAuth } from "./utils/helpers";
//write comment
export const writeComment = mutation({
  args: {
    interviewId: v.id("interviewId"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await checkMutationAuth(ctx);

    return await ctx.db.insert("comments", {
      interviewId: args.interviewId,
      content: args.content,
      rating: args.rating,
      interviewerId: identity.subject,
    });
  },
});

export const getComments = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId),
      )
      .collect();

    return comments;
  },
});
