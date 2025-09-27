/**
 * Instagram Stories sharing utilities for mobile devices
 * Handles deep linking to Instagram Stories with fallback to app stores
 */

/**
 * Detects if the current device is mobile (iOS or Android)
 * Validates both user agent and screen width
 * Avoids SSR issues by checking for client-side environment
 */
export function isMobileDevice(): boolean {
  // Avoid SSR issues
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const hasTouchPoints = navigator.maxTouchPoints > 0;
  const screenWidth = window.innerWidth;

  // Check for mobile indicators
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  // Check screen width (mobile breakpoint at 768px)
  const isMobileWidth = screenWidth <= 768;

  console.log('🧨🧨isMobileDevice', {isIOS}, {isAndroid}, {isMobileUA}, {hasTouchPoints}, {screenWidth}, {isMobileWidth})
  
  // Must be mobile user agent AND have touch points AND mobile width
  return (isIOS || isAndroid || isMobileUA) && hasTouchPoints && isMobileWidth;
}

/**
 * Normalizes hex color by removing the # prefix
 * @param color - Hex color string (e.g., "#FF6B6B" or "FF6B6B")
 * @returns Normalized hex color without #
 */
export function normalizeHex(color: string): string {
  if (!color) return '';
  
  // Remove # if present
  return color.startsWith('#') ? color.slice(1) : color;
}

/**
 * Validates if a string is a valid URL
 * @param url - URL string to validate
 * @returns true if valid URL, false otherwise
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds Instagram Stories deep link URL
 * Uses a simpler approach that Instagram recognizes better
 * @param opts - Configuration options for the story
 * @returns Instagram Stories deep link URL
 */
export function buildInstagramStoryUrl(opts: {
  backgroundImage?: string;
  stickerImage?: string;
  backgroundTopColor?: string;
  backgroundBottomColor?: string;
  attributionURL?: string;
}): string {
  // Try different Instagram deep link formats
  const schemes = [
    'instagram-stories://share',
    'instagram://story-camera',
    'instagram://camera'
  ];

  // For now, use the simplest approach - just open Instagram Stories
  // Instagram will handle the content sharing through the Web Share API or clipboard
  return schemes[2];
}

/**
 * Opens Instagram Stories with fallback to app store
 * @param params - Configuration for opening and fallback
 */
export async function openWithFallback(params: {
  primaryUrl: string;
  timeoutMs?: number;
  iosStoreUrl: string;
  androidStoreUrl: string;
}): Promise<void> {
  const { primaryUrl, timeoutMs = 1500, iosStoreUrl, androidStoreUrl } = params;

  // Track if the app opened successfully
  let appOpened = false;

  // Listen for page visibility changes (indicates app switch)
  const handleVisibilityChange = () => {
    appOpened = true;
  };

  const handlePageHide = () => {
    appOpened = true;
  };

  // Add event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  document.addEventListener('pagehide', handlePageHide);

  try {
    // Attempt to open Instagram Stories
    window.location.href = primaryUrl;

    // Wait for timeout to check if app opened
    await new Promise(resolve => setTimeout(resolve, timeoutMs));

    // If app didn't open, redirect to store
    if (!appOpened) {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      
      const storeUrl = isIOS ? iosStoreUrl : androidStoreUrl;
      window.location.href = storeUrl;
    }
  } finally {
    // Clean up event listeners
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('pagehide', handlePageHide);
  }
}
