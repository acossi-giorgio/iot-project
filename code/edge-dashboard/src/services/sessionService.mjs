import fetch from 'node-fetch';
import { getRedis } from '../config/redis.mjs';
import { env } from '../config/env.mjs';
import { logger } from '../config/logger.mjs';
import { v4 as uuidv4 } from 'uuid';

async function startSessionRequest() {
  const logPrefix = '| startSessionRequest |';
  const base = env.backendBaseUrl;
  const url = `${base}/session/start`;
  const body = { deviceId: env.deviceId };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      logger.error(`${logPrefix} create session failed status=${response.status} body=${body}`);
      return { sessionId: uuidv4(), offline: true };
    }
    const jsonResponse = await response.json();
    if (!jsonResponse.sessionId) throw new Error('missing sessionId in response');
    return { sessionId: jsonResponse.sessionId, offline: false };
  } catch (e) {
    logger.error(`${logPrefix} create session failed offline mode: ${e.message}`);
    return { sessionId: uuidv4(), offline: true };
  }
}

async function closeSessionRequest(sessionId) {
  const logPrefix = '| closeSessionRequest |';
  const base = env.backendBaseUrl;
  const url = `${base}/session/end`;
  const body = { deviceId: env.deviceId, sessionId: sessionId };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`end session failed status ${response.status}`);
  } catch (e) {
    logger.error(`${logPrefix} delete session failed: ${e.message}`);
  }
}

async function setSession(sessionId) {
  const client = await getRedis();
  const ttlSeconds = env.sessionTtlSeconds; 
  await client.set("sessionId", sessionId, { EX: ttlSeconds });
}

async function setOfflineMode(isOffline) {
  const client = await getRedis();
  await client.set(env.data.offlineMode, isOffline.toString());
}

async function deleteSession() {
  const client = await getRedis();
  await client.del(env.data.sessionId);
  await client.del(env.data.offlineMode);
}

async function getSession() {
  const client = await getRedis();
  return await client.get(env.data.sessionId);
}

export async function startSession() {
  const { sessionId, offline } = await startSessionRequest();
  await setSession(sessionId);
  await setOfflineMode(offline);
  return { sessionId, offline };
}

export async function endSession(sessionId) {
  if (!sessionId) return;
  await closeSessionRequest(sessionId);
  await deleteSession();
}

export async function hasSession(id) {
  const currentSessionId = await getSession();
  if (!currentSessionId) return false;
  return currentSessionId === id;
}