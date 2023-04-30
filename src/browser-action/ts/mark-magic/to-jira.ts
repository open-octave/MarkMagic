import { getSupportedName } from "./utils";

/**
 * Converts Markdown to Jira Markup
 *
 * @param {string} markdown - Markdown formatted text
 * @returns {string} Jira markup text
 */
export function toJira(markdown: string): string {
  // remove sections that shouldn't recursively processed
  const START = "J2MBLOCKPLACEHOLDER";
  const replacementsList: { key: string; value: string }[] = [];
  let counter = 0;
 

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
      const key = START + counter++ + "%%";
      replacementsList.push({ key: key, value: code });
      return key;
    }
  );

  markdown = markdown.replace(/^([#]+)(.*?)$/gm, (match, level, content) => {
    return "h" + level.length + "." + content;
  });

  markdown = markdown.replace(/([*_]+)(.*?)\1/g, (match, wrapper, content) => {
    const to = wrapper.length === 1 ? "_" : "*";
    return to + content + to;
  });

  // Make multi-level bulleted lists work
  markdown = markdown.replace(/^(\s*)- (.*)$/gm, (match, level, content) => {
    let len = 2;
    if (level.length > 0) {
      len = level.length / 4.0 + 2;
    }
    return Array(len).join("-") + " " + content;
  });

  const map = {
    cite: "??",
    del: "-",
    ins: "+",
    sup: "^",
    sub: "~",
  };

  markdown = markdown.replace(
    new RegExp("<(" + Object.keys(map).join("|") + ")>(.*?)</\\1>", "g"),
    (match, from: keyof typeof map, content) => {
      const to = map[from];
      return to + content + to;
    }
  );

  markdown = markdown.replace(/~~(.*?)~~/g, "-$1-");

  markdown = markdown.replace(/`([^`]+)`/g, "{{$1}}");

  markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$1|$2]");
  markdown = markdown.replace(/<([^>]+)>/g, "[$1]");

  // restore extracted sections
  for (let i = 0; i < replacementsList.length; i++) {
    const sub = replacementsList[i];
    markdown = markdown.replace(sub["key"], sub["value"]);
  }

  // Convert header rows of tables by splitting markdown on lines
  const lines = markdown.split(/\r?\n/gm);
  const lines_to_remove: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    let line_content = lines[i];

    if (line_content.match(/\|---/g) !== null) {
      lines[i - 1] = lines[i - 1].replace(/\|/g, "||");
      lines.splice(i, 1);
    }
  }

  // Join the split lines back
  markdown = "";
  for (let i = 0; i < lines.length; i++) {
    markdown += lines[i] + "\n";
  }
  return markdown;
}
