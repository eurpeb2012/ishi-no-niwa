# Item #11: Crystal Fairy Avatar System — Detailed Specification

## Overview

A fairy companion (クリスタルフェアリー) that starts simple, evolves with player progress, holds crystals that upgrade over time, and lives in a decoratable crystal sanctuary. Inspired by Livly Island, Pokecolo, Tamagotchi, and iyashikei (healing game) design principles.

**Target audience:** Japanese women 25-45 interested in healing crystals and spirituality.
**Design philosophy:** Iyashikei (癒し系) — no failure state, no punishment, gentle progression, little delights.

---

## 1. Art Assets (Takae's Designs)

Takae created comprehensive ChatGPT-generated art assets in a consistent **soft watercolor / pastel anime** style:

### 1a. Color Palette (081453.jpg)
- 10 soft watercolor circles defining the app's target color scheme
- Cream, powder blue, mint green, lavender, soft pink, dusty rose tones
- These colors inform the fairy's world, UI accents, and accessory palettes

### 1b. Four Fairy Color Variants (082300.jpg)
| Variant | Crystal Affinity | Hair Color | Wing Style | Held Crystal |
|---------|-----------------|------------|------------|-------------|
| **Rose Quartz** | Love & Healing | Pink/rose | Petal-shaped, translucent pink | Rose quartz sphere |
| **Onyx/Obsidian** | Protection | Dark gray/midnight | Angular, dark translucent | Dark crystal |
| **Amethyst** | Calm & Spiritual | Purple/lavender | Large petal wings, sparkle accents | Faceted amethyst |
| **Jade** | Prosperity & Balance | Green/emerald | Leaf-shaped, translucent green | Jade stone |

- All fairies: flowing hair, flower crown/tiara, crystal-themed dress, sparkle particle effects
- Watercolor aesthetic with soft edges and gentle shading

### 1c. App Icons — Iconified (082318.jpg)
- Label: 「アイコン化（アプリ向け）」
- 4 mini fairy characters (chibi heads) + 4 circular badge/icon versions below
- Purple, pink, green, dark blue variants
- **Use case:** Profile badges, achievement icons, notification icons, tab bar accent

### 1d. Mini Mascots (082322.jpg)
- Label: 「ミニマスコット」
- 4 chibi-style mascot sprites with wings and crystals
- Larger and more detailed than icons, smaller than full fairy
- **Use case:** In-app fairy companion (garden screen, guide screen), chat bubble avatar, loading screen

### 1e. Logo-Style Designs (082325.jpg)
- Label: 「ロゴ風デザイン」
- 4 crystal-butterfly motifs: faceted gem center with decorative wing/leaf elements
- Purple, pink, green, dark blue with sparkle accents
- **Use case:** App logo, splash screen, subscription tier badges, share watermark

### 1f. Detailed Amethyst Fairy (082406.jpg)
- Full-size detailed amethyst/purple fairy in two poses/sizes
- Flowing purple hair, large petal-like wings, holding amethyst crystal
- Flower crown with small blossoms
- **Use case:** Welcome screen, onboarding, full-screen fairy moments

### 1g. Amethyst Fairy — Evolution Stages (082411.jpg)
- Two versions of the amethyst fairy showing **evolution difference**:
  - **Top:** Simpler form — smaller wings, less detail, lighter color saturation
  - **Bottom:** Advanced form — larger wings, more ornate dress, richer colors, more sparkle effects
- **Use case:** Demonstrates the before/after of fairy evolution progression

### 1h. Amethyst Fairy — Crystal Prominence (082415.jpg)
- Two versions emphasizing the **held crystal**:
  - **Top:** Fairy holding a LARGE prominent faceted amethyst crystal (crystal is focal point)
  - **Bottom:** Fairy with smaller crystal, more body detail visible
- **Use case:** Shows how the crystal the fairy holds grows/upgrades with progression

### 1i. Fairy House / Crystal Sanctuary (082553.jpg)
- Label: 「妖精の家」(Fairy's House)
- Hobbit-hole style round-door treehouse surrounded by:
  - Large amethyst crystal clusters (purple)
  - Flowering vines and greenery
  - Small lanterns (warm glow)
  - Pink and white flowers
- Purple/amethyst fairy visible inside through the round window
- Green/jade fairy peeking from the roof among leaves
- **Use case:** Fairyland / Crystal Sanctuary screen — the fairy's home that players decorate

### 1j. Crystal Garden Scene (082557.jpg)
- Label: 「クリスタル庭園」(Crystal Garden)
- Lush garden setting with:
  - Green/jade fairy and pink/rose quartz fairy together
  - Crystal formations, flowers, pond/water feature
  - Soft natural lighting, sparkle particles
- **Use case:** Community/social screen background, friend visit view, loading screen

### 1k. Crystal Aquarium (082601.jpg)
- Label: 「クリスタル水槽」(Crystal Aquarium)
- Glass terrarium/aquarium containing:
  - Dark blue/onyx fairy and pink/rose quartz fairy
  - Large crystal formations (purple/blue)
  - Flowers, water lilies, sparkle effects
  - Ornate terrarium frame
- **Use case:** Alternative fairy habitat style, premium decoration theme, profile display

---

## 2. Fairy Evolution System (進化 / Shinka)

### 2a. Evolution Stages (5 stages tied to Kyu/Dan rank)

| Stage | Name (EN) | Name (JP) | Unlocked At | Visual Changes |
|-------|-----------|-----------|-------------|----------------|
| 1 | **Seed Sprite** | 種の精 | Level 1 (Initiate) | Tiny glowing orb with faint wing outlines, single small crystal |
| 2 | **Bud Fairy** | 蕾の妖精 | Level 3 (9th Kyu) | Small chibi fairy, simple wings, holds tiny rough crystal |
| 3 | **Bloom Fairy** | 花の妖精 | Level 6 (6th Kyu) | Mini mascot size, petal wings visible, holds polished crystal |
| 4 | **Crystal Fairy** | 水晶の妖精 | Level 9 (3rd Kyu) | Full fairy form, ornate wings, holds faceted crystal, sparkle particles |
| 5 | **Guardian Spirit** | 守護の精霊 | Level 12 (1st Dan) | Detailed fairy (Takae's full art), large wings, prominent crystal, flower crown, aura effects |

### 2b. Crystal Held by Fairy — Upgrades with Progression

The crystal the fairy holds visually upgrades:

| Crystal Stage | Visual | Unlocked By |
|---------------|--------|-------------|
| **Rough chip** | Small, unpolished, dim | Default |
| **Tumbled stone** | Smooth, slight glow | 10 grids completed |
| **Polished cabochon** | Glossy, soft shimmer | 30 grids completed |
| **Faceted gem** | Multi-faceted, sparkle particles | 50 grids + 3rd Kyu |
| **Radiant crystal** | Large, brilliant glow, light rays | 100 grids + 1st Dan |

The crystal **type** matches the player's most-used intention:
- Love grids → Rose Quartz fairy
- Calm grids → Amethyst fairy
- Protection grids → Onyx fairy
- Prosperity grids → Jade fairy

### 2c. Evolution Triggers (based on Livly Island + Tamagotchi model)

Evolution is NOT purely XP-based. It combines:

1. **Grid Completion Energy** — Each completed grid generates "Crystal Energy" (結晶エネルギー)
2. **Consistency Streak** — Daily practice bonus (like Tamagotchi care quality)
3. **Variety** — Using diverse stones and templates accelerates evolution
4. **Milestone Achievements** — Specific achievements trigger evolution (e.g., "Complete 5 different template types")

**No punishment for absence.** Fairy simply sleeps/rests when player is away. Returns happy when player comes back. (Iyashikei principle)

---

## 3. Fairy Customization (着せ替え / Kisekae)

Inspired by Pokecolo and Nikki series. Outfit items have **crystal affinity stats** (like Nikki's 5-attribute system).

### 3a. Customization Slots

| Slot | Examples | Source |
|------|----------|--------|
| **Wings** | Petal wings, crystal wings, butterfly wings, leaf wings, feather wings | Evolution + shop + gacha |
| **Crown/Tiara** | Flower crown, crystal tiara, moonstone circlet, vine wreath | Achievements + shop |
| **Dress** | Crystal dress, petal dress, moonlight gown, seasonal kimono | Gacha + seasonal events |
| **Accessories** | Crystal earrings, flower bracelet, star pendant, chakra beads | Daily rewards + shop |
| **Aura/Trail** | Sparkle trail, petal scatter, moonbeam, crystal dust | Premium / subscription |
| **Held Crystal** | Changes with dominant intention (see 2b) | Automatic based on play |

### 3b. Outfit Affinity System (inspired by Nikki)

Each outfit item has affinity bonuses for crystal intentions:

```
Example: "Amethyst Petal Wings"
  Calm: +3
  Spiritual: +2
  Healing: +1
```

When the fairy wears items that match the current grid's intention, bonus effects appear (extra sparkles, fairy dialogue, small XP boost). This is cosmetic/feel-good, not punitive — any outfit works.

### 3c. Seasonal & Limited Items

| Season | Theme | Special Items |
|--------|-------|---------------|
| **Spring (春)** | Cherry blossom | Sakura wings, hanami dress, petal crown |
| **Summer (夏)** | Ocean / Tanabata | Shell accessories, wave wings, star pendant |
| **Autumn (秋)** | Moon viewing | Maple leaf wings, moonlit dress, harvest crown |
| **Winter (冬)** | Snow crystal | Ice wings, crystal snowflake dress, aurora aura |
| **New Year (正月)** | Shrine maiden | Miko outfit, kagura bells, sacred rope accessory |

---

## 4. Crystal Sanctuary / Fairyland (妖精の家)

A personal habitat screen where the fairy lives. Inspired by Livly Island's personal island + Genshin's Serenitea Pot + Pokecolo's planet.

### 4a. Sanctuary Layouts

| Layout | Theme | Unlock |
|--------|-------|--------|
| **Crystal Treehouse** | Hobbit-hole with crystal clusters (Takae's 082553 design) | Default |
| **Crystal Garden** | Lush garden with pond (Takae's 082557 design) | Level 5 |
| **Crystal Aquarium** | Glass terrarium with crystals (Takae's 082601 design) | Tsuki subscription |
| **Moonlit Shrine** | Japanese stone garden with torii | Level 10 |
| **Cloud Palace** | Floating crystal palace | Hoshi subscription |

### 4b. Decoration Items

Players place decorations in the sanctuary. Categories:
- **Crystals** — Large display crystals, crystal clusters, crystal trees
- **Nature** — Flowers, vines, trees, moss, mushrooms
- **Furniture** — Cushions, lanterns, shelves, altars
- **Water** — Ponds, fountains, waterfalls, lily pads
- **Light** — Candles, fairy lights, lanterns, aurora effects

Decorations are earned from:
- Grid completion rewards
- Achievement milestones
- Seasonal events
- Shop / premium currency
- Daily login bonus

### 4c. Sanctuary Energy Level

The sanctuary has an "energy level" (エネルギーレベル) that rises based on:
- Active crystal grids
- Fairy's evolution stage
- Number of decorations placed
- Visitor interactions (friends visiting)

Higher energy = more ambient effects (sparkles, floating petals, gentle glow, ambient music evolves).

---

## 5. Fairy Interaction & Dialogue

### 5a. Context-Aware Fairy Messages

The fairy reacts to player actions (already partially implemented as `fairy` i18n keys):

| Context | Fairy Reaction |
|---------|---------------|
| Place a crystal | Comments on the crystal's properties |
| Complete a grid | Celebratory animation + compliment |
| Daily check-in | Greeting based on time of day + moon phase |
| New crystal unlocked | Excited reaction, shares crystal lore |
| Long absence | Sleepy wake-up animation, "I missed you" |
| Streak milestone | Special congratulations |
| Seasonal event | Dressed in seasonal outfit, themed dialogue |

### 5b. Fairy Personality Variants

Based on the 4 color variants, each fairy has a personality flavor:

| Fairy | Personality | Speech Style (JP) |
|-------|------------|-------------------|
| **Rose Quartz** | Warm, nurturing, encouraging | やさしい語り口、「〜ね」「〜よ」 |
| **Amethyst** | Mystical, wise, contemplative | 落ち着いた語り口、「〜でしょう」「〜かしら」 |
| **Jade** | Cheerful, energetic, playful | 元気な語り口、「〜だよ！」「わーい」 |
| **Onyx** | Cool, protective, reliable | クールな語り口、「〜だな」「任せて」 |

Player chooses their fairy during onboarding (or it's assigned based on intention quiz answers).

---

## 6. Monetization Integration

### 6a. Free Tier
- 1 fairy (assigned by intention quiz)
- Basic customization (3-4 free outfits per slot)
- Default Crystal Treehouse sanctuary
- Evolution through gameplay (no paywall on stages)

### 6b. Tsuki Subscription ($4.99/mo)
- Unlock additional fairy color variant
- Crystal Aquarium sanctuary layout
- Monthly exclusive outfit item
- 1 premium gacha pull per month

### 6c. Hoshi Subscription ($39.99/yr)
- All 4 fairy color variants unlockable
- All sanctuary layouts
- Monthly exclusive outfit set (full outfit)
- 3 premium gacha pulls per month
- Cloud Palace sanctuary
- Ad-free (existing benefit)

### 6d. In-App Purchases (à la carte)
- **Fairy Outfit Gacha** — 120 crystals (premium currency) per pull, 10-pull for 1080
- **Sanctuary Decoration Packs** — Themed bundles (e.g., "Spring Sakura Pack" $2.99)
- **Fairy Color Change Potion** — One-time switch to different fairy variant ($1.99)

---

## 7. Social Features

### 7a. Fairy Photo Mode
- Take photos of fairy in sanctuary or overlaid on crystal grid
- Pose selection, filter options, frame options
- Share to community gallery or external (LINE, Instagram)

### 7b. Friend Visits
- Visit friends' sanctuaries
- Fairies interact with each other (wave, dance, share crystals)
- Leave a "blessing" (gift small decoration or energy boost)

### 7c. Community Gallery
- Share fairy screenshots
- "Most beautiful fairy" weekly showcase
- Seasonal photo contests

---

## 8. Technical Implementation Notes

### 8a. Data Model

```typescript
interface FairyState {
  colorVariant: "rose_quartz" | "amethyst" | "jade" | "onyx";
  evolutionStage: 1 | 2 | 3 | 4 | 5;
  crystalStage: 1 | 2 | 3 | 4 | 5;
  bondLevel: number;           // 0-100, increases with daily use
  totalGridsCompleted: number;
  dominantIntention: string;   // determines held crystal type
  outfit: {
    wings: string | null;
    crown: string | null;
    dress: string | null;
    accessory: string | null;
    aura: string | null;
  };
  sanctuary: {
    layout: string;
    decorations: SanctuaryDecoration[];
    energyLevel: number;
  };
  personality: string;
  unlockedItems: string[];
}

interface SanctuaryDecoration {
  id: string;
  itemId: string;
  x: number;
  y: number;
  rotation: number;
}
```

### 8b. Asset Requirements

| Asset Type | Count | Format | Notes |
|-----------|-------|--------|-------|
| Fairy sprites (per variant) | 5 stages x 4 colors = 20 | PNG with transparency | Use Takae's art as base |
| Crystal held sprites | 5 stages x 4 types = 20 | PNG | Small overlay on fairy |
| Wing items | ~15 initial | PNG | Layered on fairy sprite |
| Crown items | ~10 initial | PNG | Layered on fairy sprite |
| Dress items | ~10 initial | PNG | Layered on fairy sprite |
| Accessory items | ~15 initial | PNG | Layered on fairy sprite |
| Aura effects | ~5 initial | Lottie animation | Looping particle effects |
| Sanctuary backgrounds | 5 layouts | PNG (large) | Based on Takae's concepts |
| Sanctuary decorations | ~50 initial | PNG | Draggable items |
| Fairy animations | Idle, happy, sleepy, celebrate, wave | Lottie or sprite sheet | Per evolution stage |

### 8c. Phased Rollout

| Phase | Features | Priority |
|-------|----------|----------|
| **Phase 1** (MVP) | Single fairy variant (based on quiz), 3 evolution stages, basic held crystal, fairy dialogue on garden screen | HIGH |
| **Phase 2** | All 4 color variants, 5 evolution stages, crystal upgrade system, basic outfit customization (wings + crown) | HIGH |
| **Phase 3** | Crystal Sanctuary screen, decoration placement, energy system | MEDIUM |
| **Phase 4** | Full outfit system, gacha, seasonal items | MEDIUM |
| **Phase 5** | Social features (friend visits, photo mode, community gallery) | LOW |

---

## 9. Japanese Game Design References

| Game | Relevant Mechanic | How We Adapt It |
|------|-------------------|-----------------|
| **Livly Island** (リヴリーアイランド) | Potion-based species transformation, island decoration, food changes pet color | Crystal grid energy → fairy evolution; crystal type → fairy color affinity |
| **Pokecolo** (ポケコロ) | 80K+ dress-up items, personal planet decoration, gacha monetization | Fairy outfit gacha, sanctuary decoration, daily free pull |
| **Nikki Series** | 5-attribute outfit scoring, outfit upgrades, stage battles | Crystal affinity stats on outfits, intention-matching bonuses |
| **Tamagotchi** | Care quality determines evolution, emotional attachment design | Consistent play → beautiful evolution; no punishment |
| **Genshin Impact** | Choose-one Seelie companion, Serenitea Pot housing | Choose fairy color during onboarding, sanctuary decoration |
| **Neko Atsume** | No-stress collection, gentle rewards, iyashikei | No failure state, fairy sleeps when absent, gentle return |
| **Fate/Grand Order** | Bond system, story-locked companion progression | Bond level through daily use, milestone-based evolution |

---

## 10. Naming Conventions

| English | Japanese | Context |
|---------|----------|---------|
| Crystal Fairy | クリスタルフェアリー | The companion character |
| Seed Sprite | 種の精 (たねのせい) | Evolution stage 1 |
| Bud Fairy | 蕾の妖精 (つぼみのようせい) | Evolution stage 2 |
| Bloom Fairy | 花の妖精 (はなのようせい) | Evolution stage 3 |
| Crystal Fairy | 水晶の妖精 (すいしょうのようせい) | Evolution stage 4 |
| Guardian Spirit | 守護の精霊 (しゅごのせいれい) | Evolution stage 5 |
| Crystal Sanctuary | 妖精の家 (ようせいのいえ) | Fairy habitat screen |
| Crystal Energy | 結晶エネルギー | Grid-generated energy |
| Bond Level | 絆レベル (きずなレベル) | Fairy affection meter |
| Fairy Wardrobe | 妖精の衣装 (ようせいのいしょう) | Outfit customization screen |
