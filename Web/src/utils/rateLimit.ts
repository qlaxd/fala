export const rateLimit = (options: {
  interval: number;
  uniqueTokenPerInterval: number;
  max: number;
}) => {

const tokenCache = new Map();
  return {
    check: (token: string | null) => new Promise<void>((resolve, reject) => {
      const tokenCount = tokenCache.get(token) || 0;
      if (tokenCount >= options.max) {
        reject(new Error('Rate limit exceeded'));
      }
      tokenCache.set(token, tokenCount + 1);
      setTimeout(() => {
        tokenCache.delete(token);
      }, options.interval);
      resolve();
    }),
  };
};