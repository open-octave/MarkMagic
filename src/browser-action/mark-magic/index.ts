import { jiraToHtml } from "./jira-to-html";
import { markdownToJira } from "./markdown-to-jira";
import { toMarkdown } from "./to-markdown";

export const MarkMagic = {
  toJira: markdownToJira,
  toMarkdown,
  jiraToHtml,
};

export default MarkMagic;
