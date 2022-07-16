var unicodePreTable = [
  "!","a","a:link",
  "a:mail","abbr","acronym", "acr",
  "base","basefont","br","frame","hr","bdo",
  "bdo:r","bdo:l","col", "div","link","link:css","link:print","link:favicon",
  "link:touch","link:rss","link:atom","link:import, link:im",
  "meta","meta:utf","meta:win","meta:vp","meta:compat",
  "style","script","script:src","img","img:srcset", "img:s",
  "img:sizes", "img:z",
  "picture","source", "src",
  "source:src", "src:sc",
  "source:srcset", "src:s","source:media", "src:m","source:type", "src:t",
  "source:sizes, src:z","source:media:type", "src:mt","source:media:sizes", "src:mz",
  "source:sizes:type", "src:zt",
  "iframe","embed","object","param","map",
  "area","area:d","area:c","area:r","area:p","form","form:get",
  "form:post","label","input","inp","input:hidden", "input:h",
  "input:search","input:url","option, opt","textarea","marquee","menu:context",
  "menu:c","video","audio","html:xml","keygen","command","button:submit", "button:s", "btn:s"
];
// Register our custom Codemirror hint plugin.
CodeMirror.registerHelper('hint', 'xml', function(editor) {
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