import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { generateAnswer } from "../ai/chat.mjs";
import { logger } from "../config/logger.mjs";

export async function runChatPipeline(question, _sources = [], interactions = []) {
    logger.info("Chat pipeline start");

    const history = interactions.flatMap((i) => [
        new HumanMessage(i.question ?? ""),
        new AIMessage(i.answer ?? ""),
    ]);

    logger.info("Generating answer (chat-only, no retrieval)");
    const answer = await generateAnswer({
        question,
        context: "",
        history,
    });

    logger.info("Chat pipeline completed successfully");
    return { answer };
}
