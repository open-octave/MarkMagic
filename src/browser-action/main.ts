import * as ace from "brace";

import "brace/mode/markdown";
import "brace/theme/twilight";

import * as MarkMagic from "./logic";

const markdownEditor = ace.edit("markdown-editor");

const jiraEditor = ace.edit("jira-editor");

// ============================
//       Markdown Editor
// ============================

markdownEditor.$blockScrolling = Infinity;

markdownEditor.getSession().setUseWrapMode(true);
markdownEditor.setFontSize("10");
markdownEditor.getSession().setMode("ace/mode/markdown");
markdownEditor.setTheme("ace/theme/twilight");

function setJira() {
  const jira = MarkMagic.markdownToJira(markdownEditor.getValue());
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

jiraEditor.$blockScrolling = Infinity;

jiraEditor.getSession().setUseWrapMode(true);
jiraEditor.setFontSize("10");
jiraEditor.session.setMode("ace/mode/markdown");
jiraEditor.setTheme("ace/theme/twilight");
jiraEditor.setReadOnly(true);
(jiraEditor.renderer as any).$cursorLayer.element.style.display = "none";

// ==========================
//      Actions Buttons
// ==========================

// Copy Jira Markup to Clipboard
const copyJiraButton = document.getElementById("copy-jira-button");
if (!copyJiraButton) {
  throw new Error("Copy Jira button not found");
}

const copyAlertButton = document.getElementById("copy-alert");
if (!copyAlertButton) {
  throw new Error("Copy Alert button not found");
}

copyJiraButton.addEventListener("click", function () {
  const jira = jiraEditor.getValue();
  navigator.clipboard.writeText(jira);

  copyAlertButton.classList.remove("hidden");
  setTimeout(function () {
    copyAlertButton.classList.add("hidden");
  }, 3000);
});

// Clear All Button
const clearAllButton = document.getElementById("clear-all-button");
if (!clearAllButton) {
  throw new Error("Clear All button not found");
}

clearAllButton.addEventListener("click", function () {
  markdownEditor.setValue("");
  jiraEditor.setValue("");
});
