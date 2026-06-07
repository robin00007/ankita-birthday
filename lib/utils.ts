import type { SiteConfig } from './config';

export function encodeConfig(config: Partial<SiteConfig>): string {
  return btoa(encodeURIComponent(JSON.stringify(config)));
}
