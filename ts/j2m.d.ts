declare module "j2m" {
  interface J2M {
    /**
     * Takes Jira markup and converts it to Markdown.
     *
     * @param input - Jira markup text
     * @returns Markdown formatted text
     */
    toM(input: string): string;

    /**
     * Takes Markdown and converts it to Jira formatted text
     *
     * @param input
     * @returns Jira formatted text
     */
    toJ(input: string): string;
  }

  const j2m: J2M;

  export = j2m;
}
