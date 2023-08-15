// import { toJira } from "./to-jira";
import { markdownToJira } from "./markdown-to-jira";
import { toMarkdown } from "./to-markdown";

export const MarkMagic = {
  // toJira
  toJira: markdownToJira,
  toMarkdown,
};

export default MarkMagic;
