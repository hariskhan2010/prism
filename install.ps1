# Registers Prism (the Lightswind frontend designer) as its own OpenClaw agent and adds the
# design MCP servers. Safe to re-run. Your existing agents and channel routing are left alone
# unless you pass -Bind.
#
#   .\install.ps1                      # register agent + design MCP servers
#   .\install.ps1 -Bind discord:*      # also route a channel's messages to Prism
#   .\install.ps1 -FigmaKey figd_...   # also add the Figma MCP (needs a personal access token)
#   .\install.ps1 -MagicKey <key>      # also add 21st.dev Magic (needs an API key from 21st.dev)
param(
  [string[]]$Bind = @(),
  [switch]$NoMcp,
  [string]$FigmaKey,
  [string]$MagicKey
)

# "Continue": openclaw prints plugin warnings on stderr, which Windows PowerShell 5.1 would
# otherwise turn into terminating errors. Real failures are caught via $LASTEXITCODE.
$ErrorActionPreference = "Continue"
$workspace = Join-Path $PSScriptRoot "workspace"
New-Item -ItemType Directory -Force (Join-Path $workspace "projects") | Out-Null

Write-Host "`n[1/3] Registering agent 'prism' -> $workspace"
$existing = (& openclaw agents list) -join "`n"
if ($existing -match "(?m)^- prism\b") {
  Write-Host "  already registered"
  foreach ($b in $Bind) { & openclaw agents bind --agent prism --bind $b }
} else {
  $agentArgs = @("agents", "add", "prism", "--workspace", $workspace, "--non-interactive")
  foreach ($b in $Bind) { $agentArgs += @("--bind", $b) }
  & openclaw @agentArgs
  if ($LASTEXITCODE -ne 0) { throw "openclaw agents add failed" }
}

# name -> npx args. Official / first-party servers only.
$servers = [ordered]@{
  # lightswind's package forgets to declare its MCP deps, so npx must install them alongside it
  "lightswind"      = @("-y", "-p", "lightswind", "-p", "@modelcontextprotocol/sdk", "-p", "fuse.js", "-p", "tailwindcss@3", "lightswind", "mcp")
  "shadcn"          = @("-y", "shadcn@4.21.0", "mcp")              # shadcn/ui registry (browse + install)
  "magicui"         = @("-y", "@magicuidesign/mcp@latest")         # Magic UI animated components
  "playwright"      = @("-y", "@playwright/mcp@latest")            # drive a real browser: click, inspect, screenshot
  "chrome-devtools" = @("-y", "chrome-devtools-mcp@latest")        # performance traces, console, network, a11y tree
  "context7"        = @("-y", "@upstash/context7-mcp@latest")      # up-to-date docs (Tailwind v4, React 19, GSAP...)
}
if ($FigmaKey) { $servers["figma"] = @("-y", "figma-developer-mcp", "--stdio", "--figma-api-key=$FigmaKey") }
if ($MagicKey) { $servers["21st-magic"] = @("-y", "@21st-dev/magic@latest", "API_KEY=$MagicKey") }

if (-not $NoMcp) {
  Write-Host "`n[2/3] Adding design MCP servers"
  $status = (& openclaw mcp status 2>$null) -join "`n"
  foreach ($name in $servers.Keys) {
    if ($status -match "\b$([regex]::Escape($name))\b") { Write-Host "  = $name (already added)"; continue }
    # Windows: npx is npx.cmd, which OpenClaw can't spawn directly (ENOENT), so go through cmd /c.
    # npx cold starts can exceed OpenClaw's 30s default connect timeout.
    $mcpArgs = @("mcp", "add", $name, "--connect-timeout", "90", "--cwd", (Join-Path $workspace "projects"),
                 "--command", "cmd", "--arg", "/c", "--arg", "npx")
    foreach ($a in $servers[$name]) { $mcpArgs += @("--arg", $a) }
    $out = (& openclaw @mcpArgs 2>&1 | Where-Object { "$_" -notmatch "plugins.allow" }) -join "`n"
    if ($LASTEXITCODE -eq 0) { Write-Host "  + $name" } else { Write-Warning "  could not add ${name}: $($out.Trim().Split("`n")[-1])" }
  }
} else { Write-Host "`n[2/3] Skipping MCP servers" }

Write-Host "`n[3/3] Checking"
& openclaw agents list --bindings
& openclaw mcp status

Write-Host @"

Done. Talk to Prism:
  cd "$workspace"; openclaw tui                          (TUI auto-selects Prism inside its workspace)
  openclaw agent --agent prism --message "<your brief>"  (one-shot from any folder)
  openclaw agents bind --agent prism --bind discord:*    (route a chat channel to it later)

Try: "Design a landing page for a luxury gemstone store. Dark, premium, emerald accents."
"@
