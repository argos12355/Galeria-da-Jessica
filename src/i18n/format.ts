/**
 * Interpola `{chave}` nas strings do dicionário.
 * Placeholder sem valor correspondente é mantido cru — some da tela é pior
 * que aparecer errado, porque some sem ninguém perceber.
 */
export function format(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in params ? String(params[key]) : placeholder,
  );
}
