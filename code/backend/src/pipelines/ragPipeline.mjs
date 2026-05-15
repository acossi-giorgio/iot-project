import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { getEmbeddings } from "../config/embeddings.mjs";
import { getQdrantVectorStore } from "../config/database.mjs";
import { generateAnswer } from "../ai/chat.mjs";
import { formatDocs } from "../services/documentService.mjs";
import { env } from "../config/env.mjs";
import { logger } from "../config/logger.mjs";

export async function runRagPipeline(question, sources = [], interactions = []) {
    logger.info("RAG pipeline start");

    const history = interactions.flatMap((i) => [
        new HumanMessage(i.question ?? ""),
        new AIMessage(i.answer ?? ""),
    ]);

    const embeddings = await getEmbeddings();
    const vectorStore = await getQdrantVectorStore(embeddings);
    const nChunks = env.rag.nChunks || 5;

    logger.info("Retrieving chunks from vector store");
    let raw = [];
    if (sources?.length) {
        const searches = await Promise.all(
            sources.map(async (s) => {
                const filter = { must: [{ key: "metadata.source", match: { value: s } }] };
                return vectorStore.similaritySearchWithScore(question, nChunks, filter);
            })
        );
        raw = searches.flat();
    } else {
        raw = await vectorStore.similaritySearchWithScore(question, nChunks);
    }

    const chunks = raw
        .filter(([, score]) => score >= env.rag.threshold)
        .sort((a, b) => b[1] - a[1])
        .slice(0, nChunks);

    const context = formatDocs(chunks);

    logger.info("Generating answer with RAG context");
    const answer = await generateAnswer({ question, context, history });

    logger.info("RAG pipeline completed successfully");
    return { answer, chunks };
}
