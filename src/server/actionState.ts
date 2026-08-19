/**
 * Estado compartilhado das Server Actions.
 *
 * Vive fora de adminActions.ts porque um arquivo "use server" só pode
 * exportar funções async — cada export vira um endpoint HTTP. Exportar uma
 * constante de lá quebra o build em tempo de execução.
 */
export type ActionError =
  | "unauthorized"
  | "limit_reached"
  | "invalid"
  | "failed"
  | "invalid_file"
  | "too_large"
  | "slug_taken"
  | "upload_failed";

export interface ActionState {
  error: ActionError | null;
  ok: boolean;
}

export const IDLE: ActionState = { error: null, ok: false };
