import { getRedis } from '../config/redis.mjs';
import { classifyDomain } from '../ai/classifier.mjs';
import { env } from '../config/env.mjs';
import fetch from 'node-fetch';

function key(sessionId) {
  return `${sessionId}:${env.data.chat}`;
}

async function submitInteraction(sessionId, question, answer) {
  const response = await fetch(`${env.backendBaseUrl}/interaction/submit`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ deviceId: env.deviceId, sessionId, question, answer })
  });
  if (!response.ok) throw new Error(`submit interaction failed with status ${response.status}`);
  return;
}

async function askInteraction(sessionId, question, plan = 'ragWithRephrasing') {
  const url = `${env.backendBaseUrl}/interaction/ask`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ deviceId: env.deviceId, sessionId, question, plan })
  });
  if (!response.ok) throw new Error(`ask interaction failed with status ${response.status}, body: ${await response.text()}`);
  return response.json();
}

export async function addUserMessage(sessionId, content, plan = 'ragWithRephrasing') {
  const client = await getRedis();
  const entry = JSON.stringify({ role: 'user', content, ts: Date.now(), plan });
  await client.rPush(key(sessionId), entry);
}

export async function addBotMessage(sessionId, content) {
  const client = await getRedis();
  const entry = JSON.stringify({ role: 'bot', content, ts: Date.now() });
  await client.rPush(key(sessionId), entry);
}

export async function getMessages(sessionId) {
  const client = await getRedis();
  const raw = await client.lRange(key(sessionId), 0, -1);
  const messages = raw.map(m => {
    try { return JSON.parse(m); } catch { return m; }
  });
  
  if (messages.length === 0) {
    const welcomeMessage = {
      role: 'bot',
      content: env.welcomeMessage,
      ts: Date.now()
    };
    await client.rPush(key(sessionId), JSON.stringify(welcomeMessage));
    messages.push(welcomeMessage);
  }
  
  return messages;
}

export async function deleteChat(sessionId) {
  const client = await getRedis();
  await client.del(key(sessionId));
}

export async function handleChatMessage(sessionId, rawMessage, plan = 'ragWithRephrasing') {
  const message = rawMessage.trim();
  if(!message) throw new Error('empty message');

  const messages = await getMessages(sessionId);
  const userHistory = messages
    .filter(m => m.role === 'user')
    .map(m => m.content);

  await addUserMessage(sessionId, message, plan);

  let domainResult = { valid: true };
  if(env.intentDetectionEnabled) {
     console.log('Classifying domain');
     domainResult = await classifyDomain(message, userHistory);
  }
  if (!domainResult.valid) {
    const rejectionMessage = domainResult.message;
    await addBotMessage(sessionId, rejectionMessage);
    await submitInteraction(sessionId, message, rejectionMessage);
    return { answer: rejectionMessage, rejected: true };
  }
  else {
    const { answer, chunks } = await askInteraction(sessionId, message, plan);
    await addBotMessage(sessionId, answer);
    return { answer, chunks };
  }
}