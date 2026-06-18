import OpenAI from "openai";

let _client: OpenAI | null = null;

export function openai(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.startsWith("sk-proj-...")) {
      throw new Error(
        "OPENAI_API_KEY manquante ou placeholder. Configure-la dans .env.local.",
      );
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}
