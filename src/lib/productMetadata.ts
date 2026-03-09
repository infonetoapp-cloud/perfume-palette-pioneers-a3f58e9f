// Product metadata — researched from Fragrantica for accurate scent profiles
// Keys match product code patterns found in Shopify handles (e.g. "b197", "e49")

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

  e1: {
    code: "E1",
    gender: "men",
    feeling: "Fresh, airy, and deeply evocative of the sea.",
    description: "A bright opening of lemon, bergamot, and sweet lime evokes a Mediterranean breeze. The heart is a complex marine harmony wrapped in subtle florals like cyclamen, freesia, and hyacinth. The base settles into a sophisticated dry-down of cedar, oakmoss, musk, and patchouli. An aquatic woody fragrance that smells like a sophisticated summer escape.",
    usage: "Summer days, beach clubs, casual white linen outfits.",
    scentNotes: {
      top: ["Lemon", "Bergamot", "Lime", "Jasmine"],
      middle: ["Marine Notes", "Cyclamen", "Freesia", "Hyacinth"],
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
  e2: {
    code: "E2",
    gender: "men",
    feeling: "Warm, sophisticated, and deeply romantic.",
    description: "Opens with a striking blend of grapefruit, coriander, and fresh basil for an energetic start. The heart quickly warms up with ginger, cardamom, and subtle orange blossom. The real magic happens in the base, where amber, cedar, and tobacco create an incredibly seductive and long-lasting trail. A spicy woody fragrance perfect for date nights.",
    usage: "Evening wear, date nights, elegant dinners.",
    scentNotes: {
      top: ["Grapefruit", "Coriander", "Basil"],
      middle: ["Ginger", "Cardamom", "Orange Blossom"],
      base: ["Amber", "Tobacco", "Cedar"],
    },
    mainNotes: [
      { name: "Warm", icon: "warm" },
      { name: "Spicy", icon: "spicy" },
      { name: "Woody", icon: "woody" },
    ],
    intensity: "Strong",
    badges: ["Date Night", "Seductive"],
  },
  e3: {
    code: "E3",
    gender: "men",
    feeling: "Earthy, green, and naturally charismatic.",
    description: "A fresh and green opening featuring mint, lavender, and grapefruit. The aromatic heart introduces clary sage, pine, and geranium, while a base of oakmoss, vetiver, and patchouli provides a classic, grounding masculine foundation. A fougère aromatic fragrance that feels completely in tune with nature.",
    usage: "Spring and fall days, outdoor events, signature everyday scent.",
    scentNotes: {
      top: ["Mint", "Lavender", "Grapefruit"],
      middle: ["Clary Sage", "Pine", "Geranium"],
      base: ["Oakmoss", "Vetiver", "Patchouli"],
    },
    mainNotes: [
      { name: "Green", icon: "fresh" },
      { name: "Aromatic", icon: "spicy" },
      { name: "Woody", icon: "woody" },
    ],
    intensity: "Medium",
    badges: ["Classic", "Versatile"],
  },
  e4: {
    code: "E4",
    gender: "men",
    feeling: "Dark, luxurious, and quietly powerful.",
    description: "Starts with a unique blend of sage, lemon, and a hint of dark plum. The heart reveals rich spices including cinnamon, black pepper, and cardamom. The dry-down is a dark, opulent blend of black ebony wood, patchouli, and Brazilian rosewood. A spicy woody oriental fragrance for those who command the room.",
    usage: "Formal events, winter evenings, sharp suits.",
    scentNotes: {
      top: ["Sage", "Lemon", "Plum"],
      middle: ["Cinnamon", "Black Pepper", "Cardamom"],
      base: ["Ebony Wood", "Patchouli", "Rosewood"],
    },
    mainNotes: [
      { name: "Dark", icon: "woody" },
      { name: "Spicy", icon: "spicy" },
      { name: "Rich", icon: "warm" },
    ],
    intensity: "Strong",
    badges: ["Formal", "Winter"],
  },
  e5: {
    code: "E5",
    gender: "men",
    feeling: "Modern, uplifting, and effortlessly stylish.",
    description: "A bright, crisp opening of yuzu, bergamot, and lemon leaves an immediate clean impression. The heart introduces a surprising coffee accord alongside nutmeg and violet leaf. The base remains fresh but grounded with cedar, sandalwood, and light musk. A fresh aromatic fragrance that balances energy with calm.",
    usage: "Office wear, brunch, everyday confidence.",
    scentNotes: {
      top: ["Yuzu", "Bergamot", "Lemon"],
      middle: ["Coffee Accord", "Nutmeg", "Violet Leaf"],
      base: ["Cedar", "Sandalwood", "Musk"],
    },
    mainNotes: [
      { name: "Clean", icon: "fresh" },
      { name: "Citrus", icon: "citrus" },
      { name: "Uplifting", icon: "spicy" },
    ],
    intensity: "Medium",
    badges: ["Office Safe", "Uplifting"],
  },
  e6: {
    code: "E6",
    gender: "men",
    feeling: "Nostalgic, warm, and distinctly masculine.",
    description: "An invigorating start of green apple, mint, and lavender gives way to a heart of clove, clary sage, and geranium leaves. The base is an unforgettable blend of pine needles, vetiver, patchouli, and oakmoss that smells like a high-end vintage barbershop. A classic fougère that never goes out of style.",
    usage: "Autumn days, smart casual wear, signature scent.",
    scentNotes: {
      top: ["Green Apple", "Mint", "Lavender"],
      middle: ["Clove", "Clary Sage", "Geranium"],
      base: ["Pine Needles", "Vetiver", "Oakmoss"],
    },
    mainNotes: [
      { name: "Aromatic", icon: "spicy" },
      { name: "Woody", icon: "woody" },
      { name: "Vintage", icon: "warm" },
    ],
    intensity: "Medium",
    badges: ["Vintage", "Signature"],
  },
  e7: {
    code: "E7",
    gender: "men",
    feeling: "Crisp, energetic, and purely refreshing.",
    description: "An explosive citrus opening of bergamot, mandarin, and grapefruit creates an immediate rush of energy. The heart softens with neroli, rosemary, and subtle jasmine. The dry-down features light white musk and cedarwood to anchor the freshness. A citrus aromatic fragrance perfect for high heat.",
    usage: "High summer, gym bag, morning refresh.",
    scentNotes: {
      top: ["Bergamot", "Mandarin", "Grapefruit"],
      middle: ["Neroli", "Rosemary", "Jasmine"],
      base: ["White Musk", "Cedarwood"],
    },
    mainNotes: [
      { name: "Citrus", icon: "citrus" },
      { name: "Fresh", icon: "fresh" },
      { name: "Clean", icon: "fresh" },
    ],
    intensity: "Soft",
    badges: ["Summer", "Gym"],
  },
  e8: {
    code: "E8",
    gender: "men",
    feeling: "Deep, mysterious, and richly complex.",
    description: "Opens with an intriguing mix of saffron, black pepper, and rose. The heart is a dense, smoky blend of incense, labdanum, and dark woods. The base reveals a luxurious combination of amber, oud, and leather that lasts well into the next day. An oriental woody fragrance for the bold.",
    usage: "Special occasions, black tie, deep winter.",
    scentNotes: {
      top: ["Saffron", "Black Pepper", "Rose"],
      middle: ["Incense", "Labdanum", "Dark Woods"],
      base: ["Amber", "Oud", "Leather"],
    },
    mainNotes: [
      { name: "Oud", icon: "woody" },
      { name: "Smoky", icon: "warm" },
      { name: "Leather", icon: "woody" },
    ],
    intensity: "Strong",
    badges: ["Luxury", "Long-lasting"],
  },
  e9: {
    code: "E9",
    gender: "men",
    feeling: "Sweet, seductive, and deeply inviting.",
    description: "A smooth opening of vanilla and almond leads into a heart of tonka bean, heliotrope, and subtle floral notes. The base is an addictive blend of rich amber, sandalwood, and creamy musk. An oriental vanilla fragrance that draws people in.",
    usage: "Intimate settings, cool evenings, close encounters.",
    scentNotes: {
      top: ["Vanilla", "Almond"],
      middle: ["Tonka Bean", "Heliotrope"],
      base: ["Amber", "Sandalwood", "Musk"],
    },
    mainNotes: [
      { name: "Sweet", icon: "sweet" },
      { name: "Vanilla", icon: "sweet" },
      { name: "Warm", icon: "warm" },
    ],
    intensity: "Medium",
    badges: ["Intimate", "Cozy"],
  },
  e10: {
    code: "E10",
    gender: "men",
    feeling: "Cool, profound, and endlessly deep.",
    description: "Opens with a striking blast of oceanic notes, sea salt, and grapefruit. The heart plunges deeper with seaweed, bay leaf, and geranium. The base anchors the aquatic theme with dark ambergris, guaiac wood, and wet slate. An intense aquatic woody fragrance.",
    usage: "Coastal evenings, summer nights, bold everyday wear.",
    scentNotes: {
      top: ["Oceanic Notes", "Sea Salt", "Grapefruit"],
      middle: ["Seaweed", "Bay Leaf", "Geranium"],
      base: ["Ambergris", "Guaiac Wood", "Wet Slate"],
    },
    mainNotes: [
      { name: "Aquatic", icon: "fresh" },
      { name: "Deep", icon: "woody" },
      { name: "Salty", icon: "citrus" },
    ],
    intensity: "Strong",
    badges: ["Oceanic", "Bold"],
  },
  e11: {
    code: "E11",
    gender: "men",
    feeling: "Dark, prestigious, and commanding.",
    description: "An opulent opening of precious woods and rare spices immediately sets a tone of luxury. The heart is a masterful blend of rich leather and dark floral undertones. The base is an unapologetically bold trail of authentic oud wood, dark amber, and black musk. A leather oud masterpiece for those who demand the best.",
    usage: "High-end events, executive meetings, when making a statement.",
    scentNotes: {
      top: ["Precious Woods", "Spices"],
      middle: ["Leather", "Dark Florals"],
      base: ["Oud Wood", "Dark Amber", "Black Musk"],
    },
    mainNotes: [
      { name: "Oud", icon: "woody" },
      { name: "Leather", icon: "woody" },
      { name: "Prestigious", icon: "warm" },
    ],
    intensity: "Strong",
    badges: ["Luxury", "Commanding"],
  },
  e12: {
    code: "E12",
    gender: "men",
    feeling: "Bright, energetic, and purely revitalizing.",
    description: "Bursts open with crushed mint leaves, lime, and crisp green apple. The heart reveals a clean aromatic blend of rosemary, thyme, and fresh cotton. The base settles into a transparent, soapy musk and light cedar that feels like stepping out of a premium shower. A fresh aromatic built for pure clean energy.",
    usage: "Post-workout, hot summer days, office safe.",
    scentNotes: {
      top: ["Mint", "Lime", "Green Apple"],
      middle: ["Rosemary", "Thyme", "Cotton Accord"],
      base: ["White Musk", "Light Cedar"],
    },
    mainNotes: [
      { name: "Fresh", icon: "fresh" },
      { name: "Herbal", icon: "spicy" },
      { name: "Clean", icon: "fresh" },
    ],
    intensity: "Medium",
    badges: ["Fresh", "Sport"],
  },
  e13: {
    code: "E13",
    gender: "men",
    feeling: "Modern, sharp, and brilliantly balanced.",
    description: "A razor-sharp opening of Sicilian lemon and bergamot peel. The heart transitions into a sophisticated woody-floral middle with cedarwood and subtle jasmine. The base is an elegant, long-lasting blend of vetiver, sandalwood, and clean musk. A citrus woody fragrance that defines modern masculine elegance.",
    usage: "Signature scent, boardroom to bar, year-round.",
    scentNotes: {
      top: ["Sicilian Lemon", "Bergamot Peel"],
      middle: ["Cedarwood", "Jasmine"],
      base: ["Vetiver", "Sandalwood", "Clean Musk"],
    },
    mainNotes: [
      { name: "Citrus", icon: "citrus" },
      { name: "Woody", icon: "woody" },
      { name: "Sharp", icon: "fresh" },
    ],
    intensity: "Medium",
    badges: ["Signature", "Versatile"],
  },
  e14: {
    code: "E14",
    gender: "men",
    feeling: "Fiery, exotic, and fiercely magnetic.",
    description: "An intoxicating start of cinnamon, cardamom, and star anise grabs attention immediately. The heart is a rich, sweet blend of dates, myrrh, and roasted tonka. The dry-down is an absolute powerhouse of golden amber, vanilla bean, and dark woods. A spicy amber fragrance meant to mesmerize.",
    usage: "Late nights, winter dates, bold outfits.",
    scentNotes: {
      top: ["Cinnamon", "Cardamom", "Star Anise"],
      middle: ["Dates", "Myrrh", "Tonka"],
      base: ["Golden Amber", "Vanilla Bean", "Dark Woods"],
    },
    mainNotes: [
      { name: "Spicy", icon: "spicy" },
      { name: "Amber", icon: "warm" },
      { name: "Sweet", icon: "sweet" },
    ],
    intensity: "Strong",
    badges: ["Magnetic", "Night Out"],
  },
  e15: {
    code: "E15",
    gender: "men",
    feeling: "Breezy, open, and boundlessly free.",
    description: "An invigorating splash of sea mist, yuzu, and ozone. The heart captures the essence of the coast with sea salt, driftwood, and blue lotus. The base is a clean, airy combination of white musk and coastal cedar. A marine fresh fragrance that smells like pure freedom.",
    usage: "Vacation, weekend getaways, casual days.",
    scentNotes: {
      top: ["Sea Mist", "Yuzu", "Ozone"],
      middle: ["Sea Salt", "Driftwood", "Blue Lotus"],
      base: ["White Musk", "Coastal Cedar"],
    },
    mainNotes: [
      { name: "Marine", icon: "fresh" },
      { name: "Airy", icon: "fresh" },
      { name: "Salty", icon: "citrus" },
    ],
    intensity: "Soft",
    badges: ["Vacation", "Airy"],
  },
  e16: {
    code: "E16",
    gender: "men",
    feeling: "Vintage, cozy, and highly distinguished.",
    description: "Opens with a rich, boozy blast of rum and spices. The heart is an incredibly realistic, warm pipe tobacco note blended with leather and dark cacao. The base lingers for ages with vanilla, tonka bean, and sweet woods. A warm tobacco fragrance that feels like an exclusive gentleman's club.",
    usage: "Autumn and winter evenings, leather jackets, intimate gatherings.",
    scentNotes: {
      top: ["Rum", "Spices"],
      middle: ["Pipe Tobacco", "Leather", "Cacao"],
      base: ["Vanilla", "Tonka Bean", "Sweet Woods"],
    },
    mainNotes: [
      { name: "Tobacco", icon: "warm" },
      { name: "Boozy", icon: "spicy" },
      { name: "Vanilla", icon: "sweet" },
    ],
    intensity: "Strong",
    badges: ["Distinguished", "Cozy"],
  },

  // ── WOMEN'S COLLECTION ──
  b197: {
    code: "B197",
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
  b206: {
    code: "B206",
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
  b225: {
    code: "B225",
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

// Legacy K-series aliases kept for backwards compatibility with old handles.
productMetadata["k197"] = productMetadata["b197"];
productMetadata["k206"] = productMetadata["b206"];
productMetadata["k225"] = productMetadata["b225"];

/**
 * Extract product code from a Shopify handle
 * e.g. "david-walker-b197-womens-eau-de-parfum-50ml" -> "b197"
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
