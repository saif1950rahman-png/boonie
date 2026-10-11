import { CalendarDays, Check, Mail, MapPin, MessageCircle, Phone, Wheat } from "lucide-react";
import { useState } from "react";
import { OrderForm } from "@/components/order-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { bakery, tiers, type TierId } from "@/lib/bakery";

const features = [
  {
    title: "Celebration cakes",
    copy: "Layers and buttercream, sized for the table you actually have. Flavor is part of the message, not a fixed menu.",
    image: "/images/cake",
    alt: "Two-layer cake with off-white buttercream, a cocoa drip, and raspberries on a wooden stand.",
  },
  {
    title: "Cookies",
    copy: "Thick, from-scratch cookies. Chocolate chip, cocoa, and whatever the week calls for.",
    image: "/images/cookies",
    alt: "A close pile of thick chocolate chip, oatmeal, and cocoa cookies on parchment.",
  },
  {
    title: "Sweet treats",
    copy: "Brownies, cupcakes, and little trays when a whole cake is more than you need.",
    image: "/images/treats",
    alt: "Overhead tray of brownies, simple cupcakes, and jam thumbprint cookies.",
  },
];

const promises = [
  {
    icon: Wheat,
    title: "Made from scratch",
    copy: "A home bakery. Cakes, cookies, and sweet treats mixed and finished by hand.",
  },
  {
    icon: CalendarDays,
    title: "Baked to the date",
    copy: "Tell them the day and the headcount. You’ll get a price before anything goes in the oven.",
  },
  {
    icon: MapPin,
    title: "Pickup in Kilgore",
    copy: "Local pickup in Kilgore, Texas. Not a chain counter — a message, then a handoff.",
  },
];

const notes = [
  {
    title: "A Saturday cake",
    body: "“Can you do a small chocolate cake for Saturday pickup? Buttercream, nothing written on it.”",
  },
  {
    title: "Cookies for the office",
    body: "“Need about two dozen for Friday. Mix of chocolate chip and whatever else you’re baking.”",
  },
  {
    title: "Something for dinner",
    body: "“A few treats for a family dinner this week — whatever is coming out of the oven.”",
  },
];

export function LandingPage() {
  const [tier, setTier] = useState<TierId>("cake");

  function chooseTier(next: TierId) {
    setTier(next);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <p className="text-sm font-medium tracking-wide text-berry">Kilgore, Texas · Home bakery</p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-none tracking-tight text-ink sm:text-6xl">
              Scratch-made cakes, cookies, and sweet treats.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Boonies Bakery Co bakes from scratch for birthdays, gatherings, and the week you just want
              something good. Message on Facebook to place an order. A call or an email works too.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={bakery.messenger} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Message to order
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href={`tel:${bakery.phoneTel}`}>
                  <Phone className="size-4" />
                  Call {bakery.phoneDisplay}
                </a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted">
              Their page says it plainly: send a message if you’d like to place an order.
            </p>
          </div>
          <figure>
            <img
              src="/images/hero-1600.webp"
              srcSet="/images/hero-800.webp 800w, /images/hero-1600.webp 1600w"
              sizes="(min-width: 1024px) 560px, 100vw"
              alt="A cocoa-frosted cake, chocolate chip cookies, and sugar cookies on a wooden kitchen table."
              fetchPriority="high" width={1600}
              height={900}
              className="aspect-video w-full rounded-xl object-cover shadow-soft"
            />
            <figcaption className="mt-3 text-sm text-muted">Baked at home. Picked up in Kilgore.</figcaption>
          </figure>
        </section>

        <section aria-label="How ordering works" className="border-y border-line bg-paper-2">
          <ol className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3 sm:py-10">
            {[
              ["01", "Message the date", "Facebook is the preferred way. Say what you want and when you need it."],
              ["02", "Get a real price", "Size and flavor change the number. You’ll hear it before they bake."],
              ["03", "Pick up in Kilgore", "Calling or emailing works if a message isn’t handy."],
            ].map(([step, title, copy]) => (
              <li key={step}>
                <p className="font-display text-2xl text-berry">{step}</p>
                <h2 className="mt-2 font-display text-xl font-medium">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="treats" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-berry">What they bake</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              From scratch, for the occasion you actually have.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Cakes, cookies, and sweet treats. Not a storefront menu with fifty SKUs — a home kitchen that
              bakes what you ask for.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="overflow-hidden rounded-xl bg-card shadow-soft">
                <img
                  src={`${feature.image}-1100.webp`}
                  srcSet={`${feature.image}-640.webp 640w, ${feature.image}-1100.webp 1100w`}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  alt={feature.alt}
                  loading="lazy"
                  decoding="async"
                  width={1100}
                  height={619}
                  className="aspect-video w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-2xl font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{feature.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <ul className="mt-5 grid gap-5 md:grid-cols-3">
            {promises.map((item) => (
              <li key={item.title} className="rounded-xl border border-line bg-card p-5">
                <item.icon className="size-5 text-berry" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="order" className="scroll-mt-20 bg-espresso text-cream">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-cream-muted">Ways to order</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Three kinds of order. One way to start: a message.
              </h2>
              <p className="mt-4 text-lg text-cream-muted">
                Prices stay off the page on purpose. A six-inch cake and a sheet for forty are not the same
                number. Ask, and you’ll get one before anything is baked.
              </p>
            </div>
            <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
              {tiers.map((item) => (
                <article
                  key={item.id}
                  className={
                    item.featured
                      ? "flex flex-col rounded-xl bg-cream p-6 text-espresso sm:p-8"
                      : "flex flex-col rounded-xl border border-cream/15 p-6 sm:p-8"
                  }
                >
                  {item.featured ? (
                    <p className="text-sm font-medium text-berry">Most requested</p>
                  ) : (
                    <p className="text-sm font-medium text-cream-muted">By message</p>
                  )}
                  <h3
                    className={`mt-3 font-display text-3xl font-medium ${item.featured ? "text-espresso" : "text-cream"}`}
                  >
                    {item.name}
                  </h3>
                  <p className={`mt-3 text-sm leading-relaxed ${item.featured ? "text-muted" : "text-cream-muted"}`}>
                    {item.blurb}
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {item.includes.map((line) => (
                      <li key={line} className="flex gap-3 text-sm">
                        <Check className={`mt-0.5 size-4 shrink-0 ${item.featured ? "text-berry" : "text-cream"}`} />
                        <span className={item.featured ? "text-ink" : "text-cream"}>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {item.featured ? (
                      <Button type="button" onClick={() => chooseTier(item.id)}>
                        Start this order
                      </Button>
                    ) : (
                      <Button type="button" variant="inverse" onClick={() => chooseTier(item.id)}>
                        Start this order
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-medium text-berry">The notes that start an order</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight">
                Short messages. Real replies.
              </h2>
              <p className="mt-4 text-muted">
                These are the kinds of requests the bakery is built for — not invented star ratings. Boonies
                is a home kitchen, so each note gets a person on the other end.
              </p>
            </div>
            <ul className="grid gap-4 lg:col-span-8">
              {notes.map((note) => (
                <li key={note.title} className="rounded-xl border border-line bg-card p-6">
                  <p className="text-sm font-medium text-faint">{note.title}</p>
                  <blockquote className="mt-3 font-display text-2xl font-medium leading-snug text-ink">
                    {note.body}
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-4">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-paper-2 px-6 py-8 sm:flex-row sm:items-center sm:px-8">
            <div>
              <h2 className="font-display text-3xl font-medium tracking-tight">The oven doesn’t take carts.</h2>
              <p className="mt-2 max-w-xl text-muted">
                Send the date, the headcount, and what sounds good. Facebook is the preferred door.
              </p>
            </div>
            <Button asChild>
              <a href={bakery.messenger} target="_blank" rel="noreferrer">
                Message on Facebook
              </a>
            </Button>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-berry">Contact</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Tell them what you want.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Best method: a Facebook message. Calling or emailing also works. Leave your email here if you’d
              rather write the order out and send it yourself.
            </p>
            <ul className="mt-8 grid gap-3">
              <li>
                <a
                  href={bakery.messenger}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 transition-colors duration-150 hover:bg-paper-2"
                >
                  <MessageCircle className="size-5 text-berry" />
                  <span>
                    <span className="block text-sm font-medium">Facebook message</span>
                    <span className="block text-sm text-muted">Preferred — Boonies Bakery Co</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${bakery.phoneTel}`}
                  className="flex min-h-11 items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 transition-colors duration-150 hover:bg-paper-2"
                >
                  <Phone className="size-5 text-berry" />
                  <span>
                    <span className="block text-sm font-medium">{bakery.phoneDisplay}</span>
                    <span className="block text-sm text-muted">Call</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${bakery.email}`}
                  className="flex min-h-11 items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 transition-colors duration-150 hover:bg-paper-2"
                >
                  <Mail className="size-5 text-berry" />
                  <span>
                    <span className="block text-sm font-medium">{bakery.email}</span>
                    <span className="block text-sm text-muted">Email</span>
                  </span>
                </a>
              </li>
              <li className="flex min-h-11 items-center gap-3 px-4 py-2 text-sm text-muted">
                <MapPin className="size-5 text-berry" />
                {bakery.city}
              </li>
            </ul>
          </div>
          <OrderForm tier={tier} onTier={setTier} />
        </section>
      </main>

      <footer className="border-t border-line pb-24 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl font-medium">Boonies Bakery Co</p>
            <p className="mt-2 text-sm text-muted">Home bakery · Cakes, cookies, and sweet treats · {bakery.city}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a className="min-h-11 inline-flex items-center text-muted hover:text-ink" href={bakery.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a className="min-h-11 inline-flex items-center text-muted hover:text-ink" href={`tel:${bakery.phoneTel}`}>
              {bakery.phoneDisplay}
            </a>
            <a className="min-h-11 inline-flex items-center text-muted hover:text-ink" href={`mailto:${bakery.email}`}>
              Email
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-4 py-3 md:hidden">
        <a
          href={bakery.messenger}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 items-center justify-center rounded-md bg-berry text-sm font-medium text-cream"
        >
          Message to order
        </a>
      </div>
    </div>
  );
}
