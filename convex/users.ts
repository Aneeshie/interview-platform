import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(),
  },
  handler: async (ctx, { data }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", data.id))
      .first();

    const name =
      `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Anonymous";
    const email = data.email_addresses[0]?.email_address || "";

    const userData = {
      name,
      email,
      image: data.image_url || "",
      clerkId: data.id,
      role: "candidate" as const, // Default role, can be updated later
    };

    if (existingUser) {
      await ctx.db.patch(existingUser._id, userData);
    } else {
      await ctx.db.insert("users", userData);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export const getUsers = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is unauthorized");

    return await ctx.db.query("users").collect();
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.id("clerkId") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    return user;
  },
});
