import { getSupportedName } from "./utils";

/**
 * Converts Jira Markup to GitHub Flavored Markdown
 *
 * @param {string} jira - Jira markup text
 * @returns {string} Markdown formatted text
 */
export function toMarkdown(jira: string): string {
  // ---------------------
  // Replace code blocks
  // ---------------------
  const matchCodeBlockWithSyntaxRegex =
    /\{code(?:\:(\w+))?\}((?:\n|.)+?)\{code\}/g;
  jira = jira.replace(
    matchCodeBlockWithSyntaxRegex,
    (_codeBlock, codeBlockSyntaxType, codeBlockContent) => {
      let code = "```";

      if (codeBlockSyntaxType) {
        code += codeBlockSyntaxType;
      }

      code += codeBlockContent + "```";

      return code;
    }
  );

  // ---------------------
  // Replace headings
  // ---------------------
  jira = jira.replace(/^h([1-6])\.(.*?)$/gm, (_, level, content) => {
    return "#".repeat(parseInt(level)) + content;
  });

  // --------------------------------------------------------------------------------------------------------
  // Replace bold characters (!!! Bold replaced first to avoid conflicts with post replacement italics !!!)
  // // --------------------------------------------------------------------------------------------------------
  jira = jira.replace(/\*(\w[\w|" "]+\w)\*/g, "**$1**");

  // ---------------------------
  // Replace italics characters
  // ---------------------------
  jira = jira.replace(/_(\w[\w|" "]+\w)_/g, "*$1*");

  // ----------------------------------
  // Replace strikethrough characters
  // ----------------------------------
  jira = jira.replace(/\s-(\w[\w|" "]+\w)-\s/g, (match, groupOne) => {
    return match.replaceAll("-", "~~");
  });

  // ----------------------------
  // Replace lists with bullets
  // ----------------------------
  jira = jira.replace(/(^\*+\s)(.+)/gm, (match, groupOne, groupTwo) => {
    const prefix = "\t".repeat(groupOne.length - 2) + "- ";
    match = prefix + groupTwo;

    return match;
  });

  // ---------------------------------
  // Replace inline code characters
  // ---------------------------------
  jira = jira.replace(/\{\{([^}]+)\}\}/g, "`$1`");

  // ---------------
  // Replace links
  // ---------------
  jira = jira.replace(/\[([^\]]+)\|([^\]]+)\]/g, "[$1]($2)");

  // ----------------------------
  // Replace [link] with <link>
  // ----------------------------
  jira = jira.replace(/\[([^\]]+)\]/g, "<$1>");

  return jira;
}
