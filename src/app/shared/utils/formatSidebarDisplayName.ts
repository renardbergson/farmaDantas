/**
 * Exibe os dois primeiros nomes; se houver mais palavras, acrescenta "...".
 */
export function formatSidebarDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length <= 2) {
    return parts.join(' ');
  }

  return `${parts[0]} ${parts[1]}`;
}
