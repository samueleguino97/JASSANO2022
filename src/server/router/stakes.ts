import { createRouter } from "./context";
import { z } from "zod";

export const stakesRoutes = createRouter()
  .query("stakes", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.stake.findMany();
    },
  })
  .query("wards", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.ward.findMany({ include: { stake: true } });
    },
  })
  .query("areas", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.area.findMany();
    },
  });
