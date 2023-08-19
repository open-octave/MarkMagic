export type Language = {
  supportedName: string;
  languageIdentifiers: string[];
  fileExtensions: string[];
};

export type LanguagesMap = {
  [key: string]: Language;
};

export const codeBlockSupportedLanguages: LanguagesMap = {
  ActionScript: {
    supportedName: "actionscript",
    languageIdentifiers: [
      "ActionScript",
      "actionScript",
      "action_script",
      "action-script",
    ],
    fileExtensions: ["as"],
  },
  Ada: {
    supportedName: "ada",
    languageIdentifiers: ["Ada", "ada", "ada", "ada"],
    fileExtensions: ["adb", "ads"],
  },
  AppleScript: {
    supportedName: "applescript",
    languageIdentifiers: [
      "AppleScript",
      "appleScript",
      "apple_script",
      "apple-script",
    ],
    fileExtensions: ["applescript", "scpt"],
  },
  bash: {
    supportedName: "bash",
    languageIdentifiers: ["Bash", "bash", "bash", "bash"],
    fileExtensions: ["sh", "bash"],
  },
  C: {
    supportedName: "c",
    languageIdentifiers: ["C", "c", "c", "c"],
    fileExtensions: ["c"],
  },
  "C#": {
    supportedName: "c#",
    languageIdentifiers: ["C#", "c#", "c_#", "c-#"],
    fileExtensions: ["cs"],
  },
  "C++": {
    supportedName: "c++",
    languageIdentifiers: ["C++", "c++", "c_+_+", "c-+-+"],
    fileExtensions: ["cpp", "hpp", "cxx", "hxx"],
  },
  CSS: {
    supportedName: "css",
    languageIdentifiers: ["CSS", "css", "css", "css"],
    fileExtensions: ["css"],
  },
  Erlang: {
    supportedName: "erlang",
    languageIdentifiers: ["Erlang", "erlang", "erlang", "erlang"],
    fileExtensions: ["erl", "hrl"],
  },
  Go: {
    supportedName: "go",
    languageIdentifiers: ["Go", "go", "go", "go"],
    fileExtensions: ["go"],
  },
  Groovy: {
    supportedName: "groovy",
    languageIdentifiers: ["Groovy", "groovy", "groovy", "groovy"],
    fileExtensions: ["groovy", "gradle"],
  },
  Haskell: {
    supportedName: "haskell",
    languageIdentifiers: ["Haskell", "haskell", "haskell", "haskell"],
    fileExtensions: ["hs", "lhs"],
  },
  HTML: {
    supportedName: "html",
    languageIdentifiers: ["HTML", "html", "html", "html"],
    fileExtensions: ["html", "htm"],
  },
  Java: {
    supportedName: "java",
    languageIdentifiers: ["Java", "java", "java", "java"],
    fileExtensions: ["java"],
  },
  JavaScript: {
    supportedName: "javascript",
    languageIdentifiers: [
      "JavaScript",
      "javaScript",
      "java_script",
      "java-script",
    ],
    fileExtensions: ["js"],
  },
  TypesScript: {
    supportedName: "javascript",
    languageIdentifiers: ["TypeScript", "typeScript"],
    fileExtensions: ["ts"],
  },
  JSON: {
    supportedName: "json",
    languageIdentifiers: ["JSON", "json", "json", "json"],
    fileExtensions: ["json"],
  },
  Lua: {
    supportedName: "lua",
    languageIdentifiers: ["Lua", "lua", "lua", "lua"],
    fileExtensions: ["lua"],
  },
  Nyan: {
    supportedName: "nyan",
    languageIdentifiers: ["Nyan", "nyan", "nyan", "nyan"],
    fileExtensions: ["nyan"],
  },
  Objc: {
    supportedName: "objc",
    languageIdentifiers: ["ObjC", "objC", "obj_c", "obj-c"],
    fileExtensions: ["m", "h"],
  },
  Perl: {
    supportedName: "perl",
    languageIdentifiers: ["Perl", "perl", "perl", "perl"],
    fileExtensions: ["pl", "pm", "t"],
  },
  PHP: {
    supportedName: "php",
    languageIdentifiers: ["PHP", "php", "php", "php"],
    fileExtensions: ["php", "php3", "php4", "php5", "php7", "phtml"],
  },
  Python: {
    supportedName: "python",
    languageIdentifiers: ["Python", "python", "python", "python"],
    fileExtensions: ["py", "pyw"],
  },
  R: {
    supportedName: "r",
    languageIdentifiers: ["R", "r", "r", "r"],
    fileExtensions: ["r", "R"],
  },
  Ruby: {
    supportedName: "ruby",
    languageIdentifiers: ["Ruby", "ruby", "ruby", "ruby"],
    fileExtensions: ["rb", "rbw"],
  },
  Scala: {
    supportedName: "scala",
    languageIdentifiers: ["Scala", "scala", "scala", "scala"],
    fileExtensions: ["scala"],
  },
  SQL: {
    supportedName: "sql",
    languageIdentifiers: ["SQL", "sql", "sql", "sql"],
    fileExtensions: ["sql"],
  },
  Swift: {
    supportedName: "swift",
    languageIdentifiers: ["Swift", "swift", "swift", "swift"],
    fileExtensions: ["swift"],
  },
  VisualBasic: {
    supportedName: "visualbasic",
    languageIdentifiers: [
      "VisualBasic",
      "visualBasic",
      "visual_basic",
      "visual-basic",
    ],
    fileExtensions: ["vb", "vbs"],
  },
  XML: {
    supportedName: "xml",
    languageIdentifiers: ["XML", "xml", "xml", "xml"],
    fileExtensions: ["xml", "xsl", "xslt", "xsd"],
  },
  YAML: {
    supportedName: "yaml",
    languageIdentifiers: ["YAML", "yaml", "yaml", "yaml"],
    fileExtensions: ["yaml", "yml"],
  },
};

export function getSupportedName(identifierOrExtension: string): string {
  for (const languageKey in codeBlockSupportedLanguages) {
    const language = codeBlockSupportedLanguages[languageKey];

    if (
      language.languageIdentifiers.includes(identifierOrExtension) ||
      language.fileExtensions.includes(identifierOrExtension)
    ) {
      return language.supportedName;
    }
  }

  return "none";
}
