import { keymap } from "@codemirror/view";

let startState = EditorState.create({
  doc: "Hello World",
  extensions: [keymap.of(defaultKeymap)],
});

let view = new EditorView({
  state: startState,
  extensions: [basicSetup, javascript()],
  parent: document.querySelector(".example"),
});
