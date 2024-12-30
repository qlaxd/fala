import { LRUCache } from 'lru-cache';

const geoCache = new LRUCache<string, string>({
  max: 10000,
  ttl: 1000 * 60 * 60 * 24, // 24 óra
});

export const getFromCache = (ip: string) => geoCache.get(ip);
export const setToCache = (ip: string, locale: string) => geoCache.set(ip, locale);