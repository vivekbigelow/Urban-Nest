"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IQueryResponse } from "../../types/globalTypes";
import FormSection from "@/app/components/FormSection";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
        credentials: "include",
      });
      const data: IQueryResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.errorMessage || "Login Failed");
      }
      router.push("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex flex-col gap-12 justify-self-center w-1/2 min-w-[500px]">
      <div>
        <h1 className="text-5xl">Welcome back</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <FormSection>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="usernameOrEmail">
                Username or Email
              </label>
              <input
                type="text"
                placeholder="Enter your Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <button
                className="primary-button w-full"
                type="submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Loading" : "Login"}</span>
              </button>
            </div>
            {message && <p>{message}</p>}
          </FormSection>
        </form>
      </div>
    </div>
  );
}
