var unicodePreTable = [
  "@f",
  "@ff",
  "@i|@import",
  "@kf",
  "@m|@media",
  "ac",
  "ai",
  "anim",
  "animdel",
  "animdir",
  "animdur",
  "animfm",
  "animic",
  "animn",
  "animps",
  "animtf",
  "ap",
  "as",
  "b",
  "bd",
  "bdb",
  "bdbc",
  "bdbi",
  "bdbk",
  "bdbli",
  "bdblrs",
  "bdbri",
  "bdbrrs",
  "bdbs",
  "bdbw"
];
// Register our custom Codemirror hint plugin.
CodeMirror.registerHelper('hint', 'css', function(editor) {
  var cur = editor.getCursor();
  var curLine = editor.getLine(cur.line);
  var start = cur.ch;
  var end = start;
  while (end < curLine.length && /[\w$]/.test(curLine.charAt(end))) ++end;
  while (start && /[\w$]/.test(curLine.charAt(start - 1))) --start;
  var curWord = start !== end && curLine.slice(start, end);
  var regex = new RegExp('^' + curWord, 'i');
  return {
    list: (!curWord ? [] : unicodePreTable.filter(function(item) {
      return item.match(regex);
    })).sort(),
    from: CodeMirror.Pos(cur.line, start),
    to: CodeMirror.Pos(cur.line, end)
  }
});