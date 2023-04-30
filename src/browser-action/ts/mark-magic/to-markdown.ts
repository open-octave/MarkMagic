/**
 * Takes Jira markup and converts it to Markdown.
 *
 * @param input - Jira markup text
 * @returns Markdown formatted text
 */
export function toMarkdown(input: string): string {
  input = input.replace(/^h([0-6])\.(.*)$/gm, (match, level, content) => {
    return Array(parseInt(level) + 1).join("#") + content;
  });

  input = input.replace(/([*_])(.*)\1/g, (match, wrapper, content) => {
    const to = wrapper === "*" ? "**" : "*";
    return to + content + to;
  });

  input = input.replace(/\{\{([^}]+)\}\}/g, "`$1`");
  input = input.replace(/\?\?((?:.[^?]|[^?].)+)\?\?/g, "<cite>$1</cite>");
  input = input.replace(/\+([^+]*)\+/g, "<ins>$1</ins>");
  input = input.replace(/\^([^^]*)\^/g, "<sup>$1</sup>");
  input = input.replace(/~([^~]*)~/g, "<sub>$1</sub>");
  input = input.replace(/-([^-]*)-/g, "-$1-");

  input = input.replace(/\{code(:([a-z]+))?\}([^]*)\{code\}/gm, "```$2$3```");

  input = input.replace(/\[(.+?)\|(.+)\]/g, "[$1]($2)");
  input = input.replace(/\[(.+?)\]([^\(]*)/g, "<$1>$2");

  input = input.replace(/{noformat}/g, "```");

  // Convert header rows of tables by splitting input on lines
  const lines = input.split(/\r?\n/gm);
  const lines_to_remove: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    let line_content = lines[i];

    const seperators = line_content.match(/\|\|/g);
    if (seperators !== null) {
      lines[i] = lines[i].replace(/\|\|/g, "|");

      // Add a new line to mark the header in Markdown,
      // we require that at least 3 -'s are between each |
      let header_line = "";
      for (let j = 0; j < seperators.length - 1; j++) {
        header_line += "|---";
      }

      header_line += "|";

      lines.splice(i + 1, 0, header_line);
    }
  }

  // Join the split lines back
  input = "";
  for (let i = 0; i < lines.length; i++) {
    input += lines[i] + "\n";
  }

  return input;
}
