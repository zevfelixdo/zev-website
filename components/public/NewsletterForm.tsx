"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  first_name: z.string().max(100).optional(),
});

type FormData = z.infer<typeof schema>;

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed to subscribe");
      }
      setSubscribed(true);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const [formError, setFormError] = useState<string | null>(null);

  if (subscribed) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-3 p-6 bg-surface-alt border border-border rounded-lg"
      >
        <CheckCircle className="text-green-600" size={24} />
        <p className="font-medium text-text-base">You are subscribed!</p>
        <p className="text-sm text-text-muted">
          Thank you for subscribing. You will hear from me when I have something worth saying.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="First name"
        autoComplete="given-name"
        placeholder="Optional"
        error={errors.first_name?.message}
        {...register("first_name")}
      />
      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      {formError && (
        <p role="alert" aria-live="assertive" className="text-sm text-red-600">
          {formError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} size="md">
        Subscribe
      </Button>
      <p className="text-xs text-text-muted">
        No spam. Unsubscribe any time. I respect your inbox.
      </p>
    </form>
  );
}
