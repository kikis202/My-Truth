import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      include: { author: true },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return posts;
  }),
  getPostsByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        include: { author: true },
        where: { authorId: input.id },
        orderBy: [{ createdAt: "desc" }],
        take: 100,
      });

      return posts;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        include: { author: true },
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Post not found",
        });
      }

      return post;
    }),
  create: protectedProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, "Can't create empty post")
          .max(255, "Post too long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.user.id;

      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many post requests",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
  getInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(5),
        cursor: z
          .object({
            createdAt: z.string(),
            id: z.string(),
          })
          .nullish(),
        authorId: z.string().nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, authorId } = input;
      const posts = await ctx.prisma.post.findMany({
        include: { author: true },
        take: limit + 1,
        where: authorId ? { authorId } : {},
        cursor: cursor
          ? {
              createdAt: new Date(cursor.createdAt),
              id: cursor.id,
            }
          : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });

      let nextCursor: typeof cursor = undefined;
      if (posts.length > limit) {
        const lastItem = posts.pop();
        if (lastItem)
          nextCursor = {
            createdAt: lastItem.createdAt.toISOString(),
            id: lastItem.id,
          };
      }

      return { posts, nextCursor };
    }),
});
