# KiddoScout Design Brief

**Purpose**: Centralized discovery platform for parents to find kids' entertainment across the USA. Emphasis on streamlined search, instant feedback, and clear empty states.

**Tone & Differentiation**: Kid-friendly, parent-focused, premium modern tech. Teal primary establishes trust and calmness; colorful category tiles create visual distinction without overwhelm. Smooth animations reward interaction.

## Color Palette

| Token | OKLCH | Usage |
|-------|-------|-------|
| teal-primary | 0.44 0.102 181 | Primary actions, hero section, borders, focus states |
| orange-accent | 0.65 0.18 39 | Theme Parks category, secondary CTAs, hover states |
| yellow-accent | 0.85 0.16 88 | Museums category, highlights, badges |
| cat-green | 0.7 0.14 148 | Parks category tile |
| cat-teal | 0.68 0.12 183 | Events category tile |
| cat-blue | 0.65 0.13 244 | Weekend Plans category tile |
| background | 0.968 0.005 210 | Page background, light mode |
| card | 1 0 0 | Card surfaces, elevated containers |
| foreground | 0.15 0.02 250 | Body text, high contrast |

## Typography

- **Display**: Poppins 700/600 — hero title, section headers
- **Body**: Poppins 400 — body copy, search form labels
- **UI**: Poppins 600 — button labels, category names, tabs
- Scale: 12px (caption), 14px (body), 16px (base), 18px (lg), 24px (xl), 32px (2xl hero)

## Structural Zones

| Zone | Treatment | Details |
|------|-----------|----------|
| Header/Nav | Teal primary bg, white foreground, soft shadow | Desktop nav with logo, category tabs, Find Fun button |
| Hero Search | Teal hero gradient backdrop, white card form | City/State inputs, 50-state dropdown, prominent Search button |
| Results Grid | Light background, card surfaces | Category-filtered activity cards with tab interface |
| Category Tiles | Each has distinct color (green/orange/teal/yellow/blue) | 56px border-radius, soft card-hover shadow, text overlay |
| Empty State | Centered, muted foreground, illustrative spacing | Clear messaging, search suggestions |
| Footer | Muted background, border-top | Contact/links (optional) |

## Spacing & Rhythm

- Base: 4px grid. Padding: 16px (sm), 24px (md), 32px (lg). Gaps: 12px (tight), 16px (standard), 24px (loose).
- Mobile: single column, 16px gutters. Desktop: grid-cols-3/4, 24px gutters.

## Component Patterns

- **Search form**: separate City/State inputs, State as dropdown (50 states), Search button primary-teal
- **Category tabs**: inline, underline active state, instant client-side filter while backend loads
- **Activity cards**: image, title, category badge, distance/address, soft shadow, hover lift (card-hover shadow)
- **Dropdowns**: white bg, teal text, hover state bg-muted, arrow icon

## Motion & Animation

- **fade-up**: 0.6s on page load, stagger effect on cards (50ms offset)
- **blob-pulse**: 4s infinite on hero decorative elements
- **transition-smooth**: 0.3s cubic-bezier on all interactive elements (buttons, hovers, focus)
- **slide-in**: 0.4s on tab transitions
- No bounce; movement is subtle and purposeful.

## Constraints

- No gradients beyond subtle teal hero backdrop. No shadows heavier than card-hover. 
- All colors are semantic tokens from OKLCH palette — no hex, no rgb, no arbitrary values.
- Font sizes stay within type scale. No animations faster than 0.2s or slower than 1s (except blob-pulse).
- Mobile-first responsive design; content reflows cleanly at 640px (sm), 768px (md), 1024px (lg).

## Signature Detail

Blobby, organic accent shapes (used sparingly in hero) with blob-pulse animation. Category tiles have soft rounded corners (56px) creating a playful, approachable aesthetic while maintaining parent-focused professionalism.
