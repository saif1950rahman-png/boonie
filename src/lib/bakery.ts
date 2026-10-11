export const bakery = {
  name: "Boonies Bakery Co",
  city: "Kilgore, TX",
  phoneDisplay: "(903) 812-9005",
  phoneTel: "+19038129005",
  email: "booniesbakery24@gmail.com",
  facebook: "https://www.facebook.com/p/Boonies-Bakery-Co-61559064575617/",
  messenger: "https://m.me/61559064575617",
} as const;

export const tiers = [
  {
    id: "box",
    name: "A box",
    blurb: "Cookies and a few treats for the house, a thank-you, or a quiet weekend.",
    includes: ["A small batch, not a whole party", "Flavors based on what’s baking", "Pickup in Kilgore"],
    featured: false,
  },
  {
    id: "cake",
    name: "A cake",
    blurb: "The usual order. Birthdays, anniversaries, and the “just because” table.",
    includes: ["Size and flavor by message", "Buttercream, finished by hand", "A clear price before it’s baked"],
    featured: true,
  },
  {
    id: "spread",
    name: "A spread",
    blurb: "A cake plus trays when the headcount is bigger than one dessert.",
    includes: ["Multiple sweets, one pickup", "Tell them the date and the crowd", "Best booked ahead"],
    featured: false,
  },
] as const;

export type TierId = (typeof tiers)[number]["id"] | "unsure";
