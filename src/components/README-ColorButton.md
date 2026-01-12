# ColorButton Component

A reusable button/badge component with a beautiful gradient border effect, replicated from the original PHP template's `.colorbtn` style.

## Features

- ✨ Gradient border effect using conic gradient
- 🎨 Multiple variants (default, white, small)
- 🔗 Can be used as a link or badge
- ♿ Accessible and semantic
- 📱 Responsive design

## Usage

### Basic Badge

```astro
import ColorButton from '../components/ColorButton.astro';

<ColorButton>Voice agent</ColorButton>
```

### As a Link

```astro
<ColorButton href="/features">Explore Features</ColorButton>
```

### Variants

#### White Variant (for dark backgrounds)

```astro
<ColorButton class="white">Integrations</ColorButton>
```

#### Small Variant

```astro
<ColorButton class="small">Build fast</ColorButton>
```

#### No Margin

```astro
<ColorButton class="no-margin">FAQ</ColorButton>
```

#### Combine Multiple Classes

```astro
<ColorButton class="white small no-margin">Label</ColorButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string?` | `undefined` | Optional link URL. When provided, renders as `<a>` tag |
| `class` | `string?` | `undefined` | Additional CSS classes for variants |

## Variants Classes

| Class | Description |
|-------|-------------|
| `white` | White text color for dark backgrounds |
| `small` | Smaller size (14px font, smaller padding) |
| `no-margin` | Removes bottom margin |

## Style Details

### Gradient Colors
The border uses a conic gradient with these colors:
- `#F07C5B` (Coral) at 0° and 360°
- `#E26C90` (Pink) at 190.8°
- `#4593DD` (Blue) at 315°

### Dimensions
- **Default padding**: `6px 13px`
- **Small padding**: `4px 10px`
- **Border radius**: `30px`
- **Border width**: `2px` (created via padding in pseudo-element)

### Typography
- **Font family**: DM Sans
- **Font size**: `18px` (default), `14px` (small)
- **Font weight**: `500`
- **Line height**: `1.4`

## Technical Implementation

The gradient border effect is achieved using:

1. A `::before` pseudo-element with the conic gradient
2. CSS mask to create the border appearance
3. Proper z-index and pointer-events management

```css
.color-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  background: conic-gradient(...);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

## Examples in Astra Landing Page

```astro
<!-- Section badges -->
<ColorButton>Voice agent</ColorButton>
<ColorButton>Key features</ColorButton>
<ColorButton>Why build with Astra</ColorButton>

<!-- Small variants in feature cards -->
<ColorButton class="small">Build fast</ColorButton>
<ColorButton class="small">Customize faster</ColorButton>
<ColorButton class="small">Deploy in minutes</ColorButton>

<!-- White variant on dark backgrounds -->
<ColorButton class="white">Integrations</ColorButton>
```

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support with -webkit- prefixes)
- ⚠️ IE11 (not supported - graceful degradation to solid border)

## Accessibility

- Semantic HTML (`<a>` or `<span>`)
- Proper color contrast
- Keyboard navigation support (when used as link)
- No accessibility barriers from visual effects

## Performance

- Pure CSS implementation (no JavaScript)
- Minimal DOM nodes (component + ::before pseudo-element)
- GPU-accelerated (uses transform for positioning)

---

**Original Source**: `tpl-astra.php` `.colorbtn` style  
**Component Type**: Astro Component (Static)  
**File**: `src/components/ColorButton.astro`
