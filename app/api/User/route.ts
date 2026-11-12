import { prisma } from "@/backend/lib/prisma";
import { z } from "zod";
import { hashPassword } from "@/backend/lib/auth";
import { NextResponse, NextRequest } from "next/server";
const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "User first name must contain at least 2 characters.")
    .max(30, "User first name must contain no more than 30 characters."),

  lastName: z
    .string()
    .min(2, "User last name must contain at least 2 characters.")
    .max(30, "User last name must contain no more than 30 characters."),

  username: z
    .string()
    .min(9, "Username must be more than 8 characters.")
    .max(19, "Username must contain fewer than 20 characters."),

  password: z
    .string()
    .min(9, "Password must contain more than 8 characters.")
    .max(199, "Password cannot contain more than 199 characters.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special symbol.",
    ),

  email: z.email("Email address must be a valid email."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = z.flattenError(validationResult.error).fieldErrors;

      return NextResponse.json(
        {
          result: "Invalid entry",
          statusCode: 400,
          data: errors,
        },
        {
          status: 400,
        },
      );
    }

    const userData = validationResult.data;

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: userData.username,
      },
    });

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    const duplicateErrors: Record<string, string[]> = {};

    if (existingUsername) {
      duplicateErrors.username = ["Username is already in use."];
    }

    if (existingEmail) {
      duplicateErrors.email = ["Email address is already in use."];
    }

    if (Object.keys(duplicateErrors).length > 0) {
      return NextResponse.json(
        {
          result: "Invalid entry",
          statusCode: 400,
          data: duplicateErrors,
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await hashPassword(userData.password);

    const newUser = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        result: "Success",
        statusCode: 201,
        data: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username,
          email: newUser.email,
          createDateTime: newUser.createDateTime,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      {
        result: "Internal server error",
        statusCode: 500,
      },
      { status: 500 },
    );
  }
}
