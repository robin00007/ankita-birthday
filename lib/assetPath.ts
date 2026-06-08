const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const assetPath = (path: string) => `${BASE}${path}`;
