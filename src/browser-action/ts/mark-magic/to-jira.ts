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
    (match, from: keyof typeof map, content) => {
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

  // ----------------------------
  // Replace 
  // ----------------------------
  // Convert header rows of tables by splitting markdown on lines
  const lines = markdown.split(/\r?\n/gm); // Split on newlines
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

toJira(`## QA

\`\`\`ts
  const START = "J2MBLOCKPLACEHOLDER";
  const replacementsList: { key: string; value: string }[] = [];
  let counter = 0;
\`\`\`


- Ensure that there are 3 environments available for testing the form and that they are reading their environment variables correctly
    - dev 
        -  \`pnpm --filter lead-widget-service dev\`
    - qa
        - \`pnpm --filter lead-widget-service build:qa && pnpm --filter lead-widget-service preview\`
    - production
        - \`pnpm --filter lead-widget-service build && pnpm --filter lead-widget-service preview\`
- Ensure that the form can be opened and closed
    - Form Closing Conditions
        - User clicks the close button
        - User clicks outside of the form
- Ensure that if the grins agent is selected for the referrer field the form conditionally displays the active agents from the agent service request \`/agents/names\` for the user to select from

~~strike me~~


\`\`\`python
  START = "J2MBLOCKPLACEHOLDER"
  replacementsList = []
  counter = 0
\`\`\`
`);
