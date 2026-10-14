# Nutriserve website design system

Reviewed using the user's UI UX Pro Max and Frontend Design skills in their Claude folders.

## Design plan

Nutriserve's primary audience is a factory or corporate team arranging daily employee meals. The first screen must identify workplace catering immediately. The food platter is the memorable visual; the remaining interface is practical and restrained.

Palette: cocoa `#422522` from the logo; dark cocoa `#2b1816`; kitchen white `#fffdf9`; warm mustard `#f6c547`; banana-leaf green `#3f6143`; steel border `#ddd7cd`. Cocoa and mustard express the actual brand. Leaf green connects to the food rather than replacing the brand.

Type: Barlow Condensed 600/700 for strong, compact kitchen-menu headlines; Karla 400/500/600/700 for readable service information. Body copy is 16px on phones, with 48px primary button and input targets. Decorative captions never carry required information.

Layout: left-aligned service headline and complete thali image, followed by a four-choice meal board, kitchen standards, a genuine numbered planning sequence, and the enquiry form.

```text
brand               meals / kitchen / planning       quote
workplace catering headline         complete thali image
four meal choices -> photograph + meal details
kitchen standards -> what goes into every meal
sticky planning introduction | 1. team 2. menu 3. service
contact information           | enquiry form
```

## Critique and adaptation before implementation

UI UX Pro Max's general design-system result suggested navy/blue and a broad vibrant style. Its restaurant search suggested red and warm gold. Neither should overwrite Nutriserve's supplied logo palette, so the final design uses cocoa and mustard.

Frontend Design identified generic chrome: numbered labels for sections that are not sequences, small all-capital labels, a differently coloured italic fragment in each heading, and repeated reveal effects. Remove those treatments. Keep numbering only for the three actual planning steps.

Keep motion tied to a visitor's action: scroll progress, gentle food-image parallax, active planning steps and a quick meal-photo crossfade. Reveal only two image compositions. Replace the endless flavour ticker with a readable static service band. Menu and button transitions last 180–280ms; scroll image reveals last 400ms. Reduce motion when the device requests it.

## Quality checks

Use visible keyboard focus, clear selected tabs, 48px primary targets, 8px or more checkbox spacing, 16px mobile inputs, and high-contrast text. Keep all planning copy readable even when its step is inactive. Batch geometry reads before scroll-related style writes. Keep the form's email preparation honest; it does not send or store enquiries.

Code and asset checks are automated. Actual browser, viewport and screen-reader verification remain unavailable in the current session and must not be represented as completed.
