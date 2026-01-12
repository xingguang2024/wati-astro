# Coding Standards & Guidelines

## 📜 Language Requirements

**IMPORTANT**: All documentation and code comments MUST be written in English.

### ✅ Allowed
- English documentation
- English code comments
- English commit messages
- English variable/function names

### ❌ Not Allowed
- Non-English documentation
- Non-English code comments
- Non-English commit messages
- Non-English variable/function names

## 💻 Code Style

### TypeScript/JavaScript

#### Naming Conventions
```typescript
// ✅ Good - PascalCase for components
export default function FAQ() {}

// ✅ Good - camelCase for functions/variables
const handleClick = () => {}
const isModalOpen = false

// ✅ Good - UPPER_CASE for constants
const API_URL = 'https://api.example.com'

// ❌ Bad - Non-English names
const 用户名称 = '' // Don't use
```

#### Comments
```typescript
// ✅ Good - English comments
// Initialize the FAQ component with default state
const [openIndex, setOpenIndex] = useState<number>(0);

// ❌ Bad - Non-English comments
// 初始化FAQ组件 - Don't use
```

### Astro Components

```astro
---
// ✅ Good - English comments
// Import layout and components
import Layout from '../layouts/Layout.astro';
import FAQ from '../components/FAQ';

// Component props interface
interface Props {
  title?: string;
  description?: string;
}
---

<!-- ✅ Good - English HTML comments -->
<!-- Hero Banner Section -->
<section class="hero">
  <!-- Content here -->
</section>
```

### CSS/Tailwind

```css
/* ✅ Good - English comments */
/* Custom styles for hero section */
.hero {
  /* Gradient background */
  background: linear-gradient(to right, #8564FF, #4D71FF);
}

/* ❌ Bad - Non-English comments */
/* 英雄区域的自定义样式 */ /* Don't use */
```

## 📝 Documentation Standards

### File Headers
```typescript
/**
 * FAQ Component
 * 
 * Interactive FAQ accordion with smooth animations.
 * Displays frequently asked questions with expand/collapse functionality.
 * 
 * @component
 */
```

### Function Documentation
```typescript
/**
 * Toggle FAQ item open/closed state
 * 
 * @param index - Index of the FAQ item to toggle
 */
const toggleFAQ = (index: number) => {
  setOpenIndex(openIndex === index ? -1 : index);
};
```

### Interface Documentation
```typescript
/**
 * FAQ item data structure
 */
interface FAQItem {
  /** Question text */
  question: string;
  /** Answer text */
  answer: string;
}
```

## 🔧 Code Organization

### File Structure
```
src/
├── components/       # Reusable components
├── layouts/         # Page layouts
├── pages/           # Route pages
└── styles/          # Global styles
```

### Import Order
```typescript
// 1. External dependencies
import { useState } from 'react';

// 2. Internal components
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';

// 3. Styles
import '../styles/global.css';

// 4. Types
import type { Props } from './types';
```

## 🎨 Style Guidelines

### Tailwind CSS
- Use utility classes over custom CSS when possible
- Follow mobile-first responsive design
- Use consistent spacing scale

```tsx
// ✅ Good - Utility classes
<div className="px-4 py-8 md:px-8 md:py-12">

// ❌ Bad - Inline styles
<div style={{padding: '32px'}}>
```

### Component Structure
```tsx
// ✅ Good - Clear structure
export default function Component() {
  // 1. State declarations
  const [state, setState] = useState();
  
  // 2. Effects
  useEffect(() => {}, []);
  
  // 3. Event handlers
  const handleClick = () => {};
  
  // 4. Render
  return <div>...</div>;
}
```

## 📦 Git Commit Standards

### Commit Message Format
```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

### Examples
```bash
# ✅ Good
feat(FAQ): add accordion animation
fix(modal): resolve close button issue
docs(README): update installation steps

# ❌ Bad - Non-English
feat: 添加FAQ动画
```

## 🧪 Testing Standards

### Test File Naming
```
Component.tsx       # Component file
Component.test.tsx  # Test file
```

### Test Structure
```typescript
describe('FAQ Component', () => {
  it('should render all FAQ items', () => {
    // Test implementation
  });
  
  it('should toggle item on click', () => {
    // Test implementation
  });
});
```

## 📱 Responsive Design

### Breakpoints
```typescript
// Use Tailwind breakpoints
sm: '640px'   // Mobile
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large Desktop
```

### Mobile-First Approach
```tsx
// ✅ Good - Mobile first
<div className="text-base md:text-lg lg:text-xl">

// ❌ Bad - Desktop first
<div className="text-xl lg:text-lg md:text-base">
```

## ♿ Accessibility

### ARIA Labels
```tsx
// ✅ Good
<button aria-label="Close modal">×</button>

// ❌ Bad
<button>×</button>
```

### Semantic HTML
```tsx
// ✅ Good
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ❌ Bad
<div>
  <div>
    <div><a href="/">Home</a></div>
  </div>
</div>
```

## 🚀 Performance

### Image Optimization
- Use WebP format when possible
- Implement lazy loading
- Provide appropriate sizes

```tsx
// ✅ Good
<img 
  src="/images/hero.webp" 
  alt="Hero image"
  loading="lazy"
  width="800"
  height="600"
/>
```

### Code Splitting
```tsx
// ✅ Good - Dynamic imports
const Modal = lazy(() => import('./Modal'));
```

## 🔍 Code Review Checklist

Before submitting a PR, ensure:

- [ ] All comments and documentation are in English
- [ ] Code follows naming conventions
- [ ] No console.log statements in production code
- [ ] All imports are used
- [ ] No TypeScript errors
- [ ] No linter warnings
- [ ] Responsive design works on mobile
- [ ] Accessibility standards met
- [ ] Performance optimized
- [ ] Tests pass (if applicable)

## 📚 Additional Resources

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)

---

**Remember**: Consistency is key! Follow these standards to maintain a clean and professional codebase.
