import {v} from 'convex/values'

import {internalMutation, mutation, query} from './_generated/server'
import {Id} from './_generated/dataModel'

export const get = query({
  args: {
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
    filter: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    const title = args.search as string

    let gigs = []

    if(title) {
      gigs = await ctx.db
          .query('gigs')
          .withSearchIndex('search_title', q => q.search('title', title))
          .collect()
    } else {
      gigs = await ctx.db
          .query('gigs')
          .withIndex('by_published', q => q.eq('published', true))
          .order('desc')
          .collect()
    }
  }
})

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    subcategoryId: v.string(),
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if(!identity) throw new Error('Unauthorized')

    const user = await ctx.db
        .query('users')
        .withIndex('by_token', q => q.eq('tokenIdentifier', identity.tokenIdentifier))
        .unique()

    const gigId = await ctx.db.insert('gigs', {
      title: args.title,
      description: args.description,
      subcategoryId: args.subcategoryId as Id<'subcategories'>,
      sellerId: user?._id!,
      published: false,
      clicks: 0
    })

    return gigId
  }
})