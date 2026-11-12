/**
 * @jest-environment node
 */

import { cookies } from "next/headers";
import { prisma } from "@/backend/lib/prisma";
import { sessionMap } from "@/backend/lib/auth";

import { GET } from "@/app/api/me/route";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("@/backend/lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock("@/backend/lib/auth", () => ({
    sessionMap: {
        get: jest.fn(),
    },
}));

const mockedCookies = jest.mocked(cookies);

const mockedFindUnique = jest.mocked(
    prisma.user.findUnique,
);

const mockedSessionGet = jest.mocked(
    sessionMap.get,
);

type CookieStore = Awaited<
    ReturnType<typeof cookies>
>;

type FoundUser = Awaited<
    ReturnType<typeof prisma.user.findUnique>
>;

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

const existingUser = {
    id: "user-id-42",
    firstName: "Samuel",
    lastName: "Osho",
    username: "samuel",
    email: "samuel@example.com",
    password: "hashed-password",
} as unknown as NonNullable<FoundUser>;

describe("GET /api/user", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("returns 401 when the session cookie is missing", async () => {
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
            }),
        );

        expect(mockedSessionGet).not.toHaveBeenCalled();
        expect(mockedFindUnique).not.toHaveBeenCalled();
    });

    it("returns 401 when the session ID is invalid", async () => {
        mockedCookies.mockResolvedValue(
            createCookieStoreMock("invalid-session"),
        );

        mockedSessionGet.mockReturnValue(undefined);

        const response = await GET();
        const body = await response.json();

        expect(mockedSessionGet).toHaveBeenCalledWith(
            "invalid-session",
        );

        expect(response.status).toBe(401);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: false,
                error: true,
                statusCode: 401,
                errorMessage: "Unauthorized",
            }),
        );

        expect(mockedFindUnique).not.toHaveBeenCalled();
    });

    it("returns 401 when the session user no longer exists", async () => {
        mockedCookies.mockResolvedValue(
            createCookieStoreMock("valid-session"),
        );

        mockedSessionGet.mockReturnValue("user-id-42");
        mockedFindUnique.mockResolvedValue(null);

        const response = await GET();
        const body = await response.json();

        expect(mockedSessionGet).toHaveBeenCalledWith(
            "valid-session",
        );

        expect(mockedFindUnique).toHaveBeenCalledWith({
            where: {
                id: "user-id-42",
            },
        });

        expect(response.status).toBe(401);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: false,
                error: true,
                statusCode: 401,
                errorMessage: "Unauthorized",
            }),
        );
    });

    it("returns the authenticated user's safe fields", async () => {
        mockedCookies.mockResolvedValue(
            createCookieStoreMock("valid-session"),
        );

        mockedSessionGet.mockReturnValue("user-id-42");
        mockedFindUnique.mockResolvedValue(existingUser);

        const response = await GET();
        const body = await response.json();

        expect(mockedSessionGet).toHaveBeenCalledWith(
            "valid-session",
        );

        expect(mockedFindUnique).toHaveBeenCalledWith({
            where: {
                id: "user-id-42",
            },
        });

        expect(response.status).toBe(200);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: true,
                error: false,
                statusCode: 200,
                data: {
                    user: {
                        id: "user-id-42",
                        firstName: "Samuel",
                        lastName: "Osho",
                        username: "samuel",
                        email: "samuel@example.com",
                    },
                },
            }),
        );

        expect(body.data.user).not.toHaveProperty(
            "password",
        );
    });

    it("returns 500 when an unexpected error occurs", async () => {
        mockedCookies.mockResolvedValue(
            createCookieStoreMock("valid-session"),
        );

        mockedSessionGet.mockReturnValue("user-id-42");

        mockedFindUnique.mockRejectedValue(
            new Error("Database connection failed"),
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