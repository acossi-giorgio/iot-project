export function cleanRawResponse(raw) {
  if (raw == null) return "";

  let text = Array.isArray(raw)
    ? raw.map(c => (c?.text ?? c)).join(" ")
    : raw;
  if (typeof text !== "string") text = String(text ?? "");
  text = text.trim();

  // Strip Gemma 4 thinking blocks: <|channel>thought ... <channel|>
  text = text.replace(/<\|channel>thought[\s\S]*?<channel\|>/gi, "").trim();
  // Strip Qwen3 / generic thinking blocks: <think> ... </think>
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  if (text.startsWith("````") || text.startsWith("```")) {
    const fenceMatch = /```(?:json)?\n([\s\S]*?)```/i.exec(text);
    if (fenceMatch) text = fenceMatch[1].trim();
  }

  const jsonRegex = /{[\s\S]*}/g;
  const candidates = text.match(jsonRegex);

  if (candidates) {
    for (const c of candidates) {
      try {
        JSON.parse(c);
        return c.trim();
      } catch (_) {}
    }
  }

  return text;
}
