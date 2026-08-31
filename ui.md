# UI Design System & Guidelines

This document outlines the UI design system used in this project. You can use these guidelines to replicate the same look, feel, and functionality for another website.

## 1. Color Palette

The color system relies on CSS variables defined in `globals.css`. It uses a fresh, trustworthy combination of blues and light greens.

| Color Role | CSS Variable | Hex Code | Description |
| :--- | :--- | :--- | :--- |
| **Primary** | `--primary` | `#3b82f6` | Core action color (e.g., CTA buttons, main highlights) |
| **Primary Light**| `--primary-light` | `#60a5fa` | Gradients and hover states |
| **Secondary** | `--secondary` | `#4ade80` | Borders and accents |
| **Background** | `--background` | `#f0fdf4` | Main page background (very subtle mint/green) |
| **Surface** | `--surface` | `#ffffff` | Background for cards, modals, and the sticky join box |
| **Text Main** | `--text-main` | `#0f172a` | Primary text color (dark navy/slate) |
| **Text Muted** | `--text-muted` | `#475569` | Secondary text, paragraphs, and descriptions |
| **Accent** | `--accent` | `#ef4444` | Urgent/Attention elements (e.g., the "LIVE" badge) |

## 2. Typography

The design uses three distinct Google Fonts to create a modern, dynamic typographic hierarchy.

*   **Import URL**: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap`

| Typeface | CSS Variable | Usage |
| :--- | :--- | :--- |
| **Bebas Neue** | `--font-poster` | Huge, impactful hero titles (e.g., `13rem` font size). |
| **Outfit** | `--font-heading` | Standard section headings (h1-h6) and CTA button text. |
| **Inter** | `--font-body` | Standard body copy, descriptions, and list items. |

## 3. Core UI Components & Styling

### 3.1 Glassmorphism (Frosted Glass)
Several key components (Hero content, Description cards) use a glassmorphism effect to overlay text beautifully on top of backgrounds.
```css
background: rgba(255, 255, 255, 0.85); /* Adjust opacity & color as needed */
backdrop-filter: blur(15px);
-webkit-backdrop-filter: blur(15px);
```

### 3.2 Gradients
Gradients are primarily used on CTA buttons and decorative underlines.
```css
/* Button Gradient */
background: linear-gradient(135deg, var(--primary), var(--primary-light));

/* Underline Gradient */
background: linear-gradient(90deg, var(--primary), var(--primary-light));
```

### 3.3 The "Join Box" (Sticky Sidebar)
The main conversion element is a sticky box on desktop.
*   **Behavior**: `position: sticky; top: 2rem;`
*   **Style**: White surface (`#ffffff`) with heavy backdrop blur, rounded corners (`24px`), and a soft shadow (`box-shadow: 0 30px 60px rgba(0,0,0,0.05);`).

### 3.4 Topic Cards
Grid-based cards used to display features/topics.
*   **Base state**: White surface, `20px` border-radius, `1px` subtle border, image on top, padding in the content area.
*   **Hover state**: Moves up slightly (`transform: translateY(-5px);`) with a tinted border and intensified shadow (`border-color: rgba(34, 197, 94, 0.3); box-shadow: 0 15px 40px rgba(34, 197, 94, 0.15);`).

### 3.5 FAQ Accordions
Uses native HTML `<details>` and `<summary>` tags heavily styled for a custom look.
*   **Interaction**: Opening toggles a border color change and a shadow.
*   **Icons**: Native markers are hidden, replaced with custom `+` and `−` pseudo-elements.

## 4. Animations

Animations are a huge part of what makes the site feel "premium" and dynamic.

*   **`pulse`**: Applied to the primary CTA buttons to draw the eye continuously.
*   **`slideLeft` (15s infinite)**: Moves a very wide background container horizontally to create a continuous hero slideshow.
*   **`slideUp` / `slideInLeft`**: Used for hero text on initial page load, creating a staggered entrance.
*   **`slideDownBadge`**: Drops the "LIVE" badge down from the top edge of the screen on load.
*   **`blink`**: Creates the recording dot effect on the live badge.
*   **`fadeIn` & `scaleUp`**: Used for modal popup entrances.

## 5. Layout Strategy

*   **Max Width Container**: Core content is wrapped in a container that maxes out at `1400px` (or `1200px` for standard text pages) and centers via `margin: 0 auto;`.
*   **CSS Grid Structure**: The main content area splits into a `3fr` (left content) and `2fr` (right sticky sidebar) layout using `display: grid;`.
*   **Responsive Breakpoints**:
    *   `@media (max-width: 968px)`: The grid collapses into a single column (`1fr`).
    *   `@media (max-width: 600px)`: Hero typography shrinks dramatically, and padding is reduced for mobile screens.

## 6. Implementation Checklist for New Site

1.  **Setup CSS Variables**: Copy the `:root` block from `globals.css`.
2.  **Import Fonts**: Add the Google Fonts import to the top of your global stylesheet.
3.  **Global Resets**: Ensure `box-sizing: border-box`, remove default margins, and set the `body` font family to `var(--font-body)`.
4.  **Copy Keyframe Animations**: Grab the `@keyframes` definitions (pulse, slideUp, etc.) from `globals.css` and `page.module.css`.
5.  **Build Core Utilities**: Create reusable CSS classes for the `container`, the `joinButton` (pulse effect), and the `glassmorphism` effect.
