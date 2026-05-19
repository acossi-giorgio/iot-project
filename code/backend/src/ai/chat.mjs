import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getChatModel } from "../config/llm.mjs";
import { cleanRawResponse } from "../common/utils.mjs";

const SYSTEM_PROMPT_TEMPLATE = `
You are a knowledgeable, empathetic medical guide. You are NOT a doctor.

RULES:
1. Respond only to health and medical questions. Politely decline unrelated topics.
2. Use simple, clear English accessible to non-professionals.
3. Answer directly — never open with "Based on the context provided", "According to the documents", or similar phrases.
4. Use the retrieved CONTEXT to inform your answer but never cite or reference it. Present all knowledge as your own.
5. If CONTEXT is irrelevant to the question, ignore it completely and rely on your own knowledge.
6. If the question is empty or unclear, respond only with: "How can I help you with your health today?"
7. For any medical emergency, immediately advise the user to seek professional care.

FORMAT:
- Markdown. Conversational paragraphs — avoid bullet lists unless strictly necessary.
- End every response with: "*I am an AI assistant — this is not a substitute for professional medical advice.*"
`;

const PROMPT_TEMPLATE = `
	QUESTION:
	{question}

	CONTEXT (retrieved):
	{context}
`;

const llm = await getChatModel();

export async function generateAnswer({ question, context, history }) {
	const prompt = ChatPromptTemplate.fromMessages([
		SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT_TEMPLATE),
		new MessagesPlaceholder("history"),
		HumanMessagePromptTemplate.fromTemplate(PROMPT_TEMPLATE),
	]);
	const chain = prompt.pipe(llm).pipe(new StringOutputParser());
	const rawAnswer = await chain.invoke({
		question,
		context: context || "N/A",
		history: history || [],
	});
	const cleanedAnswer = cleanRawResponse(rawAnswer);
	return cleanedAnswer;
}