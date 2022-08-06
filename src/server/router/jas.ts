import { createRouter } from "./context";
import { z } from "zod";

export const jasRouter = createRouter()
  .query("enroll", {
    input: z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      birthDate: z.date(),
      wardId: z.string().uuid(),
      phoneNumber: z.number().min(100_000_00).max(999_999_99),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.jAS.create({
        data: {
          ...input,
          age: 2,
          isLDSMember: false,
          approved: false,
          profile_picture_url: "",
          phoneNumber: input.phoneNumber.toString(),
        },
      });
    },
  })
  .query("all", {
    async resolve({ ctx }) {
      return await ctx.prisma.jAS.findMany();
    },
  });
