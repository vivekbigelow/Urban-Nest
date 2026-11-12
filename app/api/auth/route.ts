import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { IAuthResponse } from "../../types/authTypes"

import { FAILED_QUERY_RESPONSE_BASE, SUCCESS_QUERY_RESPONSE_BASE } from "../../types/globalTypes"

export async function GET(): Promise<NextResponse<IAuthResponse>> {
    try {
        const cookiesStore = await cookies()
        const { value: sessionId } = cookiesStore.get("sessionId") ?? {}

        if (!sessionId) {
            return NextResponse.json({
                ...FAILED_QUERY_RESPONSE_BASE,
                statusCode: 401,
                errorMessage: "Unauthorized",
                data: {
                    isAuthenticated: false
                },

            }, { status: 401 });

        }
        return NextResponse.json({
            ...SUCCESS_QUERY_RESPONSE_BASE,
            statusCode: 200,
            data: {
                isAuthenticated: true
            }
        }, { status: 200 })

    }
    catch (error) {
        return NextResponse.json({
            ...FAILED_QUERY_RESPONSE_BASE,
            statusCode: 500,
            errorMessage: "Internal Server Error"

        }, { status: 500 });
    }

}