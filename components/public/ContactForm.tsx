"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed to send");
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email directly."
      );
    }
  };

  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-3 p-6 bg-surface-alt border border-border rounded-lg"
      >
        <CheckCircle className="text-green-600" size={24} />
        <p className="font-medium text-text-base">Message sent!</p>
        <p className="text-sm text-text-muted">
          Thank you for reaching out. I will get back to you as soon as I can.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-primary hover:opacity-80 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Name"
        required
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Subject"
        placeholder="Optional"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        label="Message"
        required
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />
      {/* Honeypot — hidden, bots fill this */}
      <input type="text" name="_honey" className="hidden" aria-hidden tabIndex={-1} />

      {error && (
        <p role="alert" aria-live="assertive" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} size="md">
        Send message
      </Button>
    </form>
  );
}
