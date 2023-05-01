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

  // -------------
  // Replace ???
  // -------------
  // const map = {
  //   "??": "cite",
  //   "-": "del",
  //   "+": "ins",
  //   "^": "sup",
  //   "~": "sub",
  // };

  // jira = jira.replace(
  //   new RegExp("(" + Object.keys(map).join("|") + ")(.*?)\\1", "g"),
  //   (_, from: keyof typeof map, content) => {
  //     const to = map[from];
  //     return `<${to}>${content}</${to}>`;
  //   }
  // );

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

const test = `
h2. QA

{code:javascript}
  const START = "some-text";
  const replacementsList: { key: string; value: string }[] = [];
  let counter = 0;
{code}


* Ensure that there are 3 environments available for testing the form and that they are reading their environment variables correctly
** dev 
***  {{pnpm --filter lead-widget-service dev}}
** qa
*** {{pnpm --filter lead-widget-service build:qa && pnpm --filter lead-widget-service preview}}
** production
*** {{pnpm --filter lead-widget-service build && pnpm --filter lead-widget-service preview}}
* Ensure that the form can be opened and closed
** Form Closing Conditions
*** User clicks the close button
*** User clicks outside of the form
* Ensure that if the grins agent is selected for the referrer field the form conditionally displays the active agents from the agent service request {{/agents/names}} for the user to select from

-strike me-


{code:python}
  START = "some-python-text"
  replacementsList = []
  counter = 0
{code}


{code:none}
  START = "some-unknownSytax-text"
  replacementsList = []
  counter = 0
{code}`;

console.log(toMarkdown(test));
