type NoteAssetDirectory = "ingredients" | "accords" | "families";

type NoteAssetConfig = {
  file: string;
  directory: NoteAssetDirectory;
  toneClassName: string;
};

function normalizeNoteLabel(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const NOTE_ASSET_CONFIG: Record<string, NoteAssetConfig> = {
  amber: {
    file: "amber",
    directory: "accords",
    toneClassName: "from-[#f6e2b8] via-[#f8efe0] to-[#fffaf2]",
  },
  bergamot: {
    file: "bergamot",
    directory: "ingredients",
    toneClassName: "from-[#f8efb9] via-[#fbf6d7] to-[#fffdf1]",
  },
  cardamom: {
    file: "cardamom",
    directory: "ingredients",
    toneClassName: "from-[#dfe5ba] via-[#eef0d9] to-[#fafbf0]",
  },
  cedarwood: {
    file: "cedarwood",
    directory: "ingredients",
    toneClassName: "from-[#ecd4bd] via-[#f4e8dd] to-[#fdf8f4]",
  },
  "clary-sage": {
    file: "clary-sage",
    directory: "accords",
    toneClassName: "from-[#dce6d7] via-[#eef3eb] to-[#fbfdf9]",
  },
  coffee: {
    file: "coffee",
    directory: "ingredients",
    toneClassName: "from-[#ead8cf] via-[#f4ede7] to-[#fcf9f7]",
  },
  geranium: {
    file: "geranium",
    directory: "ingredients",
    toneClassName: "from-[#f3d6d9] via-[#faedef] to-[#fff9fa]",
  },
  "green-apple": {
    file: "green-apple",
    directory: "accords",
    toneClassName: "from-[#dcecc7] via-[#eef7e3] to-[#fbfef8]",
  },
  jasmine: {
    file: "jasmine",
    directory: "ingredients",
    toneClassName: "from-[#f8f1df] via-[#fdf9ee] to-[#fffef8]",
  },
  lavender: {
    file: "lavender",
    directory: "ingredients",
    toneClassName: "from-[#e7def7] via-[#f3eefb] to-[#fcfaff]",
  },
  lemon: {
    file: "lemon",
    directory: "ingredients",
    toneClassName: "from-[#fbefb6] via-[#fdf7de] to-[#fffdf3]",
  },
  mint: {
    file: "mint",
    directory: "ingredients",
    toneClassName: "from-[#d6eedf] via-[#edf8f1] to-[#fbfefa]",
  },
  musk: {
    file: "musk",
    directory: "accords",
    toneClassName: "from-[#ebe5dd] via-[#f5f1ec] to-[#fcfaf8]",
  },
  oakmoss: {
    file: "oakmoss",
    directory: "ingredients",
    toneClassName: "from-[#dde7c8] via-[#eef4e3] to-[#fbfdf7]",
  },
  "orange-blossom": {
    file: "orange-blossom",
    directory: "ingredients",
    toneClassName: "from-[#fde7d8] via-[#fef4ea] to-[#fffaf6]",
  },
  patchouli: {
    file: "patchouli",
    directory: "ingredients",
    toneClassName: "from-[#e4dbc9] via-[#f2ede3] to-[#fbfaf7]",
  },
  sandalwood: {
    file: "sandalwood",
    directory: "ingredients",
    toneClassName: "from-[#edd7c5] via-[#f5e9df] to-[#fdf9f5]",
  },
  "tonka-bean": {
    file: "tonka-bean",
    directory: "ingredients",
    toneClassName: "from-[#ead8bc] via-[#f6ede0] to-[#fdfaf5]",
  },
  vanilla: {
    file: "vanilla",
    directory: "ingredients",
    toneClassName: "from-[#f7e6c8] via-[#fbf1de] to-[#fffaf3]",
  },
  vetiver: {
    file: "vetiver",
    directory: "ingredients",
    toneClassName: "from-[#dfe5bf] via-[#eef2dc] to-[#fafcf3]",
  },
};

const RAW_NOTE_ALIASES: Record<string, string> = {
  amber: "amber",
  "amber accord": "amber",
  "atlas cedar": "cedarwood",
  bergamot: "bergamot",
  cardamom: "cardamom",
  cedar: "cedarwood",
  cedarwood: "cedarwood",
  coffee: "coffee",
  geranium: "geranium",
  "green apple": "green-apple",
  jasmine: "jasmine",
  "jasmine accord": "jasmine",
  "jasmine sambac": "jasmine",
  lavender: "lavender",
  lemon: "lemon",
  "madagascar vanilla": "vanilla",
  mint: "mint",
  musk: "musk",
  oakmoss: "oakmoss",
  "orange blossom": "orange-blossom",
  "african orange flower": "orange-blossom",
  patchouli: "patchouli",
  sandalwood: "sandalwood",
  "tonka bean": "tonka-bean",
  tonka: "tonka-bean",
  vanilla: "vanilla",
  vetiver: "vetiver",
  "virginia cedar": "cedarwood",
  "virginian cedar": "cedarwood",
  "warm vanilla": "vanilla",
  "white musk": "musk",
};

const NOTE_ALIASES = Object.fromEntries(
  Object.entries(RAW_NOTE_ALIASES).map(([key, value]) => [normalizeNoteLabel(key), value]),
) as Record<string, string>;

export type NoteVisual = {
  key: string;
  src: string;
  toneClassName: string;
};

export function getNoteVisual(label: string): NoteVisual | null {
  const normalized = normalizeNoteLabel(label);
  const resolvedKey = NOTE_ALIASES[normalized] ?? normalized;
  const asset = NOTE_ASSET_CONFIG[resolvedKey];

  if (!asset) {
    return null;
  }

  return {
    key: resolvedKey,
    src: `/note-illustrations/${asset.directory}/${asset.file}.png`,
    toneClassName: asset.toneClassName,
  };
}
