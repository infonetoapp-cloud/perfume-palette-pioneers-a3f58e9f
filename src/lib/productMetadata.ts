export type ScentFamily =
  | "fresh"
  | "woody"
  | "vanilla"
  | "floral"
  | "citrus"
  | "amber"
  | "aromatic";

export interface ProductMeta {
  code: string;
  gender: "women" | "men" | "unisex";
  feeling: string;
  description: string;
  usage: string;
  scentFamilies: ScentFamily[];
  scentNotes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  mainNotes: Array<{
    name: string;
    icon: "floral" | "sweet" | "warm" | "fresh" | "woody" | "spicy" | "citrus" | "musky";
  }>;
  intensity: "Soft" | "Medium" | "Strong";
  badges: string[];
}

const productMetadata: Record<string, ProductMeta> = {
  e1: {
    code: "E1",
    gender: "men",
    feeling: "Fresh, airy, and deeply evocative of the sea.",
    description:
      "A bright opening of lemon, bergamot, and sweet lime evokes a Mediterranean breeze. The heart is a marine-floral blend with cyclamen, freesia, and watery freshness, while the base dries down into cedar, oakmoss, musk, and patchouli. A clean aquatic-woody style with an easy, polished summer feel.",
    usage: "Summer days, coastal trips, casual daytime wear.",
    scentFamilies: ["fresh", "citrus", "woody"],
    scentNotes: {
      top: ["Lemon", "Bergamot", "Sweet Lime"],
      middle: ["Marine Notes", "Cyclamen", "Freesia"],
      base: ["Cedar", "Oakmoss", "Musk", "Patchouli"],
    },
    mainNotes: [
      { name: "Marine", icon: "fresh" },
      { name: "Citrus", icon: "citrus" },
      { name: "Fresh", icon: "fresh" },
    ],
    intensity: "Medium",
    badges: ["Summer Essential", "Day Wear"],
  },
  e6: {
    code: "E6",
    gender: "men",
    feeling: "Nostalgic, warm, and distinctly masculine.",
    description:
      "Green apple, mint, and lavender create a clean aromatic start before clove, clary sage, and geranium deepen the scent. The base blends pine needles, vetiver, patchouli, and oakmoss into a refined barbershop-style finish. A classic fougere profile with vintage character and strong everyday appeal.",
    usage: "Autumn days, smart-casual wear, signature scent rotation.",
    scentFamilies: ["aromatic", "woody", "fresh"],
    scentNotes: {
      top: ["Green Apple", "Mint", "Lavender"],
      middle: ["Clove", "Clary Sage", "Geranium"],
      base: ["Pine Needles", "Vetiver", "Patchouli", "Oakmoss"],
    },
    mainNotes: [
      { name: "Aromatic", icon: "spicy" },
      { name: "Woody", icon: "woody" },
      { name: "Vintage", icon: "warm" },
    ],
    intensity: "Medium",
    badges: ["Vintage", "Signature"],
  },
  e49: {
    code: "E49",
    gender: "men",
    feeling: "Mysterious, modern, and deeply captivating.",
    description:
      "Ginger and pepper give the opening a dry spicy spark before black basil, sage, and cedar bring aromatic depth through the heart. Amber, suede, Brazilian redwood, and patchouli in the base create a smooth woody trail with evening presence. A woody-spiced profile built for confident night wear.",
    usage: "Evening events, dark-toned outfits, after-hours settings.",
    scentFamilies: ["woody", "amber"],
    scentNotes: {
      top: ["Ginger", "Pepper"],
      middle: ["Black Basil", "Sage", "Cedar"],
      base: ["Amber", "Suede", "Brazilian Redwood", "Patchouli"],
    },
    mainNotes: [
      { name: "Amber", icon: "warm" },
      { name: "Woody", icon: "woody" },
      { name: "Spicy", icon: "spicy" },
    ],
    intensity: "Strong",
    badges: ["Long-lasting", "Night Wear"],
  },
  e71: {
    code: "E71",
    gender: "men",
    feeling: "Fresh, cool, and effortlessly charismatic.",
    description:
      "Mint, lavender, bergamot, and cardamom create a brisk opening that feels clean and classic. Orange blossom and cinnamon warm the heart, while vanilla, tonka bean, amber, and sandalwood bring a smooth sensual finish. A fresh-to-warm masculine style with strong day-to-night versatility.",
    usage: "Day-to-night wear, date nights, signature scent rotation.",
    scentFamilies: ["fresh", "vanilla", "aromatic"],
    scentNotes: {
      top: ["Mint", "Lavender", "Bergamot", "Cardamom"],
      middle: ["Orange Blossom", "Cinnamon"],
      base: ["Vanilla", "Tonka Bean", "Amber", "Sandalwood"],
    },
    mainNotes: [
      { name: "Fresh", icon: "fresh" },
      { name: "Vanilla", icon: "sweet" },
      { name: "Aromatic", icon: "spicy" },
    ],
    intensity: "Medium",
    badges: ["Signature", "Day to Night"],
  },
  e82: {
    code: "E82",
    gender: "men",
    feeling: "Fresh, clean, and effortlessly confident.",
    description:
      "Cucumber, melon, and mandarin orange open the scent with cool freshness before basil, sage, and geranium bring crisp aromatic structure. Suede, woods, and musk in the base keep the finish clean and well-groomed. A light aromatic-fresh profile made for everyday use.",
    usage: "Daily wear, office, spring and summer outings.",
    scentFamilies: ["fresh", "citrus", "aromatic"],
    scentNotes: {
      top: ["Cucumber", "Melon", "Mandarin Orange"],
      middle: ["Basil", "Sage", "Geranium"],
      base: ["Suede", "Woodsy Notes", "Musk"],
    },
    mainNotes: [
      { name: "Fresh", icon: "fresh" },
      { name: "Aromatic", icon: "citrus" },
      { name: "Clean", icon: "fresh" },
    ],
    intensity: "Soft",
    badges: ["Daily Wear", "Office Friendly"],
  },
  e145: {
    code: "E145",
    gender: "men",
    feeling: "Urban, warm, and self-assured.",
    description:
      "Lavender and bright Amalfi lemon make the opening crisp and polished, while African orange flower softens the heart. Cedar, patchouli, and a touch of vanilla in the base add warmth without losing the clean aromatic profile. A woody-aromatic scent that moves easily from day into night.",
    usage: "Late afternoon, city life, smart-casual outfits.",
    scentFamilies: ["aromatic", "woody", "citrus"],
    scentNotes: {
      top: ["Lavender", "Amalfi Lemon"],
      middle: ["African Orange Flower"],
      base: ["Virginia Cedar", "Patchouli", "Vanilla"],
    },
    mainNotes: [
      { name: "Aromatic", icon: "fresh" },
      { name: "Woody", icon: "woody" },
      { name: "Warm", icon: "warm" },
    ],
    intensity: "Medium",
    badges: ["Versatile", "Smart Casual"],
  },
  e155: {
    code: "E155",
    gender: "men",
    feeling: "Passionate, vibrant, and magnetically seductive.",
    description:
      "Mint, green apple, and lemon create an energetic opening before tonka bean, ambroxan, and geranium add warmth through the heart. Vanilla, cedar, vetiver, and oakmoss in the base make the dry-down creamy, woody, and memorable. A bold aromatic-fougere style for people who want presence.",
    usage: "Night out, social events, when you want to be noticed.",
    scentFamilies: ["aromatic", "vanilla", "fresh"],
    scentNotes: {
      top: ["Mint", "Green Apple", "Lemon"],
      middle: ["Tonka Bean", "Ambroxan", "Geranium"],
      base: ["Madagascar Vanilla", "Virginian Cedar", "Atlas Cedar", "Vetiver", "Oakmoss"],
    },
    mainNotes: [
      { name: "Passionate", icon: "warm" },
      { name: "Sweet", icon: "sweet" },
      { name: "Bold", icon: "spicy" },
    ],
    intensity: "Strong",
    badges: ["Night Out", "Attention Grabber"],
  },
  e176: {
    code: "E176",
    gender: "men",
    feeling: "Bright, polished, and confidently modern.",
    description:
      "Blood orange, Sicilian lemon, juniper berry, and cardamom deliver a bright Mediterranean opening. Fig milk, lavender, clary sage, and pimento in the heart add texture and aromatic smoothness, while cedarwood, patchouli, and vetiver keep the base dry and masculine. A fresh citrus-aromatic style with premium daytime energy.",
    usage: "Warm weather, smart-casual dressing, daytime confidence.",
    scentFamilies: ["citrus", "aromatic", "woody"],
    scentNotes: {
      top: ["Blood Orange", "Sicilian Lemon", "Juniper Berry", "Cardamom"],
      middle: ["Fig Milk", "Lavender", "Clary Sage", "Pimento"],
      base: ["Cedarwood", "Patchouli", "Vetiver"],
    },
    mainNotes: [
      { name: "Citrus", icon: "citrus" },
      { name: "Aromatic", icon: "fresh" },
      { name: "Woody", icon: "woody" },
    ],
    intensity: "Medium",
    badges: ["Warm Weather", "Smart Casual"],
  },
  e184: {
    code: "E184",
    gender: "men",
    feeling: "Boozy, magnetic, and wrapped in warm vanilla woods.",
    description:
      "Rum accord and bergamot open with a dressed-up, rich tone before lavender and elemi keep the heart refined and aromatic. Cedarwood, Madagascar vanilla, and ambered woods build a dense, smooth dry-down with strong evening character. A woody-vanilla scent made for colder nights and dressed-up settings.",
    usage: "Night outs, colder evenings, dressed-up occasions.",
    scentFamilies: ["woody", "vanilla", "amber"],
    scentNotes: {
      top: ["Rum Accord", "Bergamot"],
      middle: ["Lavender", "Elemi"],
      base: ["Cedarwood", "Madagascar Vanilla", "Amber Woods"],
    },
    mainNotes: [
      { name: "Rum", icon: "spicy" },
      { name: "Vanilla", icon: "sweet" },
      { name: "Woody", icon: "woody" },
    ],
    intensity: "Strong",
    badges: ["Night Wear", "Cold Weather"],
  },
  e185: {
    code: "E185",
    gender: "men",
    feeling: "Rich, golden, and made for high-impact nights.",
    description:
      "Apple, davana, and rose bring a sweet polished opening that feels warm from the start. Cedar and osmanthus create a smooth woody-floral heart, while vanilla, tonka bean, and patchouli give the base a creamy and lingering density. A luxurious sweet-woody profile with clear nightlife energy.",
    usage: "Evening wear, statement nights, colder seasons.",
    scentFamilies: ["vanilla", "amber", "woody"],
    scentNotes: {
      top: ["Apple", "Davana", "Rose"],
      middle: ["Cedar", "Osmanthus"],
      base: ["Vanilla", "Tonka Bean", "Patchouli"],
    },
    mainNotes: [
      { name: "Vanilla", icon: "sweet" },
      { name: "Tonka", icon: "warm" },
      { name: "Woody", icon: "woody" },
    ],
    intensity: "Strong",
    badges: ["Evening Wear", "Statement Scent"],
  },
  b197: {
    code: "B197",
    gender: "women",
    feeling: "Warm, sweet, and addictive with unmistakable evening glamour.",
    description:
      "Pear, pink pepper, and orange blossom create a bright first impression before coffee, jasmine, bitter almond, and licorice make the heart denser and creamier. Vanilla, patchouli, cashmere wood, and cedar keep the base deep, sensual, and long-wearing. A warm floral-gourmand style with clear nighttime appeal.",
    usage: "Evening events, date nights, bold all-black outfits.",
    scentFamilies: ["vanilla", "floral", "amber"],
    scentNotes: {
      top: ["Pear", "Pink Pepper", "Orange Blossom"],
      middle: ["Coffee", "Jasmine", "Bitter Almond", "Licorice"],
      base: ["Vanilla", "Patchouli", "Cashmere Wood", "Cedar"],
    },
    mainNotes: [
      { name: "Coffee", icon: "warm" },
      { name: "Vanilla", icon: "sweet" },
      { name: "White Floral", icon: "floral" },
    ],
    intensity: "Strong",
    badges: ["Night Wear", "Fall and Winter"],
  },
  b206: {
    code: "B206",
    gender: "women",
    feeling: "Feminine, powerful, and unapologetically bold.",
    description:
      "Almond, coffee, bergamot, and lemon open the scent with instant richness. The heart blooms into tuberose, jasmine sambac, orange blossom, Bulgarian rose, and orris, giving it a full floral body with strong presence. Tonka bean, cacao, vanilla, praline, sandalwood, musk, amber, and woods in the base leave a luxurious and lasting trail.",
    usage: "Special evenings, elegant outfits, dressed-up occasions.",
    scentFamilies: ["floral", "vanilla", "amber"],
    scentNotes: {
      top: ["Almond", "Coffee", "Bergamot", "Lemon"],
      middle: ["Tuberose", "Jasmine Sambac", "Orange Blossom", "Bulgarian Rose", "Orris"],
      base: ["Tonka Bean", "Cacao", "Vanilla", "Praline", "Sandalwood"],
    },
    mainNotes: [
      { name: "Powerful", icon: "spicy" },
      { name: "Floral", icon: "floral" },
      { name: "Sweet", icon: "sweet" },
    ],
    intensity: "Strong",
    badges: ["Evening Wear", "Bold"],
  },
  b222: {
    code: "B222",
    gender: "women",
    feeling: "Bold, polished, and couture-like with a sensual floral lift.",
    description:
      "French lavender and bright citrus give the opening a fresh modern edge, while orange blossom and jasmine keep the heart radiant and elegant. Musk and warm vanilla soften the finish without losing structure. A floral-aromatic style that wears clean through the day and more sensual by evening.",
    usage: "Day-to-night wear, polished office looks, confident evenings.",
    scentFamilies: ["floral", "aromatic", "vanilla"],
    scentNotes: {
      top: ["French Lavender", "Citrus Peel"],
      middle: ["Orange Blossom", "Jasmine Accord"],
      base: ["Musk", "Warm Vanilla"],
    },
    mainNotes: [
      { name: "Lavender", icon: "fresh" },
      { name: "Orange Blossom", icon: "floral" },
      { name: "Vanilla", icon: "sweet" },
    ],
    intensity: "Strong",
    badges: ["Statement Floral", "Day to Night"],
  },
  b223: {
    code: "B223",
    gender: "women",
    feeling: "Luminous, feminine, and smoothly sophisticated.",
    description:
      "Bergamot and orange blossom create a bright airy opening before tuberose and jasmine add creamy floral depth through the heart. Cedarwood, vanilla, and white musk in the base keep the finish soft, clean, and polished. A modern white-floral profile with easy elegance and strong everyday wearability.",
    usage: "Brunches, weddings, daily luxury, smooth evening transitions.",
    scentFamilies: ["floral", "vanilla", "citrus"],
    scentNotes: {
      top: ["Bergamot", "Orange Blossom"],
      middle: ["Tuberose", "Jasmine"],
      base: ["Cedarwood", "Vanilla", "White Musk"],
    },
    mainNotes: [
      { name: "Orange Blossom", icon: "floral" },
      { name: "Tuberose", icon: "floral" },
      { name: "Vanilla", icon: "sweet" },
    ],
    intensity: "Medium",
    badges: ["Versatile", "Polished"],
  },
  b224: {
    code: "B224",
    gender: "women",
    feeling: "Radiant, airy, and polished with a clean floral glow.",
    description:
      "A citrus-led opening lifts the fragrance before a smooth rose-and-jasmine heart takes over. White musk keeps the floral body weightless and modern, while soft vanilla adds a subtle warm finish underneath. A clean floral style with a luminous and office-friendly presence.",
    usage: "Office wear, daytime elegance, spring dressing.",
    scentFamilies: ["floral", "fresh", "citrus"],
    scentNotes: {
      top: ["Citrus Accord"],
      middle: ["Rose", "Jasmine"],
      base: ["White Musk", "Vanilla"],
    },
    mainNotes: [
      { name: "Rose", icon: "floral" },
      { name: "Jasmine", icon: "floral" },
      { name: "Clean Musk", icon: "musky" },
    ],
    intensity: "Soft",
    badges: ["Office Friendly", "Elegant"],
  },
  b225: {
    code: "B225",
    gender: "women",
    feeling: "Cheerful, soft, and effortlessly modern.",
    description:
      "Strawberry, raspberry, blackberry, sour cherry, and black currant create a bright juicy opening with playful energy. Violet and jasmine soften the heart, while musk, vanilla, cashmeran, woods, amber, oakmoss, and patchouli add a warm fuzzy base. A fruity-floral gourmand style for easy everyday wear.",
    usage: "Everyday elegance, spring vibes, light-toned outfits.",
    scentFamilies: ["floral", "fresh", "vanilla"],
    scentNotes: {
      top: ["Strawberry", "Raspberry", "Blackberry", "Sour Cherry", "Black Currant"],
      middle: ["Violet", "Jasmine"],
      base: ["Musk", "Vanilla", "Cashmeran", "Woody Notes", "Amber"],
    },
    mainNotes: [
      { name: "Fruity", icon: "citrus" },
      { name: "Floral", icon: "floral" },
      { name: "Fresh", icon: "fresh" },
    ],
    intensity: "Soft",
    badges: ["Daily Wear", "Fresh"],
  },
};

productMetadata["k197"] = productMetadata["b197"];
productMetadata["k206"] = productMetadata["b206"];
productMetadata["k225"] = productMetadata["b225"];

export function extractCodeFromHandle(handle: string): string | null {
  const match = handle.match(/([ekb]\d{1,3})/i);
  return match ? match[1].toLowerCase() : null;
}

export function getProductMeta(handle: string): ProductMeta | null {
  const code = extractCodeFromHandle(handle);
  if (!code) return null;
  return productMetadata[code] || null;
}

export default productMetadata;
