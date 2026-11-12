"use server"
import { prisma } from "@/backend/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/backend/lib/auth";
import { z } from "zod";
import { generateToken, sessionMap } from "../../../backend/lib/auth"
import { IQueryResponse, FAILED_QUERY_RESPONSE_BASE, SUCCESS_QUERY_RESPONSE_BASE } from "@/app/types/globalTypes";


const loginUserSchema = z.object({
    usernameOrEmail: z.string().min(1, "Username or email is required."),
    password: z.string().min(1, "Password is required."),
});

export async function POST(request: NextRequest): Promise<NextResponse<IQueryResponse>> {
    try {
        const body = await request.json();
        const validationResult = loginUserSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    ...FAILED_QUERY_RESPONSE_BASE,
                    errorMessage: "Invalid entry",
                    statusCode: 400,
                },
                { status: 400 }
            );
        }

        const userData = validationResult.data;
        const isEmail = z.email().safeParse(userData.usernameOrEmail).success;

        const user = isEmail
            ? await prisma.user.findUnique({
                where: {
                    email: userData.usernameOrEmail,
                },
            })
            : await prisma.user.findUnique({
                where: {
                    username: userData.usernameOrEmail,
                },
            });

        if (!user) {
            return NextResponse.json(

                {
                    ...FAILED_QUERY_RESPONSE_BASE,
                    errorMessage: "Invalid credentials",
                    statusCode: 401,
                }, {
                status: 401
            }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(
            userData.password,
            user.password,
        );
        if (!isValidPassword) {
            return NextResponse.json(
                {
                    ...FAILED_QUERY_RESPONSE_BASE,
                    errorMessage: "Invalid credentials",
                    statusCode: 401,
                }, {
                status: 401
            }
            );
        }

        const token = generateToken()

        const response = NextResponse.json({
            ...SUCCESS_QUERY_RESPONSE_BASE,
            statusCode: 200,
        }, { status: 200 });
        response.cookies.set("sessionId", token, {
            maxAge: 7200
        })



        sessionMap.set(token, user.id)

        return response;
    } catch (error) {

        return NextResponse.json({
            ...FAILED_QUERY_RESPONSE_BASE,
            errorMessage: "Internal Server Error",
            statusCode: 500,
        }, { status: 500 }
        );
    }
}
