/** UI-only build: the persona prompts live with the backend, so there is nothing to register here. */

export async function ensurePersona(presetId: string): Promise<string | undefined> {
  return presetId;
}
