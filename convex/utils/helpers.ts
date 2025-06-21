import { MutationCtx, QueryCtx } from "../_generated/server";

export const checkMutationAuth = async (ctx: MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("User is not authenticated");

  return identity;
};

export const checkQueryAuth = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("User is not authenticated");

  return identity;
};
