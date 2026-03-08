// Product metadata — researched from Fragrantica for accurate scent profiles
// Keys match product code patterns found in Shopify handles (e.g. "k197", "e49")

export interface ProductMeta {
  code: string;
  gender: "women" | "men" | "unisex";
  feeling: string;
  description: string;
  usage: string;
  scentNotes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  mainNotes: Array<{ name: string; icon: "floral" | "sweet" | "warm" | "fresh" | "woody" | "spicy" | "citrus" | "musky" }>;
  intensity: "Soft" | "Medium" | "Strong";
  badges: string[];
}

const productMetadata: Record<string, ProductMeta> = {
  // ── MEN'S COLLECTION ──
  e49: {
    code: "E49",
    gender: "men",
    feeling: "Mysterious, modern, and deeply captivating.",
    description: "Opens quietly with a sharp hit of ginger and pepper, then quickly builds into a rich, aromatic depth. Black basil and sage lend a herbal sophistication at the heart, while a warm base of amber, suede, Brazilian redwood, and patchouli creates a smooth, earthy trail that lingers for hours. A woody aromatic fragrance ideal for confident evening appearances.",
    usage: "Evening events, dark-toned outfits, sophisticated occasions.",
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
  e82: {
    code: "E82",
    gender: "men",
    feeling: "Fresh, clean, and effortlessly confident.",
    description: "A crisp opening of cucumber and melon with a zesty touch of mandarin orange gives way to an aromatic heart of basil, sage, and geranium. The dry-down settles into a refined base of suede, woodsy notes, and musk — creating a clean, well-groomed impression that lasts all day. An aromatic fougère fragrance perfect for everyday wear.",
    usage: "Daily wear, office, spring and summer outings.",
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
    description: "A refined opening of lavender and bright Amalfi lemon leads into a smooth, elegant heart of African orange flower. The base warms up beautifully with Virginia cedar, patchouli, and a subtle hint of vanilla — creating a woody aromatic character that's polished yet inviting. A versatile scent that transitions effortlessly from day to night.",
    usage: "Late afternoon, city life, smart-casual outfits.",
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
  e148: {
    code: "E148",
    gender: "men",
    feeling: "Energetic, bold, and instantly noticeable.",
    description: "Bursts open with fresh grapefruit and invigorating sea notes alongside bright mandarin orange. The heart brings aromatic depth with bay leaf and delicate jasmine, while the base grounds everything with ambergris, guaiac wood, oakmoss, and patchouli. A woody aquatic fragrance built for athletic energy and magnetic confidence.",
    usage: "Post-gym, weekends, youthful and dynamic occasions.",
    scentNotes: {
      top: ["Sea Notes", "Grapefruit", "Mandarin Orange"],
      middle: ["Bay Leaf", "Jasmine"],
      base: ["Ambergris", "Guaiac Wood", "Oakmoss", "Patchouli"],
    },
    mainNotes: [
      { name: "Sporty", icon: "fresh" },
      { name: "Citrus", icon: "citrus" },
      { name: "Powerful", icon: "spicy" },
    ],
    intensity: "Strong",
    badges: ["Sport", "Day Wear"],
  },
  e153: {
    code: "E153",
    gender: "men",
    feeling: "Powerful, prestigious, and commanding.",
    description: "Opens with a luxurious burst of bergamot, black currant, apple, lemon, and pink pepper — fruity yet refined. The heart deepens with pineapple, patchouli, and Moroccan jasmine, delivering a smoky-sweet complexity. The base of birch, musk, oakmoss, cedarwood, and ambroxan provides a rich, leathery foundation that lingers with authority. A chypre fruity masterpiece for the man who leads.",
    usage: "Business meetings, special occasions, when a strong first impression matters.",
    scentNotes: {
      top: ["Bergamot", "Black Currant", "Apple", "Lemon", "Pink Pepper"],
      middle: ["Pineapple", "Patchouli", "Moroccan Jasmine"],
      base: ["Birch", "Musk", "Oakmoss", "Cedarwood", "Ambroxan"],
    },
    mainNotes: [
      { name: "Prestigious", icon: "woody" },
      { name: "Fruity", icon: "citrus" },
      { name: "Charismatic", icon: "warm" },
    ],
    intensity: "Strong",
    badges: ["Premium", "Signature Scent"],
  },
  e155: {
    code: "E155",
    gender: "men",
    feeling: "Passionate, vibrant, and magnetically seductive.",
    description: "A bold opening of fresh mint, green apple, and lemon creates an immediate energizing effect. The heart reveals tonka bean, ambroxan, and geranium — adding warmth and a classic fougère twist. The base settles into a rich blend of Madagascar vanilla, Virginian cedar, Atlas cedar, vetiver, and oakmoss for a long-lasting, sensual trail. An aromatic fougère fragrance that embodies passion and desire.",
    usage: "Night out, social events, when you want to be noticed.",
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

  // ── WOMEN'S COLLECTION ──
  k197: {
    code: "K197",
    gender: "women",
    feeling: "A warm, sweet, and addictive scent designed for bold evenings and unforgettable nights.",
    description: "Opens with a crisp burst of pear and a subtle kick of pink pepper, softened by delicate orange blossom. The heart reveals a rich, creamy coffee accord intertwined with jasmine, bitter almond, and a hint of licorice — creating an irresistibly warm core. The base settles into a deep, enveloping blend of vanilla, patchouli, cashmere wood, and cedar that lingers for hours. An oriental vanilla fragrance best suited for fall and winter evenings.",
    usage: "Evening events, date nights, bold all-black outfits.",
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
    badges: ["Night Wear", "Fall & Winter"],
  },
  k206: {
    code: "K206",
    gender: "women",
    feeling: "Feminine, powerful, and unapologetically bold.",
    description: "Opens with a tempting blend of almond and coffee brightened by bergamot and lemon. The heart is an opulent white-floral bouquet of tuberose, jasmine sambac, orange blossom, Bulgarian rose, and orris — layered and deeply sensual. The base descends into a rich, addictive blend of tonka bean, cacao, vanilla, praline, sandalwood, musk, amber, cashmere wood, patchouli, cinnamon, and cedar. An oriental floral fragrance that commands attention and leaves a lasting impression.",
    usage: "Special evenings, elegant outfits, high-heeled confidence.",
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
  k225: {
    code: "K225",
    gender: "women",
    feeling: "Cheerful, soft, and effortlessly modern.",
    description: "Bursts open with a juicy crush of strawberry, raspberry, blackberry, sour cherry, and black currant, accented with mandarin orange and lemon. The heart offers a gentle floral embrace of violet and jasmine. The base wraps everything in a warm, cozy blanket of musk, vanilla, cashmeran, woody notes, amber, oakmoss, and patchouli. A floral fruity gourmand fragrance that's youthful, lovable, and perfect for everyday wear.",
    usage: "Everyday elegance, spring vibes, light-toned outfits.",
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

// B-series aliases
productMetadata["b197"] = productMetadata["k197"];
productMetadata["b206"] = productMetadata["k206"];
productMetadata["b225"] = productMetadata["k225"];

/**
 * Extract product code from a Shopify handle
 * e.g. "david-walker-k197-womens-eau-de-parfum-50ml" -> "k197"
 */
export function extractCodeFromHandle(handle: string): string | null {
  const match = handle.match(/([ekb]\d{2,3})/i);
  return match ? match[1].toLowerCase() : null;
}

export function getProductMeta(handle: string): ProductMeta | null {
  const code = extractCodeFromHandle(handle);
  if (!code) return null;
  return productMetadata[code] || null;
}

export default productMetadata;
