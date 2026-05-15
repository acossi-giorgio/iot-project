import { constant } from "../config/constat.mjs";
import { getMongoDb } from "../config/database.mjs";
import { getDevice } from "../repositories/devicesRepository.mjs";
import { createInteraction, getInteractions } from "../repositories/interactionsRepository.mjs";
import { getSession } from "../repositories/sessionsRepository.mjs";
import { getVitalsStatistics } from "../services/vitalsService.mjs";
import { validateAskInteractionRequest, validateSubmitInteractionRequest } from "../schemas/interactionSchema.mjs";
import { getPipeline } from "../services/pipelineService.mjs";
import { getDocuments } from "../repositories/documentRepository.mjs";
import { makeDiagnosis } from "../services/diagnosisService.mjs";
import { env } from "../config/env.mjs";
import { logger } from "../config/logger.mjs";


export async function askInteractionHandler(req, res) {
    const logPrefix = "| askInteractionHandler |";
    try {
        logger.info(`${logPrefix} Ask interaction request received`);
        const body = req.body || {};
        const { valid, errors } = validateAskInteractionRequest(body);
        if (!valid) return res.status(400).json({ error: "Invalid request body", details: errors });
        const { deviceId, sessionId, question, plan } = body;
        const db = await getMongoDb();
        const device = await getDevice(db, deviceId);

        if (!device) return res.status(400).json({ error: "Device not found" });

        const session = await getSession(db, sessionId);

        if (!session) return res.status(400).json({ error: "Session not found" });
        if (session.status !== constant.sessionStatus.active) return res.status(400).json({ error: "Session not inactive" });
        if (session.deviceId !== deviceId) return res.status(400).json({ error: "Session does not belong to device" });

        const interactions = await getInteractions(db, session._id, env.rag.nHistory);
        const documents = await getDocuments(db);
        const sources = documents.map(doc => doc.name);

        const pipeline = getPipeline(plan);
        if (!pipeline) {
            logger.warn(`${logPrefix} Invalid plan: ${plan}`);
            return res.status(400).json({ error: `Invalid plan: ${plan}` });
        }

        logger.info(`${logPrefix} Performing ${plan} pipeline interaction`);

        let result;
        let payload;

        if (plan === "dataAnalysis") {
            const vitalsStatistics = await getVitalsStatistics(deviceId);
            logger.debug(`${logPrefix} vitalsStatistics: ${JSON.stringify(vitalsStatistics)}`);
            const diagnosis = makeDiagnosis(vitalsStatistics);
            result = await pipeline(question, sources, interactions, vitalsStatistics, diagnosis);

            await createInteraction(
                db,
                constant.interactionType.dataAnalysis,
                sessionId,
                deviceId,
                question,
                result.rephrasedQuestion ?? null,
                result.answer,
                result.chunks ?? null,
                vitalsStatistics,
                diagnosis
            );

            payload = {
                question,
                rephrasedQuestion: result.rephrasedQuestion,
                answer: result.answer,
                chunks: result.chunks,
                vitalsStatistics,
                diagnosis,
            };
        } else {
            result = await pipeline(question, sources, interactions);

            const interactionType =
                plan === "chat" ? constant.interactionType.chat :
                plan === "rag" ? constant.interactionType.rag :
                constant.interactionType.ragWithRephrasing;

            await createInteraction(
                db,
                interactionType,
                sessionId,
                deviceId,
                question,
                result.rephrasedQuestion ?? null,
                result.answer,
                result.chunks ?? null,
                null,
                null
            );

            payload = { question, ...result };
        }

        logger.info(`${logPrefix} Interaction processed successfully`);
        return res.status(200).json(payload);
    } catch (err) {
        logger.error(`${logPrefix} ${err?.name} ${err?.message}`, { stack: err?.stack });
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function submitInteractionHandler(req, res) {
    const logPrefix = "| submitInteractionHandler |";
    try {
        logger.info(`${logPrefix} Submit interaction request received`);
        const body = req.body || {};
        const { valid, errors } = validateSubmitInteractionRequest(body);
        if (!valid) return res.status(400).json({ error: "Invalid request body", details: errors });
        const { deviceId, sessionId, question, answer } = body;
        
        const db = await getMongoDb();
        const device = await getDevice(db, deviceId);

        if (!device) return res.status(400).json({ error: "Device not found" });

        const session = await getSession(db, sessionId);

        if (!session) return res.status(400).json({ error: "Session not found" });
        if (session.status !== constant.sessionStatus.active) return res.status(400).json({ error: "Session not inactive" });
        if (session.deviceId !== deviceId) return res.status(400).json({ error: "Session does not belong to device" });

        await createInteraction(db, constant.interactionType.edge, sessionId, deviceId, question, '', answer);
        logger.info(`${logPrefix} Interaction processed successfully`);
        return res.status(200).json();

    } catch (err) {
        logger.error(`${logPrefix} ${err?.name} ${err?.message}`, { stack: err?.stack });
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
