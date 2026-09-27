#!/usr/bin/env node
// Build a project, serve the production bundle, and capture screenshots through headless
// Chrome/Edge (DevTools protocol) so viewports, mobile emulation and full-page shots are real.
// The agent looks at these to critique its own design and sends them back to the user.
//
// Usage: node shot.mjs <project-dir> [--no-build] [--wait <ms>]
// Output: <project-dir>/shots/{desktop,desktop-full,mobile,mobile-full}.png + a QA report on stdout
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawnSync, spawn } from "node:child_process";

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const waitMs = Number(opt("--wait") ?? 2500);
const noBuild = args.includes("--no-build");
const root = path.resolve(args.find(a => !a.startsWith("--")) || ".");
const dist = path.join(root, "dist");
const shots = path.join(root, "shots");

if (!noBuild) {
  console.log("🔨 npm run build");
  const b = spawnSync("npm run build", { cwd: root, encoding: "utf8", shell: true });
  if (b.status !== 0) {
    const out = (b.stdout || "") + (b.stderr || "");
    console.log(out.split("\n").filter(l => /error/i.test(l)).slice(0, 40).join("\n") || out);
    console.log("\n❌ Build failed. Fix the errors above, then re-run.");
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(dist, "index.html"))) { console.error("❌ No dist/index.html; build first."); process.exit(1); }

const browserPath = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].find(p => p && fs.existsSync(p));
if (!browserPath) { console.error("❌ No Chrome/Edge found. Set CHROME_PATH."); process.exit(1); }

// ── static server for dist/ ────────────────────────────────────────────────
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".json": "application/json",
  ".glb": "model/gltf-binary", ".mp4": "video/mp4" };
const server = http.createServer((req, res) => {
  let p = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(dist) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dist, "index.html");
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}/`;

// ── browser + DevTools protocol ────────────────────────────────────────────
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "lw-shot-"));
const chrome = spawn(browserPath, [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars",
  "--no-first-run", "--no-default-browser-check", "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
const wsUrl = await new Promise((resolve, reject) => {
  let buf = "";
  const t = setTimeout(() => reject(new Error("browser did not start")), 20000);
  chrome.stderr.on("data", d => {
    buf += d;
    const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) { clearTimeout(t); resolve(m[1]); }
  });
});

const ws = new WebSocket(wsUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let nextId = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener("message", e => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  } else if (msg.method) listeners.forEach(fn => fn(msg));
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const cmd = (m, p) => send(m, p, sessionId);
const errors = new Set();
listeners.push(msg => {
  if (msg.sessionId !== sessionId) return;
  if (msg.method === "Runtime.exceptionThrown") errors.add(msg.params.exceptionDetails.exception?.description?.split("\n")[0] || msg.params.exceptionDetails.text);
  if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") errors.add(msg.params.args.map(a => a.value ?? a.description ?? "").join(" ").slice(0, 200));
});
await cmd("Page.enable");
await cmd("Runtime.enable");
// A tab opened via Target.createTarget counts as a background tab: Chrome throttles its rendering,
// so requestAnimationFrame and IntersectionObserver (scroll reveals) stall. Make it the focused tab.
await cmd("Page.bringToFront");
await cmd("Emulation.setFocusEmulationEnabled", { enabled: true });

const evaluate = async expr => {
  const res = await cmd("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (res.exceptionDetails) throw new Error(`page evaluate failed: ${res.exceptionDetails.exception?.description ?? res.exceptionDetails.text}`);
  return res.result.value;
};
const save = async (name, params) => {
  const { data } = await cmd("Page.captureScreenshot", { format: "png", ...params });
  const out = path.join(shots, `${name}.png`);
  fs.writeFileSync(out, Buffer.from(data, "base64"));
  console.log(`📸 ${out}`);
};

fs.mkdirSync(shots, { recursive: true });
const report = [];

for (const vp of [
  { name: "desktop", width: 1440, height: 900, mobile: false, scale: 1 },
  { name: "mobile", width: 390, height: 844, mobile: true, scale: 2 },
]) {
  await cmd("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: vp.scale, mobile: vp.mobile });
  await cmd("Emulation.setTouchEmulationEnabled", { enabled: vp.mobile });
  const loaded = new Promise(r => listeners.push(m => m.method === "Page.loadEventFired" && m.sessionId === sessionId && r()));
  await cmd("Page.navigate", { url });
  await Promise.race([loaded, sleep(15000)]);
  await sleep(waitMs);
  await save(vp.name, {});

  // Scroll through the page so scroll-triggered reveals fire, then return to top for the full shot.
  const height = await evaluate(`(async () => {
    const h = () => document.documentElement.scrollHeight;
    // behavior "instant": pages with scroll-behavior: smooth would otherwise still be mid-scroll when we capture.
    const go = y => scrollTo({ top: y, behavior: "instant" });
    const wait = ms => new Promise(r => setTimeout(r, ms));
    // Let reveals triggered at this position finish (WebGL heroes can starve the main thread in
    // headless mode). Infinite loops (spinners, marquees) are ignored; each step is capped at 2.5s.
    const settle = () => Promise.race([
      Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))),
      wait(2500),
    ]);
    for (let y = 0; y < h(); y += innerHeight * 0.7) { go(y); await wait(250); await settle(); }
    go(h()); await new Promise(r => setTimeout(r, 500));
    go(0); await new Promise(r => setTimeout(r, 400));
    return h();
  })()`);
  const overflow = await evaluate(`(() => {
    const vw = document.documentElement.clientWidth, wide = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1 && getComputedStyle(el).position !== "fixed") wide.push((el.className?.baseVal ?? el.className ?? el.tagName).toString().slice(0, 60) || el.tagName);
      if (wide.length > 4) break;
    }
    // After a full scroll pass every reveal animation should have fired. Big blocks still at ~0
    // opacity mean a whileInView / IntersectionObserver reveal that never triggered.
    const hidden = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      // data-scroll-linked marks elements whose opacity is tied to scroll position (e.g. a sticky
      // storytelling headline): transparent at the top of the page by design, not a failed reveal.
      if (r.width < 120 || r.height < 80 || el.closest("[aria-hidden=true],[data-scroll-linked]")) continue;
      if (parseFloat(getComputedStyle(el).opacity) < 0.05 && !(el.parentElement && parseFloat(getComputedStyle(el.parentElement).opacity) < 0.05))
        hidden.push(el.tagName.toLowerCase() + ' "' + (el.textContent || "").trim().slice(0, 28) + '" @y=' + Math.round(r.top + scrollY));
      if (hidden.length > 5) break;
    }
    return { scrollWidth: document.documentElement.scrollWidth, vw, wide, hidden };
  })()`);
  const fullHeight = Math.min(height, 24000);
  // Full shots render at 1x (clip scale 1/DPR): at 2x a tall page exceeds the renderer's max
  // texture size (~8192px in software mode) and the image wraps around and repeats.
  // Chrome also tiles content when captureBeyondViewport runs under mobile emulation.
  // Same width without the mobile flag lays out identically for width=device-width pages.
  if (vp.mobile) {
    await cmd("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: vp.scale, mobile: false });
    await sleep(400);
  }
  // Capture in 7000px slices: one image taller than the renderer's max texture (~8192px) wraps around.
  const SLICE = 7000;
  for (let y = 0, part = 1; y < fullHeight; y += SLICE, part++) {
    const name = part === 1 ? `${vp.name}-full` : `${vp.name}-full-${part}`;
    await save(name, { captureBeyondViewport: true, clip: { x: 0, y, width: vp.width, height: Math.min(SLICE, fullHeight - y), scale: 1 / vp.scale } });
  }
  report.push(`${vp.name}: page ${height}px tall${height > 24000 ? " (full shots stop at 24000px)" : ""}${height > 7000 ? ` (full page split into ${Math.ceil(Math.min(height, 24000) / 7000)} slices)` : ""}` +
    (overflow.scrollWidth > overflow.vw ? `; ⚠️ HORIZONTAL OVERFLOW ${overflow.scrollWidth - overflow.vw}px (elements: ${overflow.wide.join(" | ")})` : "; no horizontal overflow") +
    (overflow.hidden.length ? `\n  ⚠️ INVISIBLE after scrolling (reveal never fired?): ${overflow.hidden.join(" | ")}` : ""));
}

ws.close();
chrome.kill();
server.close();
// Chrome can hold the profile for a moment after kill(); retry, and never fail the run over temp cleanup.
setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch {} }, 500);

console.log(`\n── QA report\n${report.join("\n")}`);
console.log(errors.size ? `⚠️ JS errors:\n  ${[...errors].slice(0, 10).join("\n  ")}` : "No JS errors.");
console.log(`\nShots in ${shots}. LOOK at them before replying: contrast, overflow, empty areas, broken effects.`);
