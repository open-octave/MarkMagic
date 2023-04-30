import * as ace from "brace";
import * as J2M from "j2m";

// To fix the J2M module I needed to make the export not set J2M to the window

import "brace/mode/markdown";
import "brace/theme/twilight";

// ==========================
//       Shared Logic
// ==========================

function setMarkdown() {
  const markdown = J2M.toM(jiraEditor.getValue());
  markdownEditor.setValue(markdown);
}

function setJira() {
  const jira = J2M.toJ(markdownEditor.getValue());
  jiraEditor.setValue(jira);
}

// ==========================
//       Input Editor
// ==========================

const markdownEditor = ace.edit("editor-input");

markdownEditor.getSession().setMode("ace/mode/markdown");
markdownEditor.setTheme("ace/theme/twilight");

markdownEditor.on("focus", function () {
  markdownEditor.on("change", setJira);
});
markdownEditor.on("blur", function () {
  markdownEditor.off("change", setJira);
});

// ==========================
//      Output Editor
// ==========================

const jiraEditor = ace.edit("editor-output");

jiraEditor.session.setMode("ace/mode/markdown");
jiraEditor.setTheme("ace/theme/twilight");

jiraEditor.on("focus", function () {
  jiraEditor.on("change", setMarkdown);
});
jiraEditor.on("blur", function () {
  jiraEditor.off("change", setMarkdown);
});
