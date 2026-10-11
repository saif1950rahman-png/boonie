import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { bakery } from "@/lib/bakery";
import { cn } from "@/lib/utils";

const links = [
  { href: "#treats", label: "Treats" },
  { href: "#order", label: "Ways to order" },
  { href: "#stories", label: "Notes" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-150",
        stuck ? "border-line bg-paper/95 shadow-soft" : "border-transparent bg-paper",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#top" className="min-h-11 flex items-center gap-2">
          <span className="font-display text-xl font-medium tracking-tight text-ink">Boonies</span>
          <span className="hidden text-sm text-muted sm:inline">Bakery Co</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Page">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-md px-3 text-sm text-muted transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={bakery.messenger}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center rounded-md bg-berry px-4 text-sm font-medium text-cream transition-colors duration-150 hover:bg-berry-deep active:scale-[0.96] md:inline-flex"
          >
            Place an order
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-line px-5 py-3 md:hidden" aria-label="Page">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center text-base text-ink"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
