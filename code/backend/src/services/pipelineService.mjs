import { runChatPipeline } from "../pipelines/chatPipeline.mjs";
import { runRagPipeline } from "../pipelines/ragPipeline.mjs";
import { runRagWithRephrasingPipeline } from "../pipelines/ragWithRephrasingPipeline.mjs";
import { runDataAnalysisPipeline } from "../pipelines/dataAnalysisPipeline.mjs";

export const PLANS = ["chat", "rag", "ragWithRephrasing", "dataAnalysis"];

export function getPipeline(plan) {
    const registry = {
        chat: runChatPipeline,
        rag: runRagPipeline,
        ragWithRephrasing: runRagWithRephrasingPipeline,
        dataAnalysis: runDataAnalysisPipeline,
    };
    return registry[plan];
}
