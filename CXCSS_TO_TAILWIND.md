# CXCSS to Tailwind 4

CXCSS numeric utilities used pixels. Preserve that behavior with Tailwind arbitrary
values instead of Tailwind's spacing scale.

- `a-items-center` → `items-center`
- `j-content-between` → `justify-between`
- `weight-500/600/700` → `font-medium/semibold/bold`
- `radius-8`, `radius-50p` → `rounded-[8px]`, `rounded-full`
- `w-100p`, `h-100p` → `w-full`, `h-full`
- `hover:pointer` → `cursor-pointer`
- `text-14`, `mt-20` → `text-[14px]`, `mt-[20px]`
- `bg-green`, `text-green`, `darkgreen` → `bg-brand`, `text-brand`, `brand-hover`
- `g|transition:0.5s` → `transition-all duration-500`
- `l:` → `lg:`; `s:` → `sm:`; `m:` → `md:`
- Drop `@lo:`, `@hi:`, and `@xhi:` prefixes.

Use the `brand`, `ink`, `ground`, and semantic color tokens declared in
`src/app/globals.css` for new Shoppp-owned UI.
