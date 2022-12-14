import { createRouter } from "./context";
import { z } from "zod";
import { env } from "../../env/server.mjs";
import { TRPCError } from "@trpc/server";
import { differenceInYears, endOfYear, startOfYear } from "date-fns";
import { Prisma } from "@prisma/client";

export const jasRouter = createRouter()
  .mutation("enroll", {
    input: z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      birthDate: z.date(),
      wardId: z.string().uuid(),
      phoneNumber: z.number(),
      captchaToken: z.string(),
      isMember: z.boolean(),
      isReturnedMissionary: z.boolean(),
      studies: z.string().optional().default(""),
      profesion: z.string().optional().default(""),
      invitedBy: z.string().optional().default(""),
      notes: z.string().optional().default(""),
      gender: z.string(),
      theme1: z.string().optional(),
      theme2: z.string().optional(),
    }),
    async resolve({
      ctx,
      input: { captchaToken, wardId, isMember, ...input },
    }) {
      console.log(process.env.RECAPTCHA_SECRET_KEY);
      console.log(env.RECAPTCHA_SECRET_KEY);
      const captchaResponse = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
        }
      ).then((r) => r.json());
      console.log(
        captchaResponse,
        "Response from Google reCaptcha verification API"
      );
      const isCaptchaSuccess = captchaResponse?.score > 0.5;
      if (
        Math.abs(differenceInYears(input.birthDate, startOfYear(new Date()))) <
          18 ||
        Math.abs(differenceInYears(input.birthDate, endOfYear(new Date()))) > 30
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "La convencion solo para personas entre 18-30 años, porfavor verifica tu edad",
        });
      }
      if (isCaptchaSuccess) {
        console.log(input);
        try {
          const res = await ctx.prisma.jAS.create({
            data: {
              ...input,
              age: Math.abs(differenceInYears(input.birthDate, new Date())),
              isLDSMember: isMember,
              approved: false,
              profile_picture_url: "",
              ward: { connect: { id: wardId } },
              notes: input.notes,
              phoneNumber: input.phoneNumber.toString(),
            },
          });
          console.log(res);
          return res;
        } catch (error) {
          console.log(error, "Error");
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (error.code === "P2002") {
              throw new TRPCError({
                message:
                  "Este correo ya se registro anteriormente, porfavor contacta a tus coordinadores si este es un problema",
                code: "PRECONDITION_FAILED",
              });
            }
            throw new TRPCError({
              message: "Error contactando a la base de datos",
              code: "INTERNAL_SERVER_ERROR",
            });
          }
        }
      } else {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Captcha failed",
        });
      }
    },
  })
  .query("all", {
    async resolve({ ctx }) {
      return await ctx.prisma.jAS.findMany({
        include: { ward: { include: { stake: { include: { area: true } } } } },
      });
    },
  });
