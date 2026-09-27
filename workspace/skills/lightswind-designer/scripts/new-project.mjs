#!/usr/bin/env node
// Scaffold a Vite + React + TS + Tailwind v4 project pre-wired for Lightswind UI.
// Non-interactive replacement for `npx lightswind init` (which installs every component).
//
// Usage: node new-project.mjs <name> [--theme default|deep-ocean|crimson|emerald|amber|amethyst|mono] [--dir <parent>]
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE = path.resolve(SKILL_DIR, "..", "..");

const THEMES = {
  default: ["#173eff", "#3758f9"],
  "deep-ocean": ["#0ea5e9", "#38bdf8"],
  crimson: ["#e11d48", "#fb7185"],
  emerald: ["#10b981", "#34d399"],
  amber: ["#f59e0b", "#fbbf24"],
  amethyst: ["#8b5cf6", "#a78bfa"],
  mono: ["#000000", "#333333"],
};

const args = process.argv.slice(2);
const flag = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const theme = flag("--theme", "default");
const parent = path.resolve(flag("--dir", path.join(WORKSPACE, "projects")));
const rawName = args[0];

if (!rawName) { console.error("Usage: node new-project.mjs <name> [--theme <theme>] [--dir <parent>]"); process.exit(1); }
if (!THEMES[theme]) { console.error(`Unknown theme '${theme}'. Pick one of: ${Object.keys(THEMES).join(", ")}`); process.exit(1); }

const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const root = path.join(parent, slug);
if (fs.existsSync(root) && fs.readdirSync(root).length) { console.error(`❌ ${root} already exists and is not empty.`); process.exit(1); }

const write = (rel, content) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.replace(/^\n/, ""));
};
const run = cmd => execSync(cmd, { cwd: root, stdio: "inherit" });

console.log(`\n🛠  Creating ${slug} (${theme} theme) in ${root}`);

write("package.json", JSON.stringify({
  name: slug, private: true, version: "0.1.0", type: "module",
  scripts: { dev: "vite", build: "tsc -b && vite build", preview: "vite preview" },
}, null, 2));

write("vite.config.ts", `
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
`);

write("tsconfig.json", JSON.stringify({
  compilerOptions: {
    target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"], module: "ESNext",
    moduleResolution: "bundler", jsx: "react-jsx", strict: true, skipLibCheck: true,
    noEmit: true, isolatedModules: true, allowImportingTsExtensions: true, esModuleInterop: true,
    // Lightswind components are community source; keep type-checking useful but not brittle.
    noImplicitAny: false, noUnusedLocals: false, noUnusedParameters: false,
    paths: { "@/*": ["./src/*"] }, types: ["vite/client"],
  },
  include: ["src", "vite.config.ts"],
}, null, 2));

write("index.html", `
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${rawName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

write("src/main.tsx", `
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`);

write("src/App.tsx", `
export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground grid place-items-center">
      <h1 className="text-4xl font-semibold">${rawName}</h1>
    </main>
  );
}
`);

write("src/components/sections/.gitkeep", "");

console.log("\n📦 Installing dependencies…");
run("npm install --no-fund --no-audit react@19 react-dom@19 lightswind framer-motion gsap three clsx tailwind-merge class-variance-authority lucide-react cobe@^0.6");
run("npm install --no-fund --no-audit -D vite@8 @vitejs/plugin-react tailwindcss@4 @tailwindcss/vite typescript @types/react @types/react-dom @types/three @types/node");

// Shared Lightswind utilities, copied the same way `lightswind init` does.
const lw = path.join(root, "node_modules", "lightswind");
fs.cpSync(path.join(lw, "src/components/lib"), path.join(root, "src/lib"), { recursive: true });
fs.cpSync(path.join(lw, "src/components/hooks"), path.join(root, "src/hooks"), { recursive: true });

let css = fs.readFileSync(path.join(lw, "src/styles/lightswind.css"), "utf8");
const [c1, c2] = THEMES[theme];
css = css.replace(/(--primarylw:\s*)#[0-9a-fA-F]+;/g, `$1${c1};`).replace(/(--primarylw-2:\s*)#[0-9a-fA-F]+;/g, `$1${c2};`);
if (theme === "mono") css = css.replace(/(\.dark\s*{[^}]*--primarylw:\s*)#[0-9a-fA-F]+;/, "$1#ffffff;");
fs.writeFileSync(path.join(root, "src/lightswind.css"), css);

write("src/index.css", `
@import "tailwindcss";
@import "./lightswind.css";
@plugin "lightswind/plugin";

@custom-variant dark (&:where(.dark, .dark *));

/* shadcn-style tokens (HSL triplets live in lightswind.css) */
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-primarylw: var(--primarylw);
  --color-primarylw-2: var(--primarylw-2);
}

html { scroll-behavior: smooth; }
body { @apply bg-background text-foreground antialiased; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
`);

write("design.md", `# ${rawName}\n\nTheme: ${theme}\n\n## Brief\n\n(fill in)\n\n## Sections\n\n(fill in)\n`);

console.log(`\n✅ Ready: ${root}`);
console.log(`   Add components: node "${path.join(SKILL_DIR, "scripts", "add.mjs")}" "${root}" <name> [...]`);
console.log(`PROJECT_DIR=${root}`);
