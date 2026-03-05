# Ishi no Niwa (石の庭) - Stone Garden App Specification

> **Working Title**: Ishi no Niwa (石の庭) - "Stone Garden"
> **Tagline**: Arrange sacred stones. Discover your pattern. Find your balance.
> **Repository**: github.com/eurpeb2012 (new repo TBD)
> **Platform**: Mobile-first (iOS/Android via PWA or React Native)
> **Business Model**: Freemium subscription

---

## 1. Product Vision

A mobile app where users select Japanese healing gemstones and arrange them into geometric crystal grid patterns on a touch canvas. Combines the Japanese power stone (パワーストーン) tradition with guided learning, pattern discovery, and gamified progression. Users start as beginners learning basic grids and advance through skill tiers, unlocking rare stones, complex sacred geometries, and deeper spiritual knowledge.

---

## 2. Target Audience

- Wellness/mindfulness practitioners interested in crystal healing
- People drawn to Japanese spiritual culture (Shinto, Buddhism, Zen aesthetics)
- Existing power stone bracelet/crystal collectors wanting a digital companion
- Casual mobile users who enjoy meditative, low-stress creative apps
- Age range: 25-55, skewing female, global audience with EN/JP bilingual support

---

## 3. Subscription Tiers

### 3.1 Free Tier (Mukyu / 無級 - "No Rank")

| Feature | Limit |
|---------|-------|
| Stone library | 5 Tier 1 stones (Rose Quartz, Amethyst, Clear Quartz, Tiger's Eye, Black Tourmaline) |
| Grid templates | 3 basic templates (Triangle, Square, Circle) |
| Saved grids | Up to 3 |
| Daily intention | 1 per day |
| Stone info cards | Basic (name, color, 1-line description) |
| Progression | Level 1-3 only |

### 3.2 Tsuki (月) - Monthly ($4.99/mo)

| Feature | Limit |
|---------|-------|
| Stone library | All 24 stones (Tier 1-3) |
| Grid templates | 12+ templates including sacred geometry |
| Saved grids | Up to 25 |
| Daily intention | Unlimited |
| Stone info cards | Full (history, chakra, JP name, healing properties) |
| Progression | All levels, all skill trees |
| Guided sessions | Access to guided meditation grid sessions |
| AI Grid Advisor | Basic suggestions for stone combinations |
| Magatama shapes | Unlockable stone shape variants |
| Monthly stone | 1 exclusive seasonal stone each month |

### 3.3 Hoshi (星) - Annual ($39.99/yr — save 33%)

Everything in Tsuki, plus:

| Feature | Detail |
|---------|--------|
| Ad-free experience | No gem seller ads anywhere in the app |
| Nihon Meiseki collection | All 12 regional Japanese birthstones |
| Premium grid templates | Advanced sacred geometry (Flower of Life, Metatron's Cube, Seed of Life) |
| Saved grids | Unlimited |
| AI Grid Advisor | Advanced - intention-aware recommendations with chakra balancing |
| Community gallery | Share grids, browse/favorite others' arrangements |
| Export | High-res image export of grids (for printing/wallpaper) |
| Seasonal themes | Cherry blossom, autumn leaves, snow, summer festival canvas skins |
| Offline mode | Full functionality without connection |
| Early access | New stones and templates before free/monthly users |

---

## 4. Core Features

### 4.1 Authentication & Onboarding

**Sign-up flow:**
1. Welcome screen with animated stone garden
2. Sign up via Email/Password, Google, or Apple ID
3. Onboarding quiz (3-4 questions):
   - "What draws you to healing stones?" (multiple choice)
   - "What intention matters most to you right now?" (maps to intention categories)
   - "Choose a stone that speaks to you" (visual picker from Tier 1)
   - Birth month (maps to Nihon Meiseki birthstone)
4. Personalized starter kit generated: 1 birthstone + 2 intention-matched stones
5. Tutorial: first guided grid placement

**Account management:**
- Profile with avatar (stone-themed)
- Subscription management (upgrade/downgrade/cancel)
- Language toggle: EN / JP
- Notification preferences
- Data export / account deletion (GDPR/privacy compliance)

### 4.2 Stone Library (石のコレクション)

**Stone Collection screen:**
- Visual grid of all stones (locked stones shown as greyed silhouettes for free tier)
- Filter by: intention, chakra, color, origin (Japan-native toggle), rarity
- Sort by: name, tier, recently used, chakra order
- Each stone card shows:
  - High-quality rendered gemstone image (3D-ish, with subtle shimmer animation)
  - Name (EN + JP)
  - Color dot + chakra badge(s)
  - Rarity indicator (common/uncommon/rare sparkle effect)
  - Lock icon if not yet unlocked via progression

**Stone Detail view:**
- Full-screen stone with slow rotation animation
- Properties panel: healing properties, chakra(s), intentions, origin
- "Lore" tab: cultural history, Shinto/Buddhist context
- "Combine" suggestions: which stones pair well and why
- "Use in Grid" quick action button

### 4.3 Grid Canvas (石の庭 - Stone Garden)

The core interaction surface. A touch-based canvas where users arrange gemstones into geometric patterns.

**Canvas mechanics:**
- Blank circular canvas area (zen garden aesthetic, subtle sand texture background)
- Stone tray at bottom: horizontal scrollable row of user's available stones
- **Drag & drop**: Touch-hold stone from tray, drag onto canvas, release to place
- **Move**: Touch-hold placed stone, drag to reposition
- **Remove**: Drag stone off canvas edge, or long-press > "Remove"
- **Rotate**: Two-finger twist on individual stone to rotate
- **Zoom**: Pinch to zoom canvas in/out
- **Snap-to-grid**: Optional toggle - stones snap to geometric guide points
- **Symmetry assist**: Optional toggle - mirrors stone placement across axis (2-fold, 3-fold, 6-fold)

**Grid templates (テンプレート):**
Templates provide geometric guide overlays on the canvas. Users place stones on the guide points.

| Template | Geometry | Points | Unlock Level | Tier |
|----------|----------|--------|-------------|------|
| Sankaku (三角) | Triangle | 3-6 | 1 | Free |
| Shikaku (四角) | Square | 4-8 | 1 | Free |
| Enso (円相) | Circle | 6-12 | 2 | Free |
| Asanoha (麻の葉) | Hemp leaf star | 7 | 4 | Tsuki |
| Kikkou (亀甲) | Hexagonal/turtle shell | 7-19 | 5 | Tsuki |
| Seigaiha (青海波) | Wave pattern | 9 | 6 | Tsuki |
| Tomoe (巴) | Triple comma spiral | 9 | 7 | Tsuki |
| Magatama Ring (勾玉陣) | Comma bead circle | 6-9 | 8 | Tsuki |
| Flower of Life | Sacred geometry | 13-19 | 10 | Hoshi |
| Seed of Life | Sacred geometry | 7 | 12 | Hoshi |
| Metatron's Cube | Sacred geometry | 13 | 15 | Hoshi |
| Sri Yantra | Sacred geometry | 9+ | 18 | Hoshi |
| Freeform (自由) | No guides | Unlimited | 1 | Free |

**Canvas features:**
- "Energize" animation: tap a completed grid to see energy lines pulse between stones
- Intention summary: when grid is complete, show combined intention reading based on stones used
- Save grid with custom name
- Share grid as image
- Ambient sound: optional soft background (singing bowls, nature, silence)

### 4.4 Pattern Help & AI Advisor (石の導き - Stone Guide)

Users can get help choosing stones and arranging them.

**Intention-based recommendations:**
1. User selects an intention (e.g., "Stress Relief / 癒し")
2. System recommends:
   - Best stones for that intention (from KB intention mappings)
   - Suggested template that complements the intention
   - Center stone recommendation (strongest match)
   - Supporting stones for remaining positions
3. User can accept recommendation or customize

**Grid Advisor (AI-assisted):**
- "Help me build a grid" conversational flow:
  - "How are you feeling today?"
  - "What would you like to focus on?"
  - Maps responses to intention categories
  - Generates a complete grid suggestion with placement
  - User can tap "Place for me" or manually adjust
- Chakra balance checker: analyzes current grid and suggests additions to balance underrepresented chakras
- Combination warnings: flags stones that traditionally conflict

**Learning cards:**
- Pop-up micro-lessons during grid building:
  - "Did you know? Clear Quartz amplifies the energy of surrounding stones..."
  - "In Shinto tradition, this arrangement mirrors the Three Imperial Regalia..."
  - Triggered contextually based on which stones/patterns are used

### 4.5 Gamification & Progression (修行の道 - Path of Training)

Themed as a spiritual journey through Japanese stone mastery.

**Experience Points (経験値 / Keiken-chi):**

| Action | XP Earned |
|--------|-----------|
| Complete a grid (all positions filled) | 20 XP |
| Complete a guided session | 30 XP |
| Use a new stone for the first time | 15 XP |
| Complete daily intention | 10 XP |
| Try a new template | 25 XP |
| Share a grid | 10 XP |
| 7-day streak | 50 XP bonus |
| 30-day streak | 200 XP bonus |
| Read a stone lore card fully | 5 XP |
| Complete a skill challenge | 50 XP |

**Level System (段位 / Dan-i):**

Modeled after Japanese martial arts ranking.

| Level | Title (JP) | Title (EN) | XP Required | Unlocks |
|-------|-----------|------------|-------------|---------|
| 1 | 入門 (Nyumon) | Initiate | 0 | Tutorial, 3 basic templates, 5 Tier 1 stones |
| 2 | 十級 (Jukkyu) | 10th Kyu | 100 | Enso template, stone info cards |
| 3 | 九級 (Kyukyu) | 9th Kyu | 250 | Freeform canvas, symmetry assist |
| 4 | 八級 (Hachikyu) | 8th Kyu | 450 | Asanoha template (sub req) |
| 5 | 七級 (Nanakyu) | 7th Kyu | 700 | Kikkou template, Tier 2 stones (sub req) |
| 6 | 六級 (Rokkyu) | 6th Kyu | 1000 | Seigaiha template |
| 7 | 五級 (Gokyu) | 5th Kyu | 1400 | Tomoe template, energize animation |
| 8 | 四級 (Yonkyu) | 4th Kyu | 1900 | Magatama Ring template |
| 9 | 三級 (Sankyu) | 3rd Kyu | 2500 | Magatama stone shapes |
| 10 | 二級 (Nikyu) | 2nd Kyu | 3200 | Flower of Life template (sub req) |
| 11 | 一級 (Ikkyu) | 1st Kyu | 4000 | Tier 3 stones, advanced advisor |
| 12 | 初段 (Shodan) | 1st Dan | 5000 | Seed of Life, community gallery |
| 15 | 二段 (Nidan) | 2nd Dan | 8000 | Metatron's Cube, all stones unlocked |
| 18 | 三段 (Sandan) | 3rd Dan | 12000 | Sri Yantra, master badge |
| 20 | 師範 (Shihan) | Master | 16000 | Create & publish custom templates |

**Skill Trees (技能 / Ginou):**

Three parallel skill tracks the user can invest points in:

```
Stone Wisdom (石の知恵)          Grid Mastery (陣の技)          Spiritual Path (精神の道)
├── Stone Novice                 ├── Pattern Learner             ├── Breath Beginner
├── Stone Scholar                ├── Geometry Adept              ├── Intention Setter
├── Lore Keeper                  ├── Symmetry Master             ├── Chakra Awareness
├── Combination Expert           ├── Sacred Geometry              ├── Meditation Guide
└── Stone Sage                   └── Grand Architect             └── Enlightened
```

Each node unlocks via completing specific challenges:

| Skill | Track | Challenge |
|-------|-------|-----------|
| Stone Novice | Wisdom | Read 5 stone lore cards |
| Stone Scholar | Wisdom | Use all 7 chakra stones in grids |
| Lore Keeper | Wisdom | Read all Japan-native stone lore |
| Combination Expert | Wisdom | Create 10 grids with advisor-recommended combos |
| Stone Sage | Wisdom | Use every stone in the library at least once |
| Pattern Learner | Grid | Complete 5 different templates |
| Geometry Adept | Grid | Complete all basic templates with snap-to-grid |
| Symmetry Master | Grid | Create 5 grids using symmetry assist |
| Sacred Geometry | Grid | Complete Flower of Life, Seed of Life, Metatron's Cube |
| Grand Architect | Grid | Publish 3 custom templates used by 10+ others |
| Breath Beginner | Spiritual | Complete 3 guided sessions |
| Intention Setter | Spiritual | Set daily intention for 7 consecutive days |
| Chakra Awareness | Spiritual | Build one grid for each of the 7 chakras |
| Meditation Guide | Spiritual | Complete 30 guided sessions |
| Enlightened | Spiritual | Achieve all other spiritual skills + 30-day streak |

**Achievements (称号 / Sho-go):**

Collectible badges displayed on profile.

| Achievement | Condition | Icon Theme |
|------------|-----------|------------|
| First Stone | Place your first stone on a grid | Single magatama |
| Dragon's Heart | Use Clear Quartz as center stone 10 times | Crystal dragon |
| Three Regalia | Use stones matching all 3 Imperial Regalia (jade + quartz + obsidian) | Imperial crest |
| Jomon Artisan | Create 50 grids | Ancient pottery |
| Itoigawa Pilgrim | Use all Japan-native stones in a single grid | Map of Niigata |
| Full Spectrum | Build a grid using all 7 chakra colors | Rainbow circle |
| Night Owl | Complete a guided session after 10 PM | Moon + amethyst |
| Early Bird | Set daily intention before 7 AM | Sunrise + citrine |
| Streak Master | Maintain a 30-day streak | Flame |
| Community Star | Have a shared grid favorited 50 times | Star |
| Stone Collector | Unlock all stones | Treasure chest |
| Sacred Geometer | Complete all sacred geometry templates | Flower of Life |
| 師範 (Shihan) | Reach Master level | Golden magatama |

**Daily / Weekly engagement:**
- **Daily Intention (日々の意図)**: Each morning, app suggests a stone + intention for the day based on day of week / season / user history. User taps to accept. Completing = 10 XP.
- **Weekly Challenge (週間チャレンジ)**: e.g., "Build a grid using only blue stones" or "Create a grid for someone you love." Completing = 75 XP + bonus item.
- **Seasonal Events**: Tied to Japanese seasons (spring/cherry blossom, summer/tanabata, autumn/momiji, winter/setsubun). Limited-edition stones and templates.

### 4.6 Guided Sessions (導きの瞑想 - Guided Meditation)

Structured grid-building experiences with narration and ambient audio.

**Session structure:**
1. Intention setting (user picks or app suggests)
2. Stone selection guidance (narrator explains why each stone was chosen)
3. Step-by-step placement with pauses for breathing
4. "Energize" moment - grid comes alive with animation
5. Closing reflection + journal prompt
6. Duration: 5-15 minutes

**Session library (examples):**
- "Morning Clarity" - Clear Quartz center, energizing stones, triangle grid
- "Evening Calm" - Amethyst center, calming stones, circle grid
- "Heart Opening" - Rose Quartz center, love stones, Flower of Life
- "Protection Shield" - Black Tourmaline center, protective stones, hexagonal grid
- "Career Focus" - Tiger's Eye center, career stones, square grid
- "Ancestral Connection" - Jade magatama center, Japan-native stones, Tomoe spiral
- "Chakra Balance" - 7 stones, 7 chakras, full spectrum circle
- "Seasonal: Spring Renewal" - Seasonal event special

### 4.7 Community Gallery (みんなの庭 - Everyone's Garden)

Subscriber feature for sharing and discovering grids.

- Browse shared grids by: intention, template, most popular, most recent
- Favorite / save others' grids
- "Recreate" button: loads same template + stones into your canvas
- User profiles: show level, achievements, shared grids
- Weekly featured grid (editor's pick)
- No comments (keeps it peaceful) - just favorites count

---

## 5. Technical Architecture

### 5.1 Recommended Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React Native (Expo) | Cross-platform mobile, touch gestures, good animation support |
| Canvas Engine | React Native Skia or react-native-gesture-handler + Reanimated | Performant 2D rendering, smooth drag/drop, pinch/zoom |
| State Management | Zustand | Lightweight, good for real-time canvas state |
| Auth | Supabase Auth or Firebase Auth | Social login + email, self-service, free tier friendly |
| Database | Supabase (PostgreSQL) or Firebase Firestore | User data, grids, progression, community gallery |
| Subscriptions | RevenueCat | Handles Apple/Google subscription management, receipt validation |
| AI Advisor | Claude API (Haiku 4.5) | Low-cost, fast responses for grid recommendations |
| Image Export | react-native-view-shot | Capture canvas as shareable image |
| i18n | i18next + react-i18next | EN/JP language support |
| Push Notifications | Expo Notifications | Daily intention reminders, streak alerts |
| Analytics | PostHog or Mixpanel | Engagement tracking, funnel analysis |
| Hosting | Expo EAS (builds) + Supabase (backend) | Managed infrastructure |

### 5.2 Data Models

```
User {
  id: uuid
  email: string
  display_name: string
  avatar_stone_id: string (FK -> Stone)
  language: 'en' | 'jp'
  birth_month: int (1-12)
  subscription_tier: 'free' | 'tsuki' | 'hoshi'
  subscription_expires: timestamp
  created_at: timestamp
}

UserProgress {
  user_id: uuid (FK -> User)
  xp_total: int
  level: int
  current_streak_days: int
  longest_streak_days: int
  stones_unlocked: string[] (stone IDs)
  templates_unlocked: string[] (template IDs)
  skills_completed: string[] (skill IDs)
  achievements: string[] (achievement IDs)
  grids_completed_count: int
  guided_sessions_count: int
  daily_intention_today: boolean
  last_active_date: date
}

Stone {
  id: string (snake_case)
  name_en: string
  name_jp: string
  reading: string
  color_primary: string
  color_hex: string
  origin_japan: boolean
  origin_region: string | null
  chakras: string[]
  intentions: string[]
  hardness: float
  rarity: 'common' | 'uncommon' | 'rare'
  tier: int (1-3)
  description_en: string
  description_jp: string
  lore_en: text
  lore_jp: text
  image_asset: string (path to rendered stone image)
  unlock_level: int
  is_seasonal: boolean
}

GridTemplate {
  id: string
  name_en: string
  name_jp: string
  geometry_type: string
  point_count_min: int
  point_count_max: int
  points: JSON (array of {x, y} normalized coordinates)
  symmetry_axes: int
  unlock_level: int
  required_tier: 'free' | 'tsuki' | 'hoshi'
  category: 'basic' | 'japanese' | 'sacred' | 'custom'
  preview_image: string
}

SavedGrid {
  id: uuid
  user_id: uuid (FK -> User)
  template_id: string (FK -> GridTemplate) | null
  name: string
  intention: string | null
  placements: JSON (array of {stone_id, x, y, rotation})
  is_shared: boolean
  favorite_count: int
  created_at: timestamp
  updated_at: timestamp
}

GuidedSession {
  id: string
  name_en: string
  name_jp: string
  intention: string
  duration_minutes: int
  template_id: string (FK -> GridTemplate)
  stone_sequence: JSON (ordered array of {stone_id, position_index, narration_key})
  audio_asset: string | null
  required_tier: 'tsuki' | 'hoshi'
  is_seasonal: boolean
}

DailyIntention {
  id: uuid
  user_id: uuid (FK -> User)
  date: date
  intention_category: string
  stone_id: string (FK -> Stone)
  completed: boolean
}
```

### 5.3 API Endpoints (REST or RPC)

```
Auth
  POST   /auth/signup              Email + password signup
  POST   /auth/login               Email login
  POST   /auth/oauth/{provider}    Google / Apple OAuth
  POST   /auth/forgot-password     Password reset email
  DELETE /auth/account             Account deletion

User
  GET    /user/profile             Get current user profile + progress
  PATCH  /user/profile             Update display name, avatar, language, birth month
  GET    /user/progress            Get XP, level, streaks, unlocks
  POST   /user/daily-intention     Set today's intention
  PATCH  /user/daily-intention     Mark intention complete

Stones
  GET    /stones                   List all stones (respects tier/unlock visibility)
  GET    /stones/:id               Get stone detail + lore

Templates
  GET    /templates                List all templates (respects tier/unlock visibility)
  GET    /templates/:id            Get template with point coordinates

Grids
  GET    /grids                    List user's saved grids
  POST   /grids                    Save a new grid
  PATCH  /grids/:id                Update grid (rename, update placements)
  DELETE /grids/:id                Delete a grid
  POST   /grids/:id/share          Toggle grid sharing to community
  POST   /grids/:id/export         Generate high-res image

Community
  GET    /community/grids          Browse shared grids (paginated, filterable)
  POST   /community/grids/:id/fav  Toggle favorite on a shared grid
  GET    /community/featured       Get this week's featured grid

Advisor
  POST   /advisor/recommend        Get stone + template recommendation for an intention
  POST   /advisor/analyze          Analyze a grid for chakra balance + suggestions

Sessions
  GET    /sessions                 List guided sessions
  GET    /sessions/:id             Get session detail + narration script
  POST   /sessions/:id/complete    Mark session as completed, award XP

Subscriptions
  POST   /subscriptions/verify     Verify App Store / Play Store receipt
  GET    /subscriptions/status     Get current subscription status
```

### 5.4 Project Structure

```
ishi-no-niwa/
├── app/                          # Expo Router screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── garden.tsx            # Main grid canvas
│   │   ├── stones.tsx            # Stone library
│   │   ├── journey.tsx           # Progression / skill trees
│   │   ├── sessions.tsx          # Guided sessions
│   │   └── profile.tsx           # Profile + settings
│   └── community/
│       ├── gallery.tsx
│       └── [gridId].tsx
├── components/
│   ├── canvas/
│   │   ├── GridCanvas.tsx        # Main touch canvas
│   │   ├── StonePiece.tsx        # Draggable stone component
│   │   ├── GridOverlay.tsx       # Template guide lines
│   │   ├── EnergizeAnimation.tsx # Energy pulse effects
│   │   └── StoneTray.tsx         # Bottom stone selector
│   ├── stones/
│   │   ├── StoneCard.tsx
│   │   ├── StoneDetail.tsx
│   │   └── StoneFilter.tsx
│   ├── progression/
│   │   ├── LevelBadge.tsx
│   │   ├── SkillTree.tsx
│   │   ├── AchievementCard.tsx
│   │   └── XPBar.tsx
│   ├── advisor/
│   │   ├── AdvisorChat.tsx
│   │   └── RecommendationCard.tsx
│   └── common/
│       ├── LanguageToggle.tsx
│       └── SubscriptionGate.tsx
├── data/
│   ├── stones.json               # Stone definitions from KB
│   ├── templates.json             # Grid template definitions
│   ├── sessions.json              # Guided session scripts
│   ├── skills.json                # Skill tree definitions
│   └── achievements.json          # Achievement definitions
├── hooks/
│   ├── useCanvas.ts               # Canvas state + gesture logic
│   ├── useProgression.ts          # XP, leveling, unlocks
│   └── useSubscription.ts         # RevenueCat integration
├── stores/
│   ├── authStore.ts
│   ├── canvasStore.ts
│   ├── progressionStore.ts
│   └── stoneStore.ts
├── services/
│   ├── api.ts                     # API client
│   ├── advisor.ts                 # AI advisor service
│   └── subscription.ts            # RevenueCat wrapper
├── i18n/
│   ├── en.json
│   └── jp.json
├── assets/
│   ├── stones/                    # Stone images (24+ PNGs)
│   ├── templates/                 # Template preview images
│   ├── audio/                     # Guided session ambient audio
│   └── animations/                # Lottie files for effects
├── supabase/
│   ├── migrations/                # Database migrations
│   └── functions/                 # Edge functions (advisor, export)
├── app.json                       # Expo config
├── package.json
└── tsconfig.json
```

---

## 6. UX / Screen Flow

### 6.1 Navigation

Bottom tab bar with 5 tabs:

```
┌──────────────────────────────────────┐
│                                      │
│           [Active Screen]            │
│                                      │
├──────┬──────┬──────┬──────┬──────────┤
│  庭  │  石  │  導  │  道  │    私    │
│Garden│Stones│Guide │Journey│ Profile  │
└──────┴──────┴──────┴──────┴──────────┘
```

### 6.2 Key Screen Wireframes

**Garden (Main Canvas):**
```
┌─────────────────────────┐
│ ≡  Stress Relief Grid ▼ │  <- grid name + template picker
│         ☆ Save          │
├─────────────────────────┤
│                         │
│     ·       ·           │
│       ·   ·             │  <- template guide dots
│     ·  [◆]  ·           │  <- placed stone (amethyst)
│       ·   ·             │
│     ·       ·           │
│                         │
├─────────────────────────┤
│ [Snap] [Sym:3] [Sound]  │  <- canvas tools
├─────────────────────────┤
│ ◆  ◇  ◈  ◉  ◆  ▸       │  <- stone tray (scroll)
└─────────────────────────┘
```

**Stone Detail:**
```
┌─────────────────────────┐
│  ←                      │
│                         │
│      [  Amethyst  ]     │  <- 3D rotating stone
│       アメジスト         │
│      ★★☆ Uncommon       │
│                         │
├─────────────────────────┤
│ Properties │ Lore │ Pair │  <- tabs
├─────────────────────────┤
│ Chakra: Third Eye, Crown│
│ Intent: Spiritual, Calm │
│ Origin: Niigata, Japan  │
│ Hardness: 7 Mohs        │
│                         │
│ Calms the mind, reduces │
│ stress, promotes restful│
│ sleep, dispels negative  │
│ energy.                  │
│                         │
│   [ Use in Grid ]       │
└─────────────────────────┘
```

**Journey (Progression):**
```
┌─────────────────────────┐
│  七級 · 7th Kyu          │
│  ████████░░ 700/1000 XP  │
│  🔥 12 day streak        │
├─────────────────────────┤
│ [Skill Trees]            │
│ Stone Wisdom ●●●○○       │
│ Grid Mastery ●●○○○       │
│ Spiritual    ●○○○○       │
├─────────────────────────┤
│ Recent Achievements      │
│ ┌────┐ ┌────┐ ┌────┐    │
│ │Full│ │Jmn │ │DrHt│    │
│ │Spec│ │Art │ │    │    │
│ └────┘ └────┘ └────┘    │
├─────────────────────────┤
│ Weekly Challenge         │
│ "Blue Harmony"           │
│ Build a grid with only   │
│ blue-toned stones        │
│ Progress: 0/1  [Start]   │
└─────────────────────────┘
```

---

## 7. Design Language

### 7.1 Visual Style

- **Aesthetic**: Japanese zen minimalism meets soft mysticism
- **Background**: Dark stone/slate textures with subtle grain
- **Canvas**: Warm sand-colored circle with faint ripple texture (zen garden)
- **Typography**: Clean sans-serif for UI; brush-stroke style for JP titles
- **Stone rendering**: Semi-realistic with subtle glow/shimmer; each stone's hex color drives a radial gradient
- **Animations**: Gentle, never jarring - floating particles, soft pulsing glow, slow rotation
- **Color palette**:

| Role | Color | Hex |
|------|-------|-----|
| Background | Charcoal slate | #1A1A2E |
| Surface | Deep indigo | #16213E |
| Canvas | Sand | #E8DCC8 |
| Primary accent | Soft gold | #C9A96E |
| Secondary accent | Jade green | #4A8C7F |
| Text primary | Warm white | #F0EBE3 |
| Text secondary | Muted lavender | #A0A0C0 |
| XP / Progress | Amber glow | #E4A010 |
| Error / Alert | Soft coral | #D4726A |

### 7.2 Sound Design

- Toggle-able ambient audio (default: off)
- Options: Singing bowl, forest stream, rain, wind chimes, silence
- Subtle haptic feedback on stone placement (short tap)
- Soft chime on grid completion
- Level-up sound: ascending bell tones

---

## 8. Monetization Details

### 8.1 Revenue Streams

| Stream | Model |
|--------|-------|
| Subscriptions | Primary revenue. Tsuki ($4.99/mo) and Hoshi ($39.99/yr) |
| Gem Seller Ads | Secondary revenue. Curated, native-style ads from verified gemstone retailers |
| Free tier | Acquisition funnel. Generous enough to hook, limited enough to convert |

### 8.2 Conversion Strategy

- Free users see locked stones with "Unlock with Tsuki" shimmer effect
- After completing Level 3, prompt: "You've mastered the basics. Continue your journey?"
- 7-day free trial for Tsuki on first subscription attempt
- Annual (Hoshi) shown as "Save 33%" with monthly price comparison
- Gem seller ads shown to Free and Tsuki users (see Section 8.3)
- Hoshi subscribers: fully ad-free experience

### 8.3 Gem Seller Advertising (石の市場 - Stone Marketplace)

Curated, native-style ads from verified gemstone sellers. Ads blend with the app's zen aesthetic - no flashing banners or pop-ups.

**Ad Placements:**

| Placement | Location | Format | Shown To |
|-----------|----------|--------|----------|
| Stone Detail Suggestion | Bottom of Stone Detail view | "Find real [stone name]" card with seller logo, price range, link | Free, Tsuki |
| Post-Grid Completion | After saving a completed grid | "Bring your grid to life" - cards for stones used in the grid | Free, Tsuki |
| Stone Library Footer | Below stone collection grid | Rotating featured seller banner (subtle, on-brand) | Free only |
| Guided Session End | After completing a guided session | Single "featured stone" card from seller | Free, Tsuki |
| Daily Intention | Below daily intention card | "Today's stone: available from [seller]" | Free only |
| Discover Tab (future) | Dedicated browse/shop section | Full seller catalog, search, price compare | All (opt-in) |

**Ad Format & Design Rules:**
- All ads must use the app's design language (dark bg, soft gold accents, clean typography)
- No animated/flashing ads. Static cards with subtle shimmer matching stone rendering style
- Every ad clearly labeled "Sponsored" (協賛) in small muted text
- Ads are contextual: only show sellers for the stone the user is currently viewing/using
- Maximum ad frequency: 1 ad per screen, no more than 3 ad impressions per session
- No interstitials or full-screen takeovers. Ever.
- Tap opens seller's external site in in-app browser (not a redirect away from the app)

**Seller Onboarding:**
- Sellers apply via partner portal
- Must be verified gemstone retailers (no dropshippers, no synthetic-only sellers)
- Seller provides: logo, product feed (stone type, price, image, URL), business verification
- App team reviews and approves sellers for quality/authenticity
- Revenue model: CPC (cost-per-click) with minimum bid per stone category
- Premium placement bids for Tier 1 stones (higher demand = higher CPC)

**Seller Ad Data Model:**

```
GemSeller {
  id: uuid
  name: string
  logo_url: string
  website_url: string
  verified: boolean
  country: string
  description_en: string
  description_jp: string
  active: boolean
  created_at: timestamp
}

GemSellerAd {
  id: uuid
  seller_id: uuid (FK -> GemSeller)
  stone_id: string (FK -> Stone)
  headline_en: string (max 40 chars)
  headline_jp: string (max 20 chars)
  image_url: string
  destination_url: string
  price_range: string (e.g., "$15-$45")
  cpc_bid: decimal
  impressions: int
  clicks: int
  active: boolean
  placement: 'stone_detail' | 'post_grid' | 'library_footer' | 'session_end' | 'daily_intention'
  created_at: timestamp
}
```

**API Endpoints (Ads):**

```
Ads
  GET    /ads/for-stone/:stoneId    Get contextual ad for a specific stone
  GET    /ads/for-grid              Get ad based on stones in completed grid
  GET    /ads/featured              Get featured seller ad (library footer / daily)
  POST   /ads/:id/impression        Track ad impression
  POST   /ads/:id/click             Track ad click-through

Seller Portal (admin)
  POST   /sellers/apply             Seller application
  GET    /sellers/:id/dashboard     Seller performance stats
  PATCH  /sellers/:id/ads           Update ad creative/bids
```

### 8.4 Subscription Gates

| Feature | Free | Tsuki | Hoshi |
|---------|------|-------|-------|
| Gem seller ads | All placements | Contextual only | Ad-free |
| Stones (Tier 1) | 5 | 5 | 5 |
| Stones (Tier 2-3) | locked | unlocked via level | unlocked via level |
| Nihon Meiseki stones | locked | locked | unlocked via level |
| Basic templates | 3 + freeform | 3 + freeform | 3 + freeform |
| Japanese templates | locked | unlocked via level | unlocked via level |
| Sacred geometry templates | locked | locked | unlocked via level |
| Saved grids | 3 | 25 | unlimited |
| Guided sessions | locked | all | all |
| AI Advisor | locked | basic | advanced |
| Community gallery | view only | view only | full access |
| Image export | locked | locked | full |
| Seasonal events | limited | full | full + early access |
| Offline mode | no | no | yes |

---

## 9. Localization

- Full EN/JP bilingual from launch
- All stone names displayed in both languages always
- UI text, narration scripts, lore cards all translated
- Potential future: ZH (Chinese), KO (Korean) given regional interest in power stones

---

## 10. Privacy & Compliance

- GDPR and CCPA compliant
- Account deletion with full data purge
- No third-party ad tracking
- Minimal data collection: email, usage stats, saved grids
- Supabase Row Level Security for user data isolation
- No social features requiring real names (display names only)
- Age gate: 13+ (no COPPA concerns with spiritual content)

---

## 11. MVP Scope (v1.0)

For initial release, ship:

| Feature | In MVP |
|---------|--------|
| Auth (email + Google + Apple) | Yes |
| Onboarding quiz | Yes |
| Stone library (all 24 stones, tiered access) | Yes |
| Grid canvas with drag/drop | Yes |
| 4 templates (Triangle, Square, Circle, Freeform) | Yes |
| Snap-to-grid | Yes |
| Save/load grids | Yes |
| Stone detail views (properties + lore) | Yes |
| XP system + levels 1-10 | Yes |
| Daily intention | Yes |
| Subscription (Tsuki + Hoshi via RevenueCat) | Yes |
| EN/JP language toggle | Yes |
| Symmetry assist | v1.1 |
| AI Advisor | v1.1 |
| Guided sessions | v1.1 |
| Skill trees | v1.2 |
| Achievements | v1.2 |
| Community gallery | v1.2 |
| Seasonal events | v1.3 |
| Image export | v1.2 |
| Energize animation | v1.1 |
| Ambient sound | v1.1 |

---

## 12. Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Downloads | 10,000+ |
| DAU/MAU ratio | 25%+ |
| Free-to-paid conversion | 8-12% |
| 7-day retention | 40%+ |
| 30-day retention | 20%+ |
| Average session length | 5-8 minutes |
| Grids created per user per week | 3+ |
| Subscription churn (monthly) | < 8% |
| App Store rating | 4.5+ |

---

*Knowledge Base Reference: `kb/japanese-healing-gemstones.md`*
*Repository: github.com/eurpeb2012*
