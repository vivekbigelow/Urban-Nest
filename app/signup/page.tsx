"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Remove old backend errors before checking this submission.
        setFieldErrors({});

        // Frontend-only Confirm Password validation.
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setPasswordError("");

        const response = await fetch("/api/User", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            }),
        });

        const result = await response.json();

        // Save all backend field errors.
        if (!response.ok) {
            setFieldErrors(result.data ?? {});
            return;
        }

        // Clear all errors after a successful signup.
        setFieldErrors({});
        setPasswordError("");

        router.push("/");
    }

    return (
        <main className="min-h-screen bg-[#F3F6EE] px-6 py-12">
            <div className="mx-auto w-full max-w-3xl">
                {/* Page heading */}
                <h1 className="mb-10 text-5xl font-extrabold tracking-tight text-[#17201E]">
                    Create your nest
                </h1>

                {/* Form card */}
                <div className="rounded-[22px] border border-[#E4EAE1] bg-white p-10">
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="space-y-6"
                    >
                        {/* First + Last Name */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-bold text-[#315C4A]">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="e.g. Jane"
                                    className="w-full rounded-full border border-[#E4EAE1] px-5 py-3 outline-none"
                                    required
                                />

                                {
                                    // @ts-ignore
                                    fieldErrors.firstName?.map((error, index) => (
                                        <p
                                            key={`${error}-${index}`}
                                            className="mt-2 text-sm text-red-600"
                                        >
                                            {error}
                                        </p>
                                    ))
                                }
                            </div>

                            <div>
                                <label className="mb-2 block font-bold text-[#315C4A]">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="e.g. Doe"
                                    className="w-full rounded-full border border-[#E4EAE1] px-5 py-3 outline-none"
                                    required
                                />

                                {
                                    // @ts-ignore
                                    fieldErrors.lastName?.map((error, index) => (
                                        <p
                                            key={`${error}-${index}`}
                                            className="mt-2 text-sm text-red-600"
                                        >
                                            {error}
                                        </p>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="mb-2 block font-bold text-[#315C4A]">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="choose_username"
                                className="w-full rounded-full border border-[#E4EAE1] px-5 py-3 outline-none"
                                required
                            />

                            {
                                // @ts-ignore
                                fieldErrors.username?.map((error, index) => (
                                    <p
                                        key={`${error}-${index}`}
                                        className="mt-2 text-sm text-red-600"
                                    >
                                        {error}
                                    </p>
                                ))
                            }
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block font-bold text-[#315C4A]">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className="w-full rounded-full border border-[#E4EAE1] px-5 py-3 outline-none"
                                required
                            />

                            {
                                // @ts-ignore
                                fieldErrors.email?.map((error, index) => (
                                    <p
                                        key={`${error}-${index}`}
                                        className="mt-2 text-sm text-red-600"
                                    >
                                        {error}
                                    </p>
                                ))
                            }
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-bold text-[#315C4A]">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full rounded-full border border-[#E4EAE1] px-5 py-3 outline-none"
                                />
                                {
                                    // @ts-ignore
                                    fieldErrors.password?.map((error, index) => (
                                        <p
                                            key={`${error}-${index}`}
                                            className="mt-2 text-sm text-red-600"
                                        >
                                            {error}
                                        </p>
                                    ))
                                }
                            </div>

                            <div>
                                <label className="mb-2 block font-bold text-[#315C4A]">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full rounded-full border border-[#E4EAE1] px-5 py-3 outline-none"
                                    required
                                />

                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {passwordError}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sign Up */}
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#DDF277] px-6 py-4 font-extrabold text-[#315C4A]"
                        >
                            SIGN UP
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}