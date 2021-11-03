import MonacoEditor from "react-monaco-editor"
import { editor } from "monaco-editor"

editor.defineTheme("myTheme", {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.foreground": "#000000",
    //'editor.background': "#E8E8E8",
    "editorCursor.foreground": "#7599FF",
    //'editor.lineHighlightBackground': '#7599FF',
    "editorLineNumber.foreground": "#7599FF",
  },
})
editor.setTheme("myTheme")
const Editor = MonacoEditor
export default Editor
