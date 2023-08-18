import * as ace from "brace";

import "brace/mode/markdown";
import "brace/theme/twilight";

import { MarkMagic } from "./mark-magic";

import MarkdownIt from "markdown-it";

const markdownEditor = ace.edit("markdown-editor");
const markdownPreview = document.getElementById("markdown-preview");

const jiraEditor = ace.edit("jira-editor");
const jiraPreview = document.getElementById("jira-preview");

// ============================
//       Markdown Editor
// ============================

markdownEditor.$blockScrolling = Infinity;

markdownEditor.getSession().setUseWrapMode(true);
markdownEditor.setFontSize("10");
markdownEditor.getSession().setMode("ace/mode/markdown");
markdownEditor.setTheme("ace/theme/twilight");

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

function updateMarkdownPreview() {
  const markdown = markdownEditor.getValue();
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  body.innerHTML = md.render(markdown);
}

markdownEditor.on("change", updateMarkdownPreview);

// ==========================
//      Jira Editor
// ==========================

jiraEditor.$blockScrolling = Infinity;

jiraEditor.getSession().setUseWrapMode(true);
jiraEditor.setFontSize("10");
jiraEditor.session.setMode("ace/mode/markdown");
jiraEditor.setTheme("ace/theme/twilight");
jiraEditor.setReadOnly(true);

// function setMarkdown() {
//   const markdown = MarkMagic.toMarkdown(jiraEditor.getValue());
//   markdownEditor.setValue(markdown);
// }

// jiraEditor.on("focus", function () {
//   jiraEditor.on("change", setMarkdown);
// });
// jiraEditor.on("blur", function () {
//   jiraEditor.off("change", setMarkdown);
// });

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

// ==========================
//      Test Data
// ==========================
function test() {
  // TODO matt: remove this
  markdownEditor.setValue(`
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

- Create a list by starting a line with \`+\`, \`-\`, or \`*\`
- Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    - Ac tristique libero volutpat at
    - Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
- Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
4. You can use sequential numbers...
5. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
86. bar


## Code

Inline \`code\`

Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)


## Images

![Minion](https://octodex.github.com/images/minion.png)

## Plugins

The killer feature of \`markdown-it\` is very effective support of
[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O

### [Custom containers](https://github.com/markdown-it/markdown-it-container)

::: warning
*here be dragons*
:::`);

  // TODO matt: remove this
  updateMarkdownPreview();
  setJira();

  // TODO matt: remove this
  updateJiraPreview();
}

test();
