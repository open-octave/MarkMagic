import { getSupportedName } from "./utils";

/**
 * Converts Markdown to Jira Markup
 *
 * @param markdown Markdown formatted text
 * @returns Jira markup text
 */
export function markdownToJira(markdown: string): string {
  const SPECIAL_FORMAT_MAP = {
    cite: "??",
    del: "-",
    ins: "+",
    sup: "^",
    sub: "~",
  };

  const CODE_BLOCK_SYNTAX_REGEX = /`{3,}(\w+)?((?:\n|.)+?)`{3,}/g;
  const HEADING_REGEX = /^([#]+)(.*?)$/gm;
  const BOLD_ITALIC_REGEX = /([*_]+)(.*?)\1/g;
  const LIST_REGEX = /^([ \t]*)-\s(.*)$/gm;
  const SPECIAL_FORMAT_REGEX = new RegExp(
    "<(" + Object.keys(SPECIAL_FORMAT_MAP).join("|") + ")>(.*?)</\\1>",
    "g"
  );
  const STRIKETHROUGH_REGEX = /~~(.*?)~~/g;
  const INLINE_CODE_REGEX = /`([^`]+)`/g;
  const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
  const ANGLE_LINK_REGEX = /<([^>]+)>/g;

  return markdown
    .replace(
      CODE_BLOCK_SYNTAX_REGEX,
      (_codeBlock, codeBlockSyntaxType, codeBlockContent) => {
        let code = "{code";
        if (codeBlockSyntaxType) {
          code += ":" + getSupportedName(codeBlockSyntaxType);
        }
        code += "}" + codeBlockContent + "{code}";
        return code;
      }
    )
    .replace(
      HEADING_REGEX,
      (_, level, content) => "h" + level.length + "." + content
    )
    .replace(BOLD_ITALIC_REGEX, (_, wrapper, content) => {
      const to = wrapper.length === 1 ? "_" : "*";
      return to + content + to;
    })
    .replace(LIST_REGEX, (_, level, content) => {
      const depth = Math.floor(level.length / 4 + 1);
      return Array(depth + 1).join("*") + " " + content;
    })
    .replace(
      SPECIAL_FORMAT_REGEX,
      (_, from: keyof typeof SPECIAL_FORMAT_MAP, content) => {
        return SPECIAL_FORMAT_MAP[from] + content + SPECIAL_FORMAT_MAP[from];
      }
    )
    .replace(STRIKETHROUGH_REGEX, "-$1-")
    .replace(INLINE_CODE_REGEX, "{{$1}}")
    .replace(LINK_REGEX, "[$1|$2]")
    .replace(ANGLE_LINK_REGEX, "[$1]");
}
