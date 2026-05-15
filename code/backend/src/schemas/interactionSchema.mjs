import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true, removeAdditional: "failing" });

const VALID_PLANS = ["chat", "rag", "ragWithRephrasing", "dataAnalysis"];

const askInteractionRequestValidator = ajv.compile({
    type: "object",
    additionalProperties: false,
    required: ["deviceId", "sessionId", "question", "plan"],
    properties: {
        deviceId: { type: "string" },
        sessionId: { type: "string" },
        question: { type: "string" },
        plan: { type: "string", enum: VALID_PLANS }
    }
});

export function validateAskInteractionRequest(data) {
  const valid = askInteractionRequestValidator(data);
  if (valid) return { valid: true };
  return {
    valid: false,
      errors: askInteractionRequestValidator.errors?.map(e => ({
      field: e.instancePath || e.params.missingProperty || "",
      message: e.message,
      keyword: e.keyword
    })) || []
  };
}

const submitInteractionRequestValidator = ajv.compile({
    type: "object",
    additionalProperties: false,
    required: ["deviceId", "sessionId", "question", "answer"],
    properties: {
        deviceId: { type: "string" },
        sessionId: { type: "string" },
        question: { type: "string" },
        answer: { type: "string" }
    }
});

export function validateSubmitInteractionRequest(data) {
    const valid = submitInteractionRequestValidator(data);
    if (valid) return { valid: true };
    return {
        valid: false,
        errors: submitInteractionRequestValidator.errors?.map(e => ({
            field: e.instancePath || e.params.missingProperty || "",
            message: e.message,
            keyword: e.keyword
        })) || []
    };
}
