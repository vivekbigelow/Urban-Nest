/**
 * @jest-environment node
 */

import { cookies } from "next/headers";
import { GET } from "@/app/api/auth/route";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

const mockedCookies = jest.mocked(cookies);

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function createCookieStoreMock(
    sessionId?: string,
): CookieStore {
    return {
        get: jest.fn().mockReturnValue(
            sessionId
                ? {
                    name: "sessionId",
                    value: sessionId,
                }
                : undefined,
        ),
    } as unknown as CookieStore;
}

describe("GET /api/auth", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("returns authenticated when a session ID exists", async () => {
        mockedCookies.mockResolvedValue(
            createCookieStoreMock("valid-session-id"),
        );

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: true,
                error: false,
                statusCode: 200,
                data: {
                    isAuthenticated: true,
                },
            }),
        );
    });

    it("returns unauthorized when no session ID exists", async () => {
        mockedCookies.mockResolvedValue(
            createCookieStoreMock(),
        );

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(401);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: false,
                error: true,
                statusCode: 401,
                errorMessage: "Unauthorized",
                data: {
                    isAuthenticated: false,
                },
            }),
        );
    });

    it("returns 500 when reading cookies fails", async () => {
        mockedCookies.mockRejectedValue(
            new Error("Cookie store failed"),
        );

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(500);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: false,
                error: true,
                statusCode: 500,
                errorMessage: "Internal Server Error",
            }),
        );
    });
});