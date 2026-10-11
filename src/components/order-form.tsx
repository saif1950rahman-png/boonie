import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { bakery, tiers, type TierId } from "@/lib/bakery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().trim().min(2, "Add your name so they know who to reply to."),
  email: z.string().trim().email("Use an email they can actually reply to."),
  phone: z.string().trim().max(32),
  tier: z.enum(["box", "cake", "spread", "unsure"]),
  note: z
    .string()
    .trim()
    .min(12, "Say the date, the headcount, and what you’d like baked."),
});

type Fields = z.infer<typeof schema>;

export function OrderForm({ tier, onTier }: { tier: TierId; onTier: (tier: TierId) => void }) {
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    tier,
    note: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [mailto, setMailto] = useState<string | null>(null);

  useEffect(() => {
    setFields((current) => (current.tier === tier ? current : { ...current, tier }));
  }, [tier]);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    if (key === "tier") onTier(value as TierId);
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(fields);
    if (!parsed.success) {
      const next: Partial<Record<keyof Fields, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key as keyof Fields]) {
          next[key as keyof Fields] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    const tierName = tiers.find((item) => item.id === parsed.data.tier)?.name ?? "Not sure yet";
    const body = [
      `Name: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      parsed.data.phone ? `Phone: ${parsed.data.phone}` : null,
      `Order: ${tierName}`,
      "",
      parsed.data.note,
      "",
      "Sent from the Boonies Bakery Co order page.",
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
    const href = `mailto:${bakery.email}?subject=${encodeURIComponent("Order request for Boonies Bakery Co")}&body=${encodeURIComponent(body)}`;
    try {
      localStorage.setItem(
        "boonies-order-note",
        JSON.stringify({ ...parsed.data, savedAt: new Date().toISOString() }),
      );
    } catch {
      /* private mode */
    }
    setMailto(href);
  }

  if (mailto) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-soft">
        <p className="text-sm font-medium text-berry">Note ready</p>
        <h3 className="mt-2 font-display text-3xl font-medium tracking-tight">Send it to the bakery.</h3>
        <p className="mt-3 text-muted">
          Your email draft is filled in. Facebook is still the fastest way to get a yes — a call works too.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild>
            <a href={bakery.messenger} target="_blank" rel="noreferrer">
              Message on Facebook
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a href={mailto}>Open the email draft</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href={`tel:${bakery.phoneTel}`}>Call {bakery.phoneDisplay}</a>
          </Button>
        </div>
        <button
          type="button"
          className="mt-6 min-h-11 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          onClick={() => setMailto(null)}
        >
          Edit the note
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-xl bg-card p-6 shadow-soft">
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={fields.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name ? (
            <p id="name-error" className="text-sm text-berry">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={fields.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(event) => update("email", event.target.value)}
            />
            {errors.email ? (
              <p id="email-error" className="text-sm text-berry">
                {errors.email}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone, if you want a call back</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={fields.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </div>
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-ink">What kind of order</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                ["box", "A box"],
                ["cake", "A cake"],
                ["spread", "A spread"],
                ["unsure", "Not sure"],
              ] as const
            ).map(([id, label]) => {
              const selected = fields.tier === id;
              return (
                <label
                  key={id}
                  className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-2 text-center text-sm ${
                    selected ? "border-berry bg-paper-2 text-ink" : "border-line bg-card text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={id}
                    checked={selected}
                    className="sr-only"
                    onChange={() => update("tier", id)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="grid gap-2">
          <Label htmlFor="note">What do you want, and when?</Label>
          <Textarea
            id="note"
            name="note"
            placeholder="Saturday pickup in Kilgore. Chocolate cake for 12, buttercream, no writing."
            value={fields.note}
            aria-invalid={Boolean(errors.note)}
            aria-describedby={errors.note ? "note-error" : undefined}
            onChange={(event) => update("note", event.target.value)}
          />
          {errors.note ? (
            <p id="note-error" className="text-sm text-berry">
              {errors.note}
            </p>
          ) : null}
        </div>
        <Button type="submit">Prepare my email</Button>
        <p className="text-sm text-muted">
          This opens a draft to {bakery.email}. Nothing is sent until you hit send in your mail app.
        </p>
      </div>
    </form>
  );
}
