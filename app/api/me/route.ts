
"use server"
import { prisma } from "@/backend/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sessionMap } from "../../../backend/lib/auth"
import { IAuthUserResponse, } from "../../types/userTypes"
import { FAILED_QUERY_RESPONSE_BASE, SUCCESS_QUERY_RESPONSE_BASE, } from "../../types/globalTypes"

export async function GET(): Promise<NextResponse<IAuthUserResponse>> {
    try {
        const cookiesStore = await cookies()
        const { value: sessionId } = cookiesStore.get("sessionId") ?? {}


        if (!sessionId) {
            return NextResponse.json({
                ...FAILED_QUERY_RESPONSE_BASE,
                statusCode: 401,
                errorMessage: "Unauthorized"
            }, { status: 401 });

        }

        const userId = sessionMap.get(sessionId)
        if (!userId) {

            return NextResponse.json({
                ...FAILED_QUERY_RESPONSE_BASE,
                statusCode: 401,
                errorMessage: "Unauthorized"
            }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return NextResponse.json({
                ...FAILED_QUERY_RESPONSE_BASE,
                statusCode: 401,
                errorMessage: "Unauthorized"
            }, { status: 401 });
        }


        const { id, firstName, lastName, username, email } = user;

        return NextResponse.json({
            ...SUCCESS_QUERY_RESPONSE_BASE,
            statusCode: 200,
            data: {
                user: { id, firstName, lastName, username, email }
            }
        }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({
            ...FAILED_QUERY_RESPONSE_BASE,
            statusCode: 500,
            errorMessage: "Internal Server Error"
        }, {
            status: 500
        })
    }


}