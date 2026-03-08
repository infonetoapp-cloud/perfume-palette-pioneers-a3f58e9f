// Product metadata extracted from David Walker selection document
// Keys match product code patterns found in Shopify handles (e.g. "k197", "e49")

export interface ProductMeta {
  code: string;
  inspiredBy: string;
  inspiredBrand: string;
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
  // ── ERKEK SERİSİ ──
  e49: {
    code: "E49",
    inspiredBy: "Euphoria",
    inspiredBrand: "Calvin Klein",
    gender: "men",
    feeling: "Gizemli, modern ve derin bir etki bırakır.",
    description: "Sakin başlar ama kısa sürede dikkat çeken bir ağırlık kurar. Akşam şıklığı, kontrollü çekicilik ve kendinden emin bir duruş hissettirir.",
    usage: "Akşam kullanımı, koyu giyim, daha sofistike bir profil.",
    scentNotes: {
      top: ["Biber", "Zencefil", "Ravent"],
      middle: ["Adaçayı", "Sedir Ağacı", "Süsen"],
      base: ["Amber", "Misk", "Kahve"],
    },
    mainNotes: [
      { name: "Amber", icon: "warm" },
      { name: "Odunsu", icon: "woody" },
      { name: "Baharatlı", icon: "spicy" },
    ],
    intensity: "Strong",
    badges: ["Long-lasting", "Night Wear"],
  },
  e82: {
    code: "E82",
    inspiredBy: "Polo Blue",
    inspiredBrand: "Ralph Lauren",
    gender: "men",
    feeling: "Ferah, temiz ve sportif bir özgüven verir.",
    description: "Daha açık, düzenli ve bakımlı bir izlenim yaratır. Rahat ama özensiz olmayan, gün boyu temiz kalmış hissi veren bir karakter taşır.",
    usage: "Günlük kullanım, ofis, bahar-yaz temposu.",
    scentNotes: {
      top: ["Kavun", "Salatalık", "Mandalina"],
      middle: ["Fesleğen", "Adaçayı", "Geranium"],
      base: ["Süet", "Odunsu Notalar", "Misk"],
    },
    mainNotes: [
      { name: "Ferah", icon: "fresh" },
      { name: "Aromatik", icon: "citrus" },
      { name: "Temiz", icon: "fresh" },
    ],
    intensity: "Soft",
    badges: ["Daily Wear", "Office Friendly"],
  },
  e145: {
    code: "E145",
    inspiredBy: "Guilty",
    inspiredBrand: "Gucci",
    gender: "men",
    feeling: "Şehirli, sıcak ve kendinden emin bir hava oluşturur.",
    description: "Abartısız ama fark edilen bir çekicilik verir. Modern, kontrollü ve net duran; konuşmadan önce bile güven veren bir izlenim bırakır.",
    usage: "Akşamüstü, şehir hayatı, smart-casual kombinler.",
    scentNotes: {
      top: ["Lavanta", "Limon", "Portakal Çiçeği"],
      middle: ["Portakal Çiçeği", "Küdama"],
      base: ["Sedir Ağacı", "Paçuli", "Amber"],
    },
    mainNotes: [
      { name: "Aromatik", icon: "fresh" },
      { name: "Odunsu", icon: "woody" },
      { name: "Sıcak", icon: "warm" },
    ],
    intensity: "Medium",
    badges: ["Versatile", "Smart Casual"],
  },
  e148: {
    code: "E148",
    inspiredBy: "Invictus",
    inspiredBrand: "Paco Rabanne",
    gender: "men",
    feeling: "Enerjik, parlak ve rekabetçi bir güç hissettirir.",
    description: "Dışa dönük, sportif ve hızlı dikkat çeken bir karakter kurar. Hareketli ortamlarda daha canlı, özgüveni yüksek ve iddialı bir profil yansıtır.",
    usage: "Spor sonrası, hafta sonu, genç ve dinamik kullanım.",
    scentNotes: {
      top: ["Greyfurt", "Deniz Notaları", "Mandalina"],
      middle: ["Defne Yaprağı", "Yasemin", "Guaiac Ağacı"],
      base: ["Amber Ağacı", "Misk", "Meşe Yosunu"],
    },
    mainNotes: [
      { name: "Sportif", icon: "fresh" },
      { name: "Enerjik", icon: "citrus" },
      { name: "Güçlü", icon: "spicy" },
    ],
    intensity: "Strong",
    badges: ["Sport", "Day Wear"],
  },
  e153: {
    code: "E153",
    inspiredBy: "Aventus",
    inspiredBrand: "Creed",
    gender: "men",
    feeling: "Güçlü, prestijli ve lider bir duruş verir.",
    description: "Lüks algısı yüksek, hedef odaklı ve karizmatik bir etki yaratır. Olduğu ortamda kalite, statü ve yüksek özgüven hissini öne çıkarır.",
    usage: "Toplantı, özel buluşma, güçlü ilk izlenim gereken anlar.",
    scentNotes: {
      top: ["Ananas", "Bergamot", "Elma"],
      middle: ["Huş Ağacı", "Yasemin", "Gül"],
      base: ["Misk", "Meşe Yosunu", "Vanilya"],
    },
    mainNotes: [
      { name: "Prestijli", icon: "woody" },
      { name: "Meyveli", icon: "citrus" },
      { name: "Karizmatik", icon: "warm" },
    ],
    intensity: "Strong",
    badges: ["Premium", "Signature Scent"],
  },
  e155: {
    code: "E155",
    inspiredBy: "Eros",
    inspiredBrand: "Versace",
    gender: "men",
    feeling: "Tutkulu, canlı ve baştan çıkarıcı bir aura taşır.",
    description: "Daha genç, cesur ve yüksek enerjili bir his verir. Kalabalık içinde kolay fark edilen, sosyal ve ateşli bir karaktere yakışır.",
    usage: "Gece dışarı çıkarken, eğlence, dikkat çekmek.",
    scentNotes: {
      top: ["Nane", "Yeşil Elma", "Limon"],
      middle: ["Tonka Fasulyesi", "Amber", "Geranium"],
      base: ["Vanilya", "Sedir Ağacı", "Misk"],
    },
    mainNotes: [
      { name: "Tutkulu", icon: "warm" },
      { name: "Tatlı", icon: "sweet" },
      { name: "Cesur", icon: "spicy" },
    ],
    intensity: "Strong",
    badges: ["Night Out", "Attention Grabber"],
  },

  // ── KADIN SERİSİ ──
  k197: {
    code: "K197",
    inspiredBy: "Black Opium",
    inspiredBrand: "Yves Saint Laurent",
    gender: "women",
    feeling: "Sıcak, tatlı ve geceye dönük bir çekicilik verir.",
    description: "Modern, özgüvenli ve biraz asi bir feminenlik taşır. Yakınlaşan, iz bırakan ve özellikle akşam saatlerinde daha etkili duran bir his oluşturur.",
    usage: "Gece daveti, siyah kombinler, iddialı görünüm.",
    scentNotes: {
      top: ["Pembe Biber", "Portakal Çiçeği", "Armut"],
      middle: ["Kahve", "Yasemin", "Acı Badem"],
      base: ["Vanilya", "Paçuli", "Sedir Ağacı"],
    },
    mainNotes: [
      { name: "Tatlı", icon: "sweet" },
      { name: "Sıcak", icon: "warm" },
      { name: "Çiçeksi", icon: "floral" },
    ],
    intensity: "Strong",
    badges: ["Night Wear", "Signature Scent"],
  },
  k206: {
    code: "K206",
    inspiredBy: "Good Girl",
    inspiredBrand: "Carolina Herrera",
    gender: "women",
    feeling: "Feminen, güçlü ve iddialı bir imza bırakır.",
    description: "Yumuşak zarafetle cesur tavrı aynı anda verir. Şık görünmekle yetinmeyen, akılda kalmak isteyen biri için güçlü ve net bir etki yaratır.",
    usage: "Özel akşam, topuklu kombinler, güçlü feminen stil.",
    scentNotes: {
      top: ["Badem", "Kahve", "Bergamot"],
      middle: ["Tuberose", "Yasemin Sambac", "Gül"],
      base: ["Kakao", "Tonka Fasulyesi", "Sandal Ağacı"],
    },
    mainNotes: [
      { name: "Güçlü", icon: "spicy" },
      { name: "Çiçeksi", icon: "floral" },
      { name: "Tatlı", icon: "sweet" },
    ],
    intensity: "Strong",
    badges: ["Evening Wear", "Bold"],
  },
  k225: {
    code: "K225",
    inspiredBy: "Burberry Her",
    inspiredBrand: "Burberry",
    gender: "women",
    feeling: "Neşeli, yumuşak ve modern bir sıcaklık verir.",
    description: "Genç, şehirli ve kolay sevilen bir karakter taşır. Tatlı ama ağır olmayan, samimi ve pozitif bir etki bıraktığı için günlük kullanımda çok rahat durur.",
    usage: "Günlük şıklık, bahar havası, açık tonlu kombinler.",
    scentNotes: {
      top: ["Böğürtlen", "Limon", "Mandalina"],
      middle: ["Yasemin", "Menekşe", "Mürdüm Eriği"],
      base: ["Misk", "Amber", "Sedir Ağacı"],
    },
    mainNotes: [
      { name: "Meyveli", icon: "citrus" },
      { name: "Çiçeksi", icon: "floral" },
      { name: "Taze", icon: "fresh" },
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
