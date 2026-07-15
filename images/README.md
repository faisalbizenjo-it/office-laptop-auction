# Laptop photos

No laptop photos are included yet. The website displays a clean laptop placeholder automatically.

## Adding photos (and the photo slideshow)

Each laptop can have up to **5 photos**, using the columns `photo_1`, `photo_2`,
`photo_3`, `photo_4` and `photo_5` in `data/laptops.csv`.

- If a laptop has **one** photo, the details popup shows that single image.
- If a laptop has **two or more** photos, the details popup automatically turns
  into a **slideshow** with left/right arrows, dots, a photo counter, swipe on
  touch screens, and keyboard arrow keys. However many photos you fill in is how
  many slides appear.
- The card thumbnail in the catalogue always uses the first available photo.

### Steps

1. Put the image files in this `images` folder.
2. In `data/laptops.csv`, enter the exact filenames for that laptop's row, e.g.:
   - `photo_1` → `KL-HP-LT-134_1.jpg`
   - `photo_2` → `KL-HP-LT-134_2.jpg`
   - `photo_3` → `KL-HP-LT-134_3.jpg`

   Leave any unused photo columns blank.
3. Commit the CSV and image files to GitHub.

You do not have to fill the columns in order and you do not have to use all five
— any blank photo columns are simply skipped.

The website also supports full public image URLs beginning with `https://`.

Recommended image format:
- JPG or WebP
- Landscape orientation
- Around 1200 × 675 pixels
- Under 500 KB where practical
