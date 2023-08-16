import * as ace from "brace";

import "brace/mode/markdown";
import "brace/theme/twilight";

import { MarkMagic } from "./mark-magic";

import { marked } from "marked";

const markdownEditor = ace.edit("markdown-editor");
const markdownPreview = document.getElementById("markdown-preview");

const jiraEditor = ace.edit("jira-editor");
const jiraPreview = document.getElementById("jira-preview");

// ============================
//       Markdown Editor
// ============================

markdownEditor.$blockScrolling = Infinity;

markdownEditor.getSession().setMode("ace/mode/markdown");
markdownEditor.setTheme("ace/theme/twilight");

// TODO matt: remove this
markdownEditor.setValue(`### Prerequisite Steps

1. If you have not already, create a local database for \`ams_policy_service_dev\` and populate your \`.env.development.local\` file with the correct connection information. By default, the password and username will be the same as the other local database used for the other services.

### Case: Run the migrations and ensure the tables are created

1. Local run \`pnpm --filter ams-policy-service db:migrate:latest\`
2. Verify that all of the tables mentioned in the [[Policy Service] Policy Schema](https://lucid.app/lucidchart/3be5aae3-7472-4bd9-82bd-6298c93eff1c/edit?invitationId=inv_4f44e205-8364-481f-950c-06957cff8394&page=Tpy1WWJnyO2U#) are created in the \`ams_policy_service_dev\` database.
3. Verify that the tables have the correct columns, data types, foreign keys, and T2 columns where applicable.`);

// ------

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

// ============================
//       Markdown Preview
// ============================

if (!markdownPreview) {
  throw new Error("Markdown preview element not found");
}

const shadow = markdownPreview.attachShadow({ mode: "open" });

const style = document.createElement("style");
style.textContent = `
  body {
    font-size: 60%;
  }
`;
shadow.appendChild(style);

const body = document.createElement("body");
shadow.appendChild(body);

function updatePreview() {
  const markdown = markdownEditor.getValue();
  const html = marked(markdown);
  body.innerHTML = html;
}

markdownEditor.on("change", updatePreview);

// TODO matt: remove this
updatePreview();
setJira();

// ==========================
//      Jira Editor
// ==========================

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

// ==========================
//      Jira Preview
// ==========================
if (!jiraPreview) {
  throw new Error("Jira preview element not found");
}

const jiraShadow = jiraPreview.attachShadow({ mode: "open" });

const jiraStyle = document.createElement("style");
jiraStyle.textContent = `
  body {
    font-size: 60%;
  }
`;
jiraShadow.appendChild(jiraStyle);

const jiraBody = document.createElement("body");
jiraShadow.appendChild(jiraBody);

function updateJiraPreview() {
  const jira = jiraEditor.getValue();
  const html = MarkMagic.jiraToHtml(jira);
  jiraBody.innerHTML = html;
}

jiraEditor.on("change", updateJiraPreview);

// TODO matt: remove this
updateJiraPreview();
