# Lightswind free component catalog

Generated from the live registry (`https://lightswind.com/r/<name>.json`): 167 free components.

- Install: `node scripts/add.mjs <project-dir> <name> [<name> ...]`
- Import: `import { Export } from "@/components/lightswind/<name>"` (use `import X from` when the file only has a default export)
- `⚡` = WebGL / Three.js heavy. Max ONE per page, never inside a repeated list, never behind body text that must stay readable.
- **Before using any component, open the installed `.tsx` and read its props.** Do not guess prop names.
- Anything not listed here is Pro-only and fails without a license key. Do not use it.

## Backgrounds (hero / page backdrops)

| name | exports |
|---|---|
| `animated-bubble-particles` | AnimatedBubbleParticles |
| `animated-wave` ⚡ | AnimatedWave |
| `aurora-background` | AuroraBackground |
| `aurora-shader` | AuroraShader |
| `beam-grid-background` | BeamGridBackground |
| `cosmic-dust` | CosmicDust |
| `dot-grid-background` | DotGridBackground |
| `fall-beam-background` | FallBeamBackground |
| `gradient-background` ⚡ | GradientBackground |
| `grid-dot-backgrounds` | GridBackground, DotBackground |
| `hell-background` ⚡ | HellBackground |
| `holographic-wave` | HolographicWave |
| `interactive-grid-background` | InteractiveGridBackground |
| `liquid-surface` ⚡ | LiquidSurface |
| `nebula-flow` ⚡ | NebulaFlow |
| `particles-background` | ParticlesBackground |
| `quantum-field` ⚡ | QuantumField |
| `rays-background` | RaysBackground |
| `reflect-background` ⚡ | ReflectBackground |
| `satin-flow` ⚡ | SatinFlow |
| `shader-background` ⚡ | ShaderBackground |
| `smokey-background` ⚡ | SmokeyBackground |
| `sparkle-particles` | SparkleParticles |
| `stripes-background` | StripesBackground |
| `vector-flow` | VectorFlow |
| `wave-background` ⚡ | WaveBackground |

## 3D showpieces

| name | exports |
|---|---|
| `3d-carousel` | ThreeDCarousel |
| `3d-hover-gallery` | ThreeDHoverGallery |
| `3d-image-carousel` | ThreeDImageCarousel |
| `3d-image-ring` | ThreeDImageRing |
| `3d-image-slider` | ImageSlider3D |
| `3d-marquee` | ThreeDMarquee |
| `3d-model-viewer` ⚡ | ModelViewer |
| `3d-perspective-card` | ThreeDPerspectiveCard |
| `3d-scroll-trigger` | ThreeDScrollTriggerContainer, ThreeDScrollTriggerRow |
| `3d-slider` | ThreeDSlider |
| `angled-slider` | AngledSlider |
| `ascii-wave` | AsciiWave |
| `beam-circle` | BeamCircle |
| `chain-carousel` | ChainCarousel |
| `HangingIdCard` | HangingIdCard |
| `infinite-drift` | InfiniteDrift |
| `interactive-card-gallery` | InteractiveCardGallery |
| `plasma-globe` | PlasmaGlobe |
| `scroll-carousel` | ScrollCarousel |
| `sparkle-navbar` | SparkleNavbar |
| `stylish-carousel` | StylishCarousel |

## Text effects

| name | exports |
|---|---|
| `aurora-text-effect` | AuroraTextEffect |
| `looping-words` | LoopingWords |
| `rolling-text-3d` | RollingText3D |
| `scroll-reveal` | ScrollReveal |
| `shiny-text` | ShinyText |
| `text-scroll-marquee` | TextScrollMarquee |
| `typing-text` | TypingText |
| `video-text` | VideoText |

## Feature components (cards, carousels, galleries, marquees, etc.)

| name | exports |
|---|---|
| `animated-copy-button` | AnimatedCopyButton |
| `animated-notification` | AnimatedNotification |
| `CinematicScroll` | CinematicScroll |
| `code-hover-cards` | CodeHoverCards |
| `count-up` | CountUp |
| `Dock` | Dock |
| `drag-order-list` | DragOrderList |
| `draggable-reorder-list` | DraggableReorderList |
| `electro-border` | ElectroBorder |
| `expandable-search-bar` | ExpandableSearchBar |
| `expandable-speed-dial` | ExpandableSpeedDial |
| `glass-folder` | GlassFolder |
| `globe` | Globe |
| `glowing-cards` | GlowingCard, GlowingCards |
| `hamburger-menu-overlay` | HamburgerMenuOverlay |
| `image-reveal` | ImageReveal |
| `image-trail-effect` | ImageTrailEffect |
| `interactive-card` | InteractiveCard |
| `interactive-gradient-card` | InteractiveGradient |
| `iphone16-pro` | Iphone16Pro |
| `lens` | Lens |
| `magic-card` | MagicCard |
| `magic-loader` | MagicLoader |
| `marquee-menu` | MarqueeMenu |
| `morphing-navigation` | MorphingNavigation |
| `orbit-card` | OrbitCard |
| `ripple-loader` | RippleLoader |
| `scroll-cards` | ScrollCards |
| `scroll-list` | ScrollList |
| `scroll-timeline` | ScrollTimeline |
| `seasonal-hover-cards` | SeasonalHoverCards |
| `slide-to-confirm` | SlideToConfirm |
| `sliding-cards` | SlidingCards |
| `sliding-logo-marquee` | SlidingLogoMarquee |
| `SpectrumLoader` | SpectrumLoader |
| `stack-list` | StackList |
| `team-carousel` | TeamCarousel |
| `terminal-card` | TerminalCard |
| `top-loader` | TopLoader |
| `top-sticky-bar` | TopStickyBar |
| `trusted-users` | TrustedUsers |
| `woofy-hover-image` | WoofyHoverImage |

## Layout & scroll sections

| name | exports |
|---|---|
| `accordion` | Accordion, AccordionItem, AccordionTrigger, AccordionContent |
| `aspect-ratio` | AspectRatio |
| `resizable` | ResizablePanelGroup, ResizablePanel, ResizableHandle |
| `scroll-area` | ScrollArea, ScrollBar |
| `separator` | Separator |
| `tabs` | Tabs, TabsList, TabsTrigger, TabsContent |

## Navigation

| name | exports |
|---|---|
| `breadcrumb` | Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink |
| `navigation-menu` | NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent |
| `pagination` | Pagination, PaginationContent, PaginationEllipsis, PaginationItem |
| `sidebar` | SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader |

## Buttons

| name | exports |
|---|---|
| `border-beam` | BorderBeam |
| `confetti-button` | ConfettiButton |
| `fluid-button` | FluidButton |
| `glitch-button` | GlitchButton |
| `gradient-button` | GradientButton |
| `holo-button` | HoloButton |
| `magnetic-button` | MagneticButton |
| `ripple-button` | RippleButton |
| `shine-button` | ShineButton |
| `stardust-button` | StardustButton |
| `trial-button` | TrialButton |

## Core UI primitives (shadcn-style)

| name | exports |
|---|---|
| `ai-prompt` | AiInput |
| `alert` | Alert, AlertTitle, AlertDescription |
| `alert-dialog` | AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger |
| `avatar` | Avatar, AvatarImage, AvatarFallback |
| `badge` | Badge |
| `button` | Button |
| `card` | Card, CardHeader, CardFooter, CardTitle |
| `carousel` | Carousel, CarouselContent, CarouselItem, CarouselPrevious |
| `chart` | ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend |
| `collapsible` | Collapsible, CollapsibleTrigger, CollapsibleContent |
| `context-menu` | ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem |
| `dialog` | Dialog, DialogTrigger, DialogContent, DialogHeader |
| `dot-pattern` | DotPattern |
| `drawer` | Drawer, DrawerTrigger, DrawerContent, DrawerClose |
| `dropdown-menu` | DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel |
| `hover-card` | HoverCard, HoverCardTrigger, HoverCardContent |
| `liquid-fluid` | LiquidFluid |
| `menubar` | Menubar, MenubarMenu, MenubarTrigger, MenubarContent |
| `popover` | Popover, PopoverTrigger, PopoverContent |
| `progress` | Progress |
| `sheet` | Sheet, SheetClose, SheetContent, SheetDescription |
| `skeleton` | Skeleton, TemplateCardSkeleton |
| `stepper` | Stepper |
| `table` | Table, TableHeader, TableBody, TableFooter |
| `toast` | ToastProvider, ToastViewport, Toast, ToastTitle |
| `toaster` | Toaster |
| `tooltip` | Tooltips, TooltipContent, TooltipProvider, Tooltip |

## Form controls

| name | exports |
|---|---|
| `calendar` | Calendar |
| `checkbox` | Checkbox |
| `command` | Command, CommandDialog, CommandInput, CommandList |
| `form` | Form, FormItem, FormLabel, FormControl |
| `input` | Input |
| `input-otp` | InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator |
| `label` | Label |
| `radio-group` | RadioGroup, RadioGroupItem |
| `range-slider` | RangeSlider |
| `select` | Select, SelectGroup, SelectValue, SelectTrigger |
| `slider` | Slider |
| `switch` | Switch |
| `textarea` | Textarea |
| `toggle` | Toggle |
| `toggle-group` | ToggleGroup, ToggleGroupItem |

## Cursor effects

| name | exports |
|---|---|
| `canvas-confetti-cursor` | CanvasConfettiCursor |
| `particle-orbit-effect` | ParticleOrbitEffect |
| `smokey-cursor` ⚡ | SmokeyCursor |
| `smooth-cursor` | SmoothCursor |
| `SparkleCursor` | SparkleCursor |

## Utility

| name | exports |
|---|---|
| `cool-theme-toggle` | CoolThemeToggle |
| `toggle-theme` | ToggleTheme |
