import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getClassificationModel } from "../config/llm.mjs";
import { logger } from "../config/logger.mjs";
import { cleanRawResponse } from "../common/utils.mjs";

const SYSTEM_PROMPT = `
You are a medical domain classifier. Given a user's input and previous conversation history, decide if the message is health-related.

IN DOMAIN → valid=true:
- Symptoms, diseases, medications, treatments, anatomy, physiology, mental health, nutrition, fitness, medical devices.
- Any message mentioning a symptom (pain, fever, hurt, sick, cough...) is ALWAYS IN DOMAIN.
- Follow-up questions (Why? How much? And then?) when the prior conversation is medical.
- Greetings, polite conversation, or ambiguous inputs that could plausibly be health-related.

OUT OF DOMAIN → valid=false:
- Explicitly unrelated topics: politics, sports, entertainment, coding, finance, mathematics, general trivia.

OUTPUT — return ONLY minified JSON, no text, no markdown, no explanation:
- IN DOMAIN:    {"valid": true, "message": "OK"}
- OUT OF DOMAIN: {"valid": false, "message": "I can only assist with medical and health-related questions. Please ask about symptoms, treatments, or health data."}
`;

const HUMAN_TEMPLATE = `
    PREVIOUS USER QUESTIONS:
    {history}

    CURRENT USER QUESTION:
    {question}
    
    Return ONLY minified JSON: {{"valid": <bool>, "message": <string>}} (no text, no markdown, no explanations).
`;

const llm = await getClassificationModel();

function parseDomain(raw) {
  const text = cleanRawResponse(raw);
  if (!text) {
    return { valid: false, message: "Risposta vuota dal modello" };
  }
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed.valid === "boolean" && typeof parsed.message === "string") {
      return parsed;
    }
    return { valid: false, message: "Format not valid" };
  } catch (e) {
    logger.warn(`Failed parse JSON: ${text}`);
    return { valid: false, message: "Response not valid JSON" };
  }
}

export async function classifyDomain(question, history = []) {
  const historyText = history.length > 0 ? history.join("\n") : "None";
  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate('{system}'),
    HumanMessagePromptTemplate.fromTemplate(HUMAN_TEMPLATE)
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  const raw = await chain.invoke({ system: SYSTEM_PROMPT, question, history: historyText });
  return parseDomain(raw);
}