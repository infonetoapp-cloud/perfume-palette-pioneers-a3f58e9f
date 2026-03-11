# Note Illustration System Plan

## Goal

Replace the current generic scent icons with a reusable transparent ingredient illustration library that works across all perfume PDPs and car scent PDPs without adding clutter.

The current icon-heavy surfaces are driven from:

- `src/pages/ProductDetail.tsx`
- `src/pages/AutoScentsPage.tsx`
- `src/lib/productMetadata.ts`

## Where To Use The New Visuals

### High priority

1. `ProductDetail.tsx`
   - `ScentNotes`
   - `MainNoteHighlights`
   - top / heart / base rows inside the accordion

2. `AutoScentsPage.tsx`
   - `AutoScentNoteHighlights`
   - scent note rows inside the accordion
   - compact profile chips that currently use `getProfileIcon()`

### Medium priority

3. PDP mood / accord area
   - small tinted note chips or mini ingredient cutouts

### Do not add them here

4. Product listing cards
5. Recommendation cards
6. Promo strips
7. Collection rail

Those surfaces should stay cleaner. The richer visuals belong mainly on PDP note sections.

## Recommended Asset System

### Folder structure

- `public/note-illustrations/ingredients/`
- `public/note-illustrations/accords/`
- `public/note-illustrations/families/`

### File format

- master generation: transparent `PNG`
- later optimization: optional conversion to `WebP`

### Canvas

- square
- 1600 x 1600
- transparent background
- object centered
- object should fill about 65% to 75% of the frame

## Rendering Strategy

Do not generate a different illustration for every spelling variant.

Use a normalized asset map so one asset can serve multiple metadata labels.

### Alias groups

- `vanilla.png`
  - Vanilla
  - Madagascar Vanilla
  - Warm Vanilla

- `cedarwood.png`
  - Cedar
  - Cedarwood
  - Virginia Cedar
  - Virginian Cedar
  - Atlas Cedar

- `lavender.png`
  - Lavender
  - French Lavender

- `orange-blossom.png`
  - Orange Blossom
  - African Orange Flower

- `jasmine.png`
  - Jasmine
  - Jasmine Accord
  - Jasmine Sambac

- `rose.png`
  - Rose
  - Bulgarian Rose

- `wood-notes.png`
  - Woody Notes
  - Woodsy Notes

## Asset Production Order

The catalog data has about 84 unique perfume pyramid note strings and another car scent accord set. Do not ask Gemini to generate everything in one pass. Use batches.

### Batch 1: core frequent notes

- vanilla.png
- patchouli.png
- bergamot.png
- lavender.png
- orange-blossom.png
- cedarwood.png
- jasmine.png
- musk.png
- tonka-bean.png
- amber.png
- geranium.png
- lemon.png
- mint.png
- oakmoss.png
- vetiver.png
- cardamom.png
- clary-sage.png
- coffee.png
- green-apple.png
- sandalwood.png

### Batch 2: florals, fruits, citrus, herbs

- blood-orange.png
- mandarin-orange.png
- sweet-lime.png
- amalfi-lemon.png
- sicilian-lemon.png
- pear.png
- apple.png
- blackberry.png
- black-currant.png
- raspberry.png
- sour-cherry.png
- strawberry.png
- melon.png
- cucumber.png
- basil.png
- sage.png
- juniper-berry.png
- violet.png
- orris.png
- tuberose.png
- freesia.png
- cyclamen.png
- osmanthus.png
- rose.png

### Batch 3: woods, resins, spices, gourmands

- cashmere-wood.png
- cashmeran.png
- ambroxan.png
- elemi.png
- brazilian-redwood.png
- pine-needles.png
- suede.png
- amber-woods.png
- cacao.png
- praline.png
- almond.png
- bitter-almond.png
- licorice.png
- cinnamon.png
- clove.png
- ginger.png
- pink-pepper.png
- pepper.png
- rum-accord.png
- davana.png
- fig-milk.png
- pimento.png
- black-basil.png
- white-musk.png

### Batch 4: abstract accords and car scent notes

- marine-notes.png
- citrus-accord.png
- fresh-melon.png
- green-pear.png
- iris-petal.png
- oud-accord.png
- powdery-florals.png
- soft-violet.png
- watery-accord.png
- clean-air-accord.png
- clean-green-notes.png
- light-cotton-musk.png
- smooth-musk.png
- velvet-musk.png
- white-woods.png
- light-woods.png
- dark-woods.png
- dry-woods.png
- dry-soft-amber.png
- amber-resin.png
- warm-spice.png
- saffron-glow.png
- soft-citrus-peel.png
- soft-smoke.png
- airy-dry-down.png
- pearl-accord.png
- smooth-balsamic-warmth.png

## Visual Direction For Gemini

The style should not feel like clipart or stock cutouts.

Use:

- luxury botanical / ingredient illustration
- refined editorial ecommerce
- semi-realistic painterly realism
- soft tactile texture
- premium, elegant, colorful
- isolated subject
- consistent angle and scale

Avoid:

- flat vector icons
- emoji style
- clipart
- harsh shadows
- background tiles
- text baked into image
- square badges
- noisy compositions
- multiple ingredients in one file unless the note itself is an accord

## Exact Gemini Prompt Template

Use this exact prompt for each batch. Only replace the `FILE MANIFEST` section with the batch you are generating.

```text
Create a cohesive ingredient illustration pack for a premium perfume ecommerce site.

This is not for posters, ads, or product banners.
This is a reusable UI asset library for scent notes.

Goal:
- Generate isolated ingredient and accord illustrations that will replace generic icons on perfume and car scent product pages.
- Every asset must work on many different UI backgrounds.
- The style must feel elegant, colorful, premium, natural, and editorial.

Output rules:
- Create one file per note name in the FILE MANIFEST section below.
- Save each file as a transparent PNG.
- Use a square 1600x1600 canvas.
- The background must be fully transparent.
- No white box, no beige box, no circular badge, no frame, no card, no label.
- Do not place text inside the image.
- Keep the subject centered and large enough for UI use.
- Subject should fill roughly 65% to 75% of the frame.
- Keep all files in one consistent visual family.

Style rules:
- Semi-realistic luxury ingredient illustration
- Premium editorial ecommerce look
- Slightly painterly but still clearly recognizable
- Rich but tasteful natural color
- Clean edges
- Soft dimensional lighting
- If a shadow is used, it must be extremely soft and preserved in transparency
- No dramatic black shadow
- No busy scene
- No background props
- No table surface
- No extra decorative elements unless the note itself requires it

Recognition rules:
- Each ingredient must be immediately recognizable.
- Keep natural botanical and material identity accurate.
- Do not stylize ingredients into abstract blobs.
- Do not make them childish or cartoonish.

Accord rules:
- For abstract notes like "Marine Notes", "Clean Air Accord", "Powdery Florals", or "Airy Dry-Down", create a tasteful symbolic ingredient-style visual that still fits the same family.
- These accord visuals should feel premium and restrained, not fantasy VFX.
- They must still read like elegant fragrance-note illustrations.

Consistency rules:
- Use one consistent camera angle family across the whole batch.
- Keep scale coherent across files.
- Keep lighting direction coherent across files.
- Keep visual finish coherent across files.

File output location:
- Ingredients: C:\Users\sinan\Desktop\gorsel\perfume-palette-pioneers-a3f58e9f\public\note-illustrations\ingredients\
- Accords: C:\Users\sinan\Desktop\gorsel\perfume-palette-pioneers-a3f58e9f\public\note-illustrations\accords\

Save each file with the exact filename given below.
Do not stop until every file in the manifest exists.

FILE MANIFEST:
[PASTE ONE BATCH LIST HERE]
```

## Ready-To-Paste Gemini Prompt For Batch 1

```text
Create a cohesive ingredient illustration pack for a premium perfume ecommerce site.

This is not for posters, ads, or product banners.
This is a reusable UI asset library for scent notes.

Goal:
- Generate isolated ingredient and accord illustrations that will replace generic icons on perfume and car scent product pages.
- Every asset must work on many different UI backgrounds.
- The style must feel elegant, colorful, premium, natural, and editorial.

Output rules:
- Create one file per note name in the FILE MANIFEST section below.
- Save each file as a transparent PNG.
- Use a square 1600x1600 canvas.
- The background must be fully transparent.
- No white box, no beige box, no circular badge, no frame, no card, no label.
- Do not place text inside the image.
- Keep the subject centered and large enough for UI use.
- Subject should fill roughly 65% to 75% of the frame.
- Keep all files in one consistent visual family.

Style rules:
- Semi-realistic luxury ingredient illustration
- Premium editorial ecommerce look
- Slightly painterly but still clearly recognizable
- Rich but tasteful natural color
- Clean edges
- Soft dimensional lighting
- If a shadow is used, it must be extremely soft and preserved in transparency
- No dramatic black shadow
- No busy scene
- No background props
- No table surface
- No extra decorative elements unless the note itself requires it

Recognition rules:
- Each ingredient must be immediately recognizable.
- Keep natural botanical and material identity accurate.
- Do not stylize ingredients into abstract blobs.
- Do not make them childish or cartoonish.

Consistency rules:
- Use one consistent camera angle family across the whole batch.
- Keep scale coherent across files.
- Keep lighting direction coherent across files.
- Keep visual finish coherent across files.

File output location:
- Ingredients: C:\Users\sinan\Desktop\gorsel\perfume-palette-pioneers-a3f58e9f\public\note-illustrations\ingredients\
- Accords: C:\Users\sinan\Desktop\gorsel\perfume-palette-pioneers-a3f58e9f\public\note-illustrations\accords\

Save each file with the exact filename given below.
Do not stop until every file in the manifest exists.

FILE MANIFEST:
- vanilla.png
- patchouli.png
- bergamot.png
- lavender.png
- orange-blossom.png
- cedarwood.png
- jasmine.png
- musk.png
- tonka-bean.png
- amber.png
- geranium.png
- lemon.png
- mint.png
- oakmoss.png
- vetiver.png
- cardamom.png
- clary-sage.png
- coffee.png
- green-apple.png
- sandalwood.png
```

## After Generation

Once the PNG library exists, build a resolver in code so all products get the richer visuals automatically from metadata.

Suggested next implementation step:

1. add a `noteVisuals.ts` resolver
2. extend metadata to support `asset?`
3. render images first, fallback icons second
4. apply it to perfume PDP and auto scent PDP
