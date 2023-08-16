/**
 * Converts Jira Markup to HTML
 *
 * @param jira Jira formatted text
 * @returns HTML text
 */
export function jiraToHtml(jira: string): string {
  const CODE_BLOCK_SYNTAX_REGEX = /\{code:(\w+)?\}((?:\n|.)+?)\{code\}/g;
  const HEADING_REGEX = /^h([1-6])\.(.*?)$/gm;
  const BOLD_REGEX = /\*(.*?)\*/g;
  const ITALIC_REGEX = /_(.*?)_/g;
  const LIST_REGEX = /^(\**)\s(.*)$/gm;
  const SPECIAL_FORMAT_MAP = {
    "??": "cite",
    "-": "del",
    "+": "ins",
    "^": "sup",
    "~": "sub",
  };
  const SPECIAL_FORMAT_REGEX = new RegExp(
    "(" +
      Object.keys(SPECIAL_FORMAT_MAP)
        .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|") +
      ")(.*?)\\1",
    "g"
  );
  const STRIKETHROUGH_REGEX = /-(.*?)-/g;
  const INLINE_CODE_REGEX = /\{\{(.*?)\}\}/g;
  const LINK_REGEX = /\[(.*?)(?:\|(.*?))?\]/g;

  return jira
    .replace(CODE_BLOCK_SYNTAX_REGEX, (match, lang, codeContent) => {
      if (lang) {
        return `<pre><code class="${lang}">${codeContent}</code></pre>`;
      }
      return `<pre><code>${codeContent}</code></pre>`;
    })
    .replace(
      HEADING_REGEX,
      (match, level, content) => `<h${level}>${content}</h${level}>`
    )
    .replace(BOLD_REGEX, "<strong>$1</strong>")
    .replace(ITALIC_REGEX, "<em>$1</em>")
    .replace(LIST_REGEX, (match, stars, content) => {
      const depth = stars.length;
      return "<li>" + content + "</li>".padStart(depth * 4 + 4, " ");
    })
    .replace(
      SPECIAL_FORMAT_REGEX,
      (_match, format: keyof typeof SPECIAL_FORMAT_MAP, content) => {
        const tag = SPECIAL_FORMAT_MAP[format];
        return `<${tag}>${content}</${tag}>`;
      }
    )
    .replace(STRIKETHROUGH_REGEX, "<del>$1</del>")
    .replace(INLINE_CODE_REGEX, "<code>$1</code>")
    .replace(LINK_REGEX, (_match, textOrUrl, url) => {
      if (url) {
        return `<a href="${url}">${textOrUrl}</a>`;
      }
      return `<a href="${textOrUrl}">${textOrUrl}</a>`;
    });
}
