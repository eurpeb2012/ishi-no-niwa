import { useWindowDimensions } from "react-native";

export type Breakpoint = "phone" | "tablet" | "desktop";

export interface ResponsiveValues {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** Max content width — caps at 600 on tablet, 480 on phone, 900 on desktop */
  contentWidth: number;
  /** Horizontal padding for the content area */
  contentPadding: number;
  /** Canvas size for the garden (fits within content, leaves padding) */
  canvasSize: number;
  /** Number of columns for stone grid */
  stoneColumns: number;
  /** Scale factor for font sizes on larger screens */
  fontScale: number;
}

export function useResponsive(): ResponsiveValues {
  const { width, height } = useWindowDimensions();

  const breakpoint: Breakpoint =
    width >= 1024 ? "desktop" : width >= 600 ? "tablet" : "phone";

  const isPhone = breakpoint === "phone";
  const isTablet = breakpoint === "tablet";
  const isDesktop = breakpoint === "desktop";

  const contentWidth = isDesktop
    ? Math.min(width, 900)
    : isTablet
    ? Math.min(width, 600)
    : width;

  const contentPadding = isDesktop ? 48 : isTablet ? 32 : 24;

  // Canvas: square, fits within content width minus padding
  const canvasSize = Math.min(
    contentWidth - contentPadding * 2,
    height * 0.55, // Use more screen height for a larger grid
    560 // Hard cap
  );

  const stoneColumns = isDesktop ? 5 : isTablet ? 4 : 3;
  const fontScale = isDesktop ? 1.15 : isTablet ? 1.1 : 1;

  return {
    width,
    height,
    breakpoint,
    isPhone,
    isTablet,
    isDesktop,
    contentWidth,
    contentPadding,
    canvasSize,
    stoneColumns,
    fontScale,
  };
}
