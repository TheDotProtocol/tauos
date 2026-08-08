/**
 * Minimal JSON Schema shape for tool input/output contracts.
 * Full validation is deferred to AI-6.
 */

export type JSONSchema = {
  type?: string | string[];
  description?: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: unknown[];
  additionalProperties?: boolean | JSONSchema;
  [key: string]: unknown;
};
