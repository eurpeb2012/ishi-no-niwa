import type { GemSellerAd } from "../types";

export const MOCK_ADS: GemSellerAd[] = [
  {
    id: "ad-1",
    sellerId: "seller-kyoto",
    sellerName: "Kyoto Crystal Shop",
    sellerLogo: "",
    stoneId: "amethyst",
    headline_en: "Premium Japanese Amethyst - Niigata Origin",
    headline_jp: "新潟産プレミアムアメジスト",
    imageUrl: "",
    destinationUrl: "https://example.com/kyoto-crystals",
    priceRange: "¥3,000 ~ ¥15,000",
    placement: "stone_detail",
  },
  {
    id: "ad-2",
    sellerId: "seller-tokyo",
    sellerName: "Tokyo Power Stones",
    sellerLogo: "",
    stoneId: "rose_quartz",
    headline_en: "Hand-Selected Rose Quartz Spheres",
    headline_jp: "厳選ローズクォーツスフィア",
    imageUrl: "",
    destinationUrl: "https://example.com/tokyo-stones",
    priceRange: "¥2,500 ~ ¥8,000",
    placement: "stone_detail",
  },
  {
    id: "ad-3",
    sellerId: "seller-osaka",
    sellerName: "Osaka Healing Gems",
    sellerLogo: "",
    stoneId: "jade_jadeite",
    headline_en: "Authentic Itoigawa Jade Magatama",
    headline_jp: "本物の糸魚川翡翠勾玉",
    imageUrl: "",
    destinationUrl: "https://example.com/osaka-gems",
    priceRange: "¥5,000 ~ ¥50,000",
    placement: "post_grid",
  },
  {
    id: "ad-4",
    sellerId: "seller-sendai",
    sellerName: "Sendai Mineral House",
    sellerLogo: "",
    stoneId: "clear_quartz",
    headline_en: "Yamanashi Crystal Points & Clusters",
    headline_jp: "山梨産水晶ポイント＆クラスター",
    imageUrl: "",
    destinationUrl: "https://example.com/sendai-minerals",
    priceRange: "¥1,500 ~ ¥12,000",
    placement: "library_footer",
  },
  {
    id: "ad-5",
    sellerId: "seller-fukuoka",
    sellerName: "Fukuoka Stone Market",
    sellerLogo: "",
    stoneId: "tigers_eye",
    headline_en: "Tiger's Eye Bracelets for Career Success",
    headline_jp: "仕事運タイガーアイブレスレット",
    imageUrl: "",
    destinationUrl: "https://example.com/fukuoka-stones",
    priceRange: "¥1,800 ~ ¥6,000",
    placement: "daily_intention",
  },
  {
    id: "ad-6",
    sellerId: "seller-kyoto",
    sellerName: "Kyoto Crystal Shop",
    sellerLogo: "",
    stoneId: "moonstone",
    headline_en: "Moonstone Meditation Sets",
    headline_jp: "ムーンストーン瞑想セット",
    imageUrl: "",
    destinationUrl: "https://example.com/kyoto-crystals/moonstone",
    priceRange: "¥4,000 ~ ¥18,000",
    placement: "session_end",
  },
];

export function getAdForPlacement(
  placement: string,
  stoneId?: string
): GemSellerAd | null {
  if (stoneId) {
    const match = MOCK_ADS.find(
      (a) => a.stoneId === stoneId && a.placement === placement
    );
    if (match) return match;
  }
  const ads = MOCK_ADS.filter((a) => a.placement === placement);
  if (ads.length === 0) {
    // Fallback: return any ad
    return MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
  }
  return ads[Math.floor(Math.random() * ads.length)];
}
