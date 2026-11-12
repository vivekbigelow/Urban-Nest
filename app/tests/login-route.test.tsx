/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import {
    generateToken,
    sessionMap,
    verifyPassword,
} from "@/backend/lib/auth";

import { POST } from "@/app/api/login/route";

jest.mock("@/backend/lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock("@/backend/lib/auth", () => ({
    verifyPassword: jest.fn(),
    generateToken: jest.fn(),
    sessionMap: {
        set: jest.fn(),
    },
}));

const mockedFindUnique = jest.mocked(
    prisma.user.findUnique,
);

const mockedVerifyPassword = jest.mocked(
    verifyPassword,
);

const mockedGenerateToken = jest.mocked(
    generateToken,
);

type FoundUser = Awaited<
    ReturnType<typeof prisma.user.findUnique>
>;

const existingUser = {
    id: 42,
    username: "samuel",
    email: "samuel@example.com",
    password: "hashed-password",
} as unknown as NonNullable<FoundUser>;

function createLoginRequest(body: unknown): NextRequest {
    return new NextRequest("http://localhost/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

describe("POST /api/login", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("returns 400 when the login data is invalid", async () => {
        const request = createLoginRequest({
            usernameOrEmail: "",
            password: "",
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: false,
                error: true,
                statusCode: 400,
                errorMessage: "Invalid entry",
            }),
        );

        expect(mockedFindUnique).not.toHaveBeenCalled();
        expect(mockedVerifyPassword).not.toHaveBeenCalled();
        expect(mockedGenerateToken).not.toHaveBeenCalled();
        expect(sessionMap.set).not.toHaveBeenCalled();
    });

    it.each([
        {
            scenario: "the user does not exist",
            foundUser: null,
        },
        {
            scenario: "the password is incorrect",
            foundUser: existingUser,
        },
    ])(
        "returns 401 when $scenario",
        async ({ foundUser }) => {
            mockedFindUnique.mockResolvedValue(foundUser);
            mockedVerifyPassword.mockResolvedValue(false);

            const request = createLoginRequest({
                usernameOrEmail: "samuel",
                password: "incorrect-password",
            });

            const response = await POST(request);
            const body = await response.json();

            expect(response.status).toBe(401);

            expect(body).toEqual(
                expect.objectContaining({
                    isSuccess: false,
                    error: true,
                    statusCode: 401,
                    errorMessage: "Invalid credentials",
                }),
            );

            expect(mockedGenerateToken).not.toHaveBeenCalled();
            expect(sessionMap.set).not.toHaveBeenCalled();
        },
    );

    it("creates a session when the credentials are valid", async () => {
        mockedFindUnique.mockResolvedValue(existingUser);
        mockedVerifyPassword.mockResolvedValue(true);

        mockedGenerateToken.mockReturnValue(
            "generated-session-token",
        );

        const request = createLoginRequest({
            usernameOrEmail: "samuel@example.com",
            password: "correct-password",
        });

        const response = await POST(request);
        const body = await response.json();

        expect(mockedFindUnique).toHaveBeenCalledWith({
            where: {
                email: "samuel@example.com",
            },
        });

        expect(mockedVerifyPassword).toHaveBeenCalledWith(
            "correct-password",
            "hashed-password",
        );

        expect(mockedGenerateToken).toHaveBeenCalledTimes(1);

        expect(sessionMap.set).toHaveBeenCalledWith(
            "generated-session-token",
            42,
        );

        expect(response.status).toBe(200);

        expect(body).toEqual(
            expect.objectContaining({
                isSuccess: true,
                error: false,
                statusCode: 200,
            }),
        );

        expect(
            response.cookies.get("sessionId")?.value,
        ).toBe("generated-session-token");

        expect(
            response.headers.get("set-cookie"),
        ).toContain("Max-Age=7200");
    });

    it("returns 500 when an unexpected error occurs", async () => {
        mockedFindUnique.mockRejectedValue(
            new Error("Database connection failed"),
        );

        const request = createLoginRequest({
            usernameOrEmail: "samuel",
            password: "password",
        });

        const response = await POST(request);
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

        expect(mockedGenerateToken).not.toHaveBeenCalled();
        expect(sessionMap.set).not.toHaveBeenCalled();
    });
});