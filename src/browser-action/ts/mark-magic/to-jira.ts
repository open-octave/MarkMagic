import { getSupportedName } from "./utils";

/**
 * Converts Markdown to Jira Markup
 *
 * @param {string} markdown - Markdown formatted text
 * @returns {string} Jira markup text
 */
export function toJira(markdown: string): string {
  // ---------------------
  // Replace code blocks
  // ---------------------
  const matchCodeBlockWithSyntaxRegex = /`{3,}(\w+)?((?:\n|.)+?)`{3,}/g;
  markdown = markdown.replace(
    matchCodeBlockWithSyntaxRegex,
    (_codeBlock, codeBlockSyntaxType, codeBlockContent) => {
      let code = "{code";

      if (codeBlockSyntaxType) {
        code += ":" + getSupportedName(codeBlockSyntaxType);
      }

      code += "}" + codeBlockContent + "{code}";

      return code;
    }
  );

  // ---------------------
  // Replace headings
  // ---------------------
  markdown = markdown.replace(/^([#]+)(.*?)$/gm, (_, level, content) => {
    return "h" + level.length + "." + content;
  });

  // ---------------------
  // Replace italic/bold
  // ---------------------
  markdown = markdown.replace(/([*_]+)(.*?)\1/g, (_, wrapper, content) => {
    const to = wrapper.length === 1 ? "_" : "*";
    return to + content + to;
  });

  // -------------------------------------
  // Replace lists that use - with spaces
  // -------------------------------------
  markdown = markdown.replace(/^([ \t]*)-\s(.*)$/gm, (_, level, content) => {
    let depth = Math.floor(level.length / 4 + 1);
    return Array(depth + 1).join("*") + " " + content;
  });

  // -------------
  // Replace ???
  // -------------
  const map = {
    cite: "??",
    del: "-",
    ins: "+",
    sup: "^",
    sub: "~",
  };

  markdown = markdown.replace(
    new RegExp("<(" + Object.keys(map).join("|") + ")>(.*?)</\\1>", "g"), // regex to match <sup>content</sup> and <sub>content</sub>
    (_, from: keyof typeof map, content) => {
      const to = map[from];
      return to + content + to;
    }
  );

  // ---------------------------------
  // Replace strikethrough characters
  // ---------------------------------
  markdown = markdown.replace(/~~(.*?)~~/g, "-$1-");

  // ---------------------------------
  // Replace inline code characters
  // ---------------------------------
  markdown = markdown.replace(/`([^`]+)`/g, "{{$1}}");

  // ---------------
  // Replace links
  // ---------------
  markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$1|$2]");

  // ----------------------------
  // Replace <link> with [link]
  // ----------------------------
  markdown = markdown.replace(/<([^>]+)>/g, "[$1]");

  return markdown;
}
