import sanitizeHtml from "sanitize-html";
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

  const MULTI_LINE_CODE_BLOCK_SYNTAX_REGEX =
    /`{3,}\s?(\w+)?\n((?:\n|.)+?)`{3,}/g;
  const SINGLE_LINE_CODE_BLOCK_SYNTAX_REGEX = /`([^`]+)`/g;
  const HEADING_REGEX = /^([#]+)(.*?)$/gm;
  const BOLD_ITALIC_REGEX = /([*_]+)(.*?)\1/g;
  const LIST_REGEX = /^([ \t]*)-\s(.*)$/gm;
  const SPECIAL_FORMAT_REGEX = new RegExp(
    "<(" + Object.keys(SPECIAL_FORMAT_MAP).join("|") + ")>(.*?)</\\1>",
    "g"
  );
  const STRIKETHROUGH_REGEX = /~~(.*?)~~/g;
  const INLINE_CODE_REGEX = /`([^`]+)`/g;
  const LINK_REGEX = /\[(.*)\]\(([^)]+)\)/g;
  const ANGLE_LINK_REGEX = /<([^>]+)>/g;
  const HORIZONTAL_RULE_REGEX = /^(?:___|---|\*\*\*)$/gm;
  const BLOCK_QUOTE_REGEX = /^>[\s>|>]* (.*)$/gm;
  const IMAGE_REGEX = /!\[.*\]\((.*)\)/g;

  let jira = markdown
    .replace(MULTI_LINE_CODE_BLOCK_SYNTAX_REGEX, replaceMultiLineCodeBlock)
    .replace(SINGLE_LINE_CODE_BLOCK_SYNTAX_REGEX, replaceSingleLineCodeBlock)
    .replace(IMAGE_REGEX, "!$1!")
    .replace(HORIZONTAL_RULE_REGEX, "----")
    .replace(BLOCK_QUOTE_REGEX, "{quote}\n$1\n{quote}\n")
    .replace(
      HEADING_REGEX,
      (_, level, content) => "h" + level.length + "." + content
    )
    .replace(BOLD_ITALIC_REGEX, (_, wrapper, content) => {
      const to = wrapper.length === 1 ? "_" : "*";
      return to + content + to;
    })
    .replace(LIST_REGEX, (_, level, content) => {
      const depth = Math.floor(level.length / 2 + 1);
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
    .replace(LINK_REGEX, replaceLinks)
    .replace(ANGLE_LINK_REGEX, "[$1]");

  jira = replaceTables(jira);

  return jira;
}

/**
 * Replaces Jira table syntax with markdown table syntax.
 * @param jira - The Jira table to be replaced.
 * @returns The Jira table as a markdown table.
 */
export function replaceTables(jira: string) {
  const jiraAsArray = jira.split("\n");

  jiraAsArray.forEach((line, index) => {
    if (line.startsWith("| -")) {
      jiraAsArray[index - 1] = jiraAsArray[index - 1].replaceAll("|", "||");
      jiraAsArray.splice(index, 1);
    }
  });

  jira = jiraAsArray.join("\n");

  return jira;
}

/**
 * Replaces a multi-line code block in markdown syntax with Jira syntax.
 * @param _codeBlock The original code block in markdown syntax.
 * @param codeBlockSyntaxType The syntax type of the code block, if any.
 * @param codeBlockContent The content of the code block.
 * @returns The code block in Jira syntax.
 */
export function replaceMultiLineCodeBlock(
  _codeBlock: string,
  codeBlockSyntaxType: string,
  codeBlockContent: string
) {
  let code = "{code";

  if (codeBlockSyntaxType) {
    code += ":" + getSupportedName(codeBlockSyntaxType);
  }
  code += "}\n" + codeBlockContent + "{code}\n";

  return code;
}

/**
 * Replaces a single line code block with Jira code block syntax.
 * @param _codeBlock - The original markdown code block (unused).
 * @param codeBlockContent - The content of the code block.
 * @returns The Jira-formatted code block.
 */
export function replaceSingleLineCodeBlock(
  _codeBlock: string,
  codeBlockContent: string
) {
  return `{{{color:#ff8b00}${codeBlockContent}{color}}}`;
}

/**
 * Replaces a markdown link syntax with a Jira link syntax.
 * @param _link - Unused parameter.
 * @param linkText - The text of the markdown link.
 * @param linkUrl - The URL of the markdown link.
 * @returns The Jira link with the sanitized link text.
 */
export function replaceLinks(_link: string, linkText: string, linkUrl: string) {
  let cleansedLinkText = linkText.replaceAll("[", "").replaceAll("]", "");

  cleansedLinkText = sanitizeHtml(cleansedLinkText);

  return `[${cleansedLinkText}|${linkUrl}]`;
}
