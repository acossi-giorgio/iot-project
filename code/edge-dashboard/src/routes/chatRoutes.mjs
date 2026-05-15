import express from 'express';
import { requireSession } from '../middleware/sessionMiddleware.mjs';
import { handleChatMessage } from '../services/chatService.mjs';
import { logger } from '../config/logger.mjs';

export const router = express.Router();

router.post('/send', requireSession, express.json(), async (req, res) => {
  const logPrefix = '| POST /chat/send |';
  const sessionId = res.locals.sessionId || req.query.sessionId;
  try {
    logger.info(`${logPrefix} Start request received`);
    const { message, plan } = req.body || {};
    const result = await handleChatMessage(sessionId, message, plan);
    res.status(200).json(result);
  } catch (e) {
    logger.error(`${logPrefix} ${e?.name} ${e?.message}`, { stack: e?.stack });
    res.status(500).json({ error: { name: e.name, message: e.message, stack: e.stack } });
  }
});
