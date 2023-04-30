import * as ace from "brace";

import "brace/mode/markdown";
import "brace/theme/twilight";

import { MarkMagic } from "./mark-magic";

// ============================
//       Markdown Editor
// ============================

const markdownEditor = ace.edit("markdown-editor");
markdownEditor.$blockScrolling = Infinity;

markdownEditor.getSession().setMode("ace/mode/markdown");
markdownEditor.setTheme("ace/theme/twilight");

function setJira() {
  const jira = MarkMagic.toJira(markdownEditor.getValue());
  jiraEditor.setValue(jira);
}

markdownEditor.on("focus", function () {
  markdownEditor.on("change", setJira);
});
markdownEditor.on("blur", function () {
  markdownEditor.off("change", setJira);
});

// ==========================
//      Jira Editor
// ==========================

const jiraEditor = ace.edit("jira-editor");
jiraEditor.$blockScrolling = Infinity;

jiraEditor.session.setMode("ace/mode/markdown");
jiraEditor.setTheme("ace/theme/twilight");

function setMarkdown() {
  const markdown = MarkMagic.toMarkdown(jiraEditor.getValue());
  markdownEditor.setValue(markdown);
}

jiraEditor.on("focus", function () {
  jiraEditor.on("change", setMarkdown);
});
jiraEditor.on("blur", function () {
  jiraEditor.off("change", setMarkdown);
});
