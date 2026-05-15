import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { getEmbeddings } from "../config/embeddings.mjs";
import { getQdrantVectorStore } from "../config/database.mjs";
import { generateAnswer } from "../ai/dataAnalysis.mjs";
import { rephraseAnswer } from "../ai/rephraser.mjs";
import { formatDocs } from "../services/documentService.mjs";
import { formatVitals } from "../services/vitalsService.mjs";
import { env } from "../config/env.mjs";
import { logger } from "../config/logger.mjs";

function buildUnifiedQuery(question, diagnosis) {
    const parts = [];
    if (question) parts.push(`Question: ${question}.`);
    if (diagnosis?.length) parts.push(`Diagnosis: ${diagnosis.join(", ")}.`);
    return parts.join(" ");
}

export async function runDataAnalysisPipeline(question, sources = [], interactions = [], vitalsStatistics = null, diagnosis = null) {
    logger.info("Data analysis pipeline start");

    const history = interactions.flatMap((i) => [
        new HumanMessage(i.question ?? ""),
        new AIMessage(i.answer ?? ""),
    ]);

    logger.info("Rephrasing question");
    const rephrasedQuestion = await rephraseAnswer(question, "");

    const unifiedQuery = buildUnifiedQuery(rephrasedQuestion, diagnosis);

    const embeddings = await getEmbeddings();
    const vectorStore = await getQdrantVectorStore(embeddings);
    const nChunks = env.rag.nChunks || 5;

    logger.info("Retrieving chunks from vector store");
    let raw = [];
    if (sources?.length) {
        const searches = await Promise.all(
            sources.map(async (s) => {
                const filter = { must: [{ key: "metadata.source", match: { value: s } }] };
                return vectorStore.similaritySearchWithScore(unifiedQuery, nChunks, filter);
            })
        );
        raw = searches.flat();
    } else {
        raw = await vectorStore.similaritySearchWithScore(unifiedQuery, nChunks);
    }

    const chunks = raw
        .filter(([, score]) => score >= env.rag.threshold)
        .sort((a, b) => b[1] - a[1])
        .slice(0, nChunks);

    const context = formatDocs(chunks);

    logger.info("Generating data analysis answer");
    const answer = await generateAnswer({
        question,
        vitals: formatVitals(vitalsStatistics),
        diagnosis,
        context,
        history,
    });

    logger.info("Data analysis pipeline completed successfully");
    return { rephrasedQuestion, answer, chunks };
}
