import {mutation} from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if(!identity) throw new Error('Called storeUser without authentication present')

    const user = await ctx.db
        .query('users')
        .withIndex('by_token', q => q.eq('tokenIdentifier', identity.tokenIdentifier))
        .unique()

    if(user !== null) {
      if (user.username !== identity.nickname) {
        await ctx.db.patch(user._id, {username: identity.name})
      }

      return user._id
    }

    return await ctx.db.insert('users', {
      fullName: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      title: "",
      about: "",
      username: identity.nickname!,
      profileImageUrl: identity.profileUrl,
    })
  }
})