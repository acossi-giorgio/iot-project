import { ChatOllama } from "@langchain/ollama";
import { env } from "./env.mjs";

const OLLAMA_TIMEOUT_MS = 10 * 60 * 1000;
const NUM_CTX = 1024;

export async function getChatModel() {
    return new ChatOllama({
        model: env.chat.model,
        baseUrl: env.ollama.baseUrl,
        temperature: env.chat.temperature,
        numCtx: NUM_CTX,
        requestOptions: { timeout: OLLAMA_TIMEOUT_MS },
    });
}

export async function getRewriterModel() {
    return new ChatOllama({
        model: env.rewriter.model,
        baseUrl: env.ollama.baseUrl,
        temperature: env.rewriter.temperature,
        numCtx: NUM_CTX,
        requestOptions: { timeout: OLLAMA_TIMEOUT_MS },
    });
}