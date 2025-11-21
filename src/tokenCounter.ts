/**
 * Simple token counter using character-based estimation
 * For production, consider using tiktoken or similar
 */

export function estimateTokens(data: any): number {
  const text = typeof data === 'string' ? data : JSON.stringify(data);

  // Rough estimation: ~4 characters per token for English text
  // This is a simplified approximation
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  // Average between character-based (chars/4) and word-based (words * 1.3)
  const charBasedEstimate = charCount / 4;
  const wordBasedEstimate = wordCount * 1.3;

  return Math.round((charBasedEstimate + wordBasedEstimate) / 2);
}

export function compareTokens(jsonData: any, toonData: any): {
  json: number;
  toon: number;
  savings: number;
} {
  const jsonTokens = estimateTokens(jsonData);
  const toonTokens = estimateTokens(toonData);
  const savings = jsonTokens > 0 ? ((jsonTokens - toonTokens) / jsonTokens) * 100 : 0;

  return {
    json: jsonTokens,
    toon: toonTokens,
    savings: Math.max(0, savings)
  };
}
