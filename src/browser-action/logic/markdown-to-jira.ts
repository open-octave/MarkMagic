import sanitizeHtml from "sanitize-html";
import { getSupportedName } from "./utils";

/**
 * Converts Markdown to Jira Markup
 *
 * @param markdown Markdown formatted text
 * @returns Jira markup text
 */
export function markdownToJira(markdown: string): string {
  const SPECIAL_FORMAT_MAP = {
    cite: "??",
    del: "-",
    ins: "+",
    sup: "^",
    sub: "~",
  };

  const MULTI_LINE_CODE_BLOCK_SYNTAX_REGEX =
    /`{3,}\s?(\w+)?\n((?:\n|.)+?)`{3,}/g;
  const SINGLE_LINE_CODE_BLOCK_SYNTAX_REGEX = /`([^`]+)`/g;
  const HEADING_REGEX = /^([#]+)(.*?)$/gm;
  const BOLD_ITALIC_REGEX = /([*_]+)(.*?)\1/g;
  const LIST_REGEX = /^([ \t]*)-\s(.*)$/gm;
  const SPECIAL_FORMAT_REGEX = new RegExp(
    "<(" + Object.keys(SPECIAL_FORMAT_MAP).join("|") + ")>(.*?)</\\1>",
    "g"
  );
  const STRIKETHROUGH_REGEX = /~~(.*?)~~/g;
  const INLINE_CODE_REGEX = /`([^`]+)`/g;
  const LINK_REGEX = /\[(.*)\]\(([^)]+)\)/g;
  const ANGLE_LINK_REGEX = /<([^>]+)>/g;
  const HORIZONTAL_RULE_REGEX = /^(?:___|---|\*\*\*)$/gm;
  const BLOCK_QUOTE_REGEX = /^>[\s>|>]* (.*)$/gm;
  const IMAGE_REGEX = /!\[.*\]\((.*)\)/g;

  let jira = markdown
    .replace(MULTI_LINE_CODE_BLOCK_SYNTAX_REGEX, replaceMultiLineCodeBlock)
    .replace(SINGLE_LINE_CODE_BLOCK_SYNTAX_REGEX, replaceSingleLineCodeBlock)
    .replace(IMAGE_REGEX, "!$1!")
    .replace(HORIZONTAL_RULE_REGEX, "----")
    .replace(BLOCK_QUOTE_REGEX, "{quote}\n$1\n{quote}\n")
    .replace(
      HEADING_REGEX,
      (_, level, content) => "h" + level.length + "." + content
    )
    .replace(BOLD_ITALIC_REGEX, (_, wrapper, content) => {
      const to = wrapper.length === 1 ? "_" : "*";
      return to + content + to;
    })
    .replace(LIST_REGEX, (_, level, content) => {
      const depth = Math.floor(level.length / 2 + 1);
      return Array(depth + 1).join("*") + " " + content;
    })
    .replace(
      SPECIAL_FORMAT_REGEX,
      (_, from: keyof typeof SPECIAL_FORMAT_MAP, content) => {
        return SPECIAL_FORMAT_MAP[from] + content + SPECIAL_FORMAT_MAP[from];
      }
    )
    .replace(STRIKETHROUGH_REGEX, "-$1-")
    .replace(INLINE_CODE_REGEX, "{{$1}}")
    .replace(LINK_REGEX, replaceLinks)
    .replace(ANGLE_LINK_REGEX, "[$1]");

  jira = replaceTables(jira);

  return jira;
}

/**
 * Replaces Jira table syntax with markdown table syntax.
 * @param jira - The Jira table to be replaced.
 * @returns The Jira table as a markdown table.
 */
export function replaceTables(jira: string) {
  const jiraAsArray = jira.split("\n");

  jiraAsArray.forEach((line, index) => {
    if (line.startsWith("| -")) {
      jiraAsArray[index - 1] = jiraAsArray[index - 1].replaceAll("|", "||");
      jiraAsArray.splice(index, 1);
    }
  });

  jira = jiraAsArray.join("\n");

  return jira;
}

/**
 * Replaces a multi-line code block in markdown syntax with Jira syntax.
 * @param _codeBlock The original code block in markdown syntax.
 * @param codeBlockSyntaxType The syntax type of the code block, if any.
 * @param codeBlockContent The content of the code block.
 * @returns The code block in Jira syntax.
 */
export function replaceMultiLineCodeBlock(
  _codeBlock: string,
  codeBlockSyntaxType: string,
  codeBlockContent: string
) {
  let code = "{code";

  if (codeBlockSyntaxType) {
    code += ":" + getSupportedName(codeBlockSyntaxType);
  }
  code += "}\n" + codeBlockContent + "{code}\n";

  return code;
}

/**
 * Replaces a single line code block with Jira code block syntax.
 * @param _codeBlock - The original markdown code block (unused).
 * @param codeBlockContent - The content of the code block.
 * @returns The Jira-formatted code block.
 */
export function replaceSingleLineCodeBlock(
  _codeBlock: string,
  codeBlockContent: string
) {
  return `{{{color:#ff8b00}${codeBlockContent}{color}}}`;
}

/**
 * Replaces a markdown link syntax with a Jira link syntax.
 * @param _link - Unused parameter.
 * @param linkText - The text of the markdown link.
 * @param linkUrl - The URL of the markdown link.
 * @returns The Jira link with the sanitized link text.
 */
export function replaceLinks(_link: string, linkText: string, linkUrl: string) {
  let cleansedLinkText = linkText.replaceAll("[", "").replaceAll("]", "");

  cleansedLinkText = sanitizeHtml(cleansedLinkText);

  return `[${cleansedLinkText}|${linkUrl}]`;
}

const exampleAllMarkdown = `# h1 Heading 8-)

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rules

---

---

---

## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,, -- ---

"Smartypants, double quotes" and 'single quotes'

## Emphasis

**This is bold text**

**This is bold text**

_This is italic text_

_This is italic text_

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...
>
> > ...by using additional greater-than signs right next to each other...
> >
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
58. bar

## Code

Inline \`code\`

Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\`js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Tables

| Option | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default.    |
| ext    | extension to be used for dest files.                                      |

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
_here be dragons_
:::


\`\`\`ts
function test() {
  // TODO matt: remove this
  markdownEditor.setValue(\`
# h1 Heading 8-)

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rules

---

---

---

## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,, -- ---

"Smartypants, double quotes" and 'single quotes'

## Emphasis

**This is bold text**

**This is bold text**

_This is italic text_

_This is italic text_

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...
>
> > ...by using additional greater-than signs right next to each other...
> >
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
58. bar

## Code

Inline \`code\`

Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\`js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Tables

| Option | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default.    |
| ext    | extension to be used for dest files.                                      |

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
_here be dragons_
:::

  \`);

  // TODO matt: remove this
  updateMarkdownPreview();
  setJira();

  // TODO matt: remove this
  updateJiraPreview();
}

test();

\`\`\``;
// console.log(markdownToJira(exampleAllMarkdown));
const exampleTableMarkdown = `| Option | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default.    |
| ext    | extension to be used for dest files.                                      |`;
console.log(markdownToJira(exampleTableMarkdown));
