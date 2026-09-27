#!/usr/bin/env node
// Install one or more Lightswind components into a project, then print each
// component's exports and props so the agent can use them without guessing.
//
// Usage: node add.mjs <project-dir> <component> [<component> ...]
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const [projectArg, ...names] = process.argv.slice(2);
if (!projectArg || !names.length) { console.error("Usage: node add.mjs <project-dir> <component> [...]"); process.exit(1); }
const root = path.resolve(projectArg);
if (!fs.existsSync(path.join(root, "package.json"))) { console.error(`❌ No package.json in ${root}`); process.exit(1); }

const uiDir = path.join(root, "src", "components", "lightswind");
const failed = [];

const bad = names.filter(n => !/^[A-Za-z0-9-]+$/.test(n));
if (bad.length) { console.error(`❌ Invalid component name(s): ${bad.join(", ")}`); process.exit(1); }

for (const name of names) {
  // Names are validated above, so a single shell string is safe (and avoids Node's DEP0190 warning).
  const r = spawnSync(`npx lightswind add ${name} -y`, { cwd: root, encoding: "utf8", shell: true, stdio: ["ignore", "pipe", "pipe"] });
  const out = (r.stdout || "") + (r.stderr || "");
  const file = path.join(uiDir, `${name}.tsx`);
  if (r.status !== 0 || !fs.existsSync(file)) {
    const pro = /Pro|license|login first/i.test(out);
    failed.push(name);
    console.log(`❌ ${name}: ${pro ? "Pro-only component (no license). Pick a free one from references/components.md." : out.trim().split("\n").slice(-5).join("\n")}`);
    continue;
  }
  console.log(`✅ ${name}`);
}

// Summarize the API of everything now installed from this batch (including pulled-in sub-components).
for (const name of names.filter(n => !failed.includes(n))) {
  const code = fs.readFileSync(path.join(uiDir, `${name}.tsx`), "utf8");
  const exportsFound = [...new Set([
    ...[...code.matchAll(/export\s+(?:default\s+)?(?:function|const|class)\s+([A-Z]\w*)/g)].map(m => m[1]),
    ...[...code.matchAll(/export\s+default\s+([A-Z]\w*)\s*;?\s*$/gm)].map(m => m[1]),
    ...[...code.matchAll(/export\s*\{([^}]+)\}/g)].flatMap(m => m[1].split(",").map(x => x.trim().split(/\s+as\s+/).pop())),
  ])].filter(x => /^[A-Z]/.test(x));
  const isDefault = /export\s+default/.test(code);
  const props = [...code.matchAll(/(?:interface|type)\s+(\w*Props)\b[^{]*\{([\s\S]*?)\n\}/g)]
    .map(m => `  ${m[1]} {${m[2].replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/\s+/g, " ").trim()} }`);
  console.log(`\n── @/components/lightswind/${name}`);
  console.log(`  exports: ${exportsFound.join(", ") || "(none found)"}${isDefault ? "  [has default export]" : ""}`);
  console.log(props.length ? props.join("\n") : "  (no *Props type found; read the file)");
}

if (failed.length) { console.log(`\n⚠️  Failed: ${failed.join(", ")}`); process.exit(2); }
