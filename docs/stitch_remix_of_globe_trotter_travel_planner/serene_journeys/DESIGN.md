---
name: Serene Journeys
colors:
  surface: '#fff8ef'
  surface-dim: '#e1d9cb'
  surface-bright: '#fff8ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf3e4'
  surface-container: '#f5edde'
  surface-container-high: '#efe7d9'
  surface-container-highest: '#e9e2d3'
  on-surface: '#1e1b13'
  on-surface-variant: '#56423e'
  inverse-surface: '#343026'
  inverse-on-surface: '#f8f0e1'
  outline: '#89726d'
  outline-variant: '#ddc0ba'
  surface-tint: '#9f402d'
  primary: '#9f402d'
  on-primary: '#ffffff'
  primary-container: '#e2725b'
  on-primary-container: '#5a0d02'
  inverse-primary: '#ffb4a5'
  secondary: '#56642b'
  on-secondary: '#ffffff'
  secondary-container: '#d6e7a1'
  on-secondary-container: '#5a682f'
  tertiary: '#2a6292'
  on-tertiary: '#ffffff'
  tertiary-container: '#6497ca'
  on-tertiary-container: '#002e4e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#802918'
  secondary-fixed: '#d9eaa3'
  secondary-fixed-dim: '#bdce89'
  on-secondary-fixed: '#161f00'
  on-secondary-fixed-variant: '#3e4c16'
  tertiary-fixed: '#cfe5ff'
  tertiary-fixed-dim: '#9acbff'
  on-tertiary-fixed: '#001d34'
  on-tertiary-fixed-variant: '#024a78'
  background: '#fff8ef'
  on-background: '#1e1b13'
  surface-variant: '#e9e2d3'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style
The design system is centered on the concept of "Mindful Exploration." It aims to evoke a sense of calm, warmth, and curated inspiration, moving away from the frantic energy of typical travel booking sites. 

The aesthetic is **Organic Minimalism**. It combines the clean lines of modern functionalism with the tactile warmth of a "winter village" or "desert sunset." The UI utilizes generous whitespace (negative space) and soft, diffused light to create an interface that feels like a premium travel journal rather than a digital tool. Visuals should lean into geometric frames—circles, arches, and soft-rectangles—to house minimalist vector illustrations, ensuring the experience feels structured yet whimsical.

## Colors
The palette is grounded in a soft pastel beige base, providing a "paper-like" warmth that reduces eye strain and increases coziness. 

- **Primary (Terracotta):** Used for primary actions and highlights, evoking warmth and desert landscapes.
- **Secondary (Sage Green):** Used for success states, nature-themed tags, and eco-friendly travel indicators.
- **Tertiary (Dusty Blue):** Used for links, information callouts, and winter-themed elements.
- **Neutral:** The background stays strictly within the warm cream/off-white spectrum to maintain the "cozy" brand promise. Avoid pure blacks; use deep charcoal-browns for text to keep the contrast soft.

## Typography
This design system utilizes a hierarchy that balances the geometric authority of **Montserrat** with the functional clarity of **Inter**. 

- **Headlines:** Set in Montserrat with slightly tighter letter-spacing for a modern, sophisticated look. Use "Sentence case" for headlines to maintain an approachable, friendly tone.
- **Body Text:** Inter is used for all long-form content to ensure maximum readability against the off-white background.
- **Labels:** Use Inter Medium for UI labels, buttons, and navigation items to provide a clear visual weight distinction from body text.

## Layout & Spacing
The layout follows a **Fluid Grid** model with an emphasis on "breathable" sections. 

- **Grid:** Use a 12-column grid for desktop and a 4-column grid for mobile. 
- **Rhythm:** Spacing follows an 8px linear scale. Use generous vertical padding between sections (80px+) to emphasize the minimalist, "unrushed" feel of the platform.
- **Margins:** Desktop views should maintain wide outer margins to center the content and create a "letter-boxed" editorial feel.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Ambient Shadows** rather than harsh borders.

- **Shadows:** Use extremely soft, low-opacity shadows (e.g., `rgba(60, 56, 54, 0.05)`) with a high blur radius to make cards appear as if they are floating gently on the beige background.
- **Layering:** Elements "lift" slightly on hover. Use the primary cream background for the page, and pure white for the top-level cards/containers to create a subtle natural hierarchy.
- **Glassmorphism:** Use sparingly for navigation bars or overlays to maintain the "winter" aesthetic, applying a heavy backdrop-blur (20px+) with a 40% white tint.

## Shapes
The shape language is defined by **large, friendly radii**. 

- **Standard Elements:** Use `0.5rem` (8px) for buttons and input fields.
- **Cards and Containers:** Use `rounded-xl` (1.5rem / 24px) for travel itinerary cards and destination photos to create a welcoming, soft-edged look.
- **Illustrations:** Enclose minimalist illustrations in perfect circles or "archway" shapes (rounded top, flat bottom) to mimic the windows of a cozy cottage or an observatory.

## Components
- **Buttons:** Primary buttons use the Terracotta background with white text. They should have a "subtle bounce" interaction on hover. Use a large height (min 48px) for accessibility and a "premium" feel.
- **Cards:** Destination cards should feature a geometric image frame at the top. The footer of the card should be clean, using `label-md` for price or duration and `body-md` for the title.
- **Input Fields:** Fields use a white background with a very thin `1px` border in a muted tan color. Focus states should transition the border to Sage Green.
- **Chips/Tags:** Use the Earth Tone palette (Sage, Blue, Terracotta) with 10% opacity backgrounds and 100% opacity text for categorized items like "Nature," "Urban," or "Relaxing."
- **Itinerary Timeline:** A vertical dashed line using the Dusty Blue color, with circular nodes representing stops. This reinforces the "journey" aspect of the brand.