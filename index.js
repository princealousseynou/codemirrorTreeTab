var ide = {};

ide.name = 'monkeyide';
ide.version = '1.1.2';
ide.license = 'MIT';
ide.buttonsBar = document.createElement('div');
ide.buttonsBar.className = 'tabbuttons';
ide.files = [];
ide.totalTabs = 0;
ide.limit = 'infinity';
document.body.appendChild(ide.buttonsBar);
ide.tabsElements = document.createElement('div');
ide.tabsElements.id = 'tabs';
document.body.appendChild(ide.tabsElements);

/**
 * Create a new tab
 * @param {string} tabName The name of the new tab
 * @param {Object} configGiven The configuration for the new tab
 */
ide.createTab = function createTab(tabName, configGiven) {
  if (typeof this.limit === 'number' && this.totalTabs >= this.limit) {
    return;
  }
  let i;
  let newTabDiv = document.createElement('div');
  newTabDiv.innerHTML = '<textarea id="textarea">' + configGiven.value + '</textarea>';
  newTabDiv.classList.add('tabcontent');
  if (typeof configGiven.placeholder != 'undefined') {
    newTabDiv.placeholder = configGiven.placeholder;
  }
  if (typeof configGiven.theme != 'undefined') {
    newTabDiv.classList.add('cm-s-' + configGiven.theme);
    newTabDiv.classList.add('CodeMirror');
  }
  for (i = 0; i < document.querySelectorAll('.tabcontent').length; i++) {
    let element = document.querySelectorAll('.tabcontent')[i];
    element.style.display = 'none';
  }
  newTabDiv.style.display = 'block';
  tabsCurrentTotalAdded = document.getElementById('tabs').childElementCount;
  newTabDiv.id = 'tab-' + tabsCurrentTotalAdded;
  document.getElementById('tabs').appendChild(newTabDiv);
  let newTabButton = document.createElement('button');
  newTabButton.id = tabsCurrentTotalAdded;
  newTabButton.className = 'buttonsFortab';
  newTabButton.onclick = function (event) {
    ide.openTab(event.target.id);
  };
  newTabButton.innerHTML = tabName;
  document.querySelector('.tabbuttons').appendChild(newTabButton);
  this.files.push({
    mirror: CodeMirror.fromTextArea(
      document.querySelectorAll('#tab-' + tabsCurrentTotalAdded + ' textarea')[0],
      configGiven
    ),
    name: tabName,
    configuration: configGiven
  });
  this.openTab(tabsCurrentTotalAdded);
  this.totalTabs += 1;
};

/**
 * Get the code for a certain index's tab
 * @param {number} index The tab index to remove
 */
ide.getCodeByTab = function getCodeByTab(index) {
  return this.files[index].mirror.getValue();
};

/**
 * Get a list of all the tabs
 */
ide.getTabs = function getTabs() {
  return this.files;
};

/**
 * Get information on a certain tab
 * @param {number} id The index of the tab
 */
ide.getTab = function getTab(index) {
  return this.files[index];
};

/**
 * Open up a tab
 * @param {number} tabIDGiven The index of the tab to open
 */
ide.openTab = function openTab(tabIDGiven) {
  let tabID = 'tab-' + tabIDGiven;
  let i;
  let tabContents = document.getElementsByClassName('tabcontent');
  let tabButtons = document.getElementsByClassName('buttonsFortab');
  for (i = 0; i < tabContents.length; i++) {
    let element = tabContents[i];
    if (element.id == tabID) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  }
  for (i = 0; i < tabButtons.length; i++) {
    let element = tabButtons[i];
    if (element.id == tabID.substring(4)) {
      element.style.backgroundColor = 'grey';
    } else {
      element.style.backgroundColor = 'white';
    }
  }
  this.currentTab = tabIDGiven;
};

/**
 * Remove a tab
 * @param {number} indexOfTab The index of the tab to remove
 */
ide.removeTab = function removeTab(indexOfTab) {
  let tabID = 'tab-' + indexOfTab;
  let i;
  let tabContents = document.getElementsByClassName('tabcontent');
  let tabButtons = document.getElementsByClassName('buttonsFortab');
  for (i = 0; i < tabContents.length; i++) {
    let element = tabContents[i];
    if (element.id == tabID) {
      element.remove();
      delete tabContents[i];
    }
  }
  tabContents = [...tabContents].filter((content) => content !== undefined);
  for (i = 0; i < tabButtons.length; i++) {
    let element = tabButtons[i];
    if (element.id == tabID.substring(4)) {
      element.remove();
      delete tabButtons[i];
    }
  }
  tabButtons = [...tabButtons].filter((button) => button !== undefined);
  for (i = 0; i < tabContents.length; i++) {
    let element = tabContents[i];
    element.id = 'tab-' + i;
  }
  for (i = 0; i < tabButtons.length; i++) {
    let element = tabButtons[i];
    element.id = i;
  }
  this.openTab(0);
  this.files = this.files.filter((value, index) => index != indexOfTab);
  this.totalTabs -= 1;
};

/**
 * Remove all tabs
 */
ide.removeAll = function removeAll() {
  while (this.totalTabs !== 0) {
    this.removeTab(0);
  }
};

/**
 * Pack up all the tabs so they can be reused
 * @param {Array<{ name: string, configuration: Object }>} obj The files to pack up, usually the ide.files
 */
ide.pack = function pack(obj) {
  let returnedList = [];
  for (let i = 0; i < obj.length; i++) {
    let element = obj[i];
    if (typeof element.configuration !== 'object' || element.configuration === undefined) {
      element.configuration = {};
    }
    element.configuration.value = element.mirror.getValue();
    returnedList.push({
      name: element.name,
      configuration: element.configuration
    });
  }
  return returnedList;
};

/**
 * Rename a tab
 * @param {number} index The index of the tab to rename
 * @param {string} newName The new name for the tab
 */
ide.renameTab = function renameTab(index, newName) {
  let tabButtons = document.getElementsByClassName('buttonsFortab');
  for (const tabButton of tabButtons) {
    if (tabButton == index) {
      tabButton.innerHTML = newName;
    }
  }
  this.files[index].name = newName;
};

/**
 * Create multiple tabs
 * @param {Array<{ name: string, configuration: Object }>} lst The tabs to create
 */
ide.large = function large(lst) {
  for (let i = 0; i < lst.length; i++) {
    let element = lst[i];
    this.createTab(element.name, element.configuration);
  }
  this.openTab(0);
};

ide.createTab("Editor", {
  autoRefresh: true,
  lineNumbers: true,
  theme: 'material',
  styleActiveLine: true,
  keyMap: "sublime",
  lineWrapping: true,
  foldGutter: true,
  autoCloseBrackets: true,
  autoCloseTags: true,
  showTrailingSpace: true,
  styleActiveSelected: true,
  styleSelectedText: true,
  matchBrackets: true,
  mode: 'text/html',
  htmlMode: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
  highlightSelectionMatches: {annotateScrollbar: true},
  indentWithTabs: true,
  profile: 'xhtml',
  value: `<html style="color: green">
  <!-- this is a comment -->
  <head>
    <title>Mixed HTML Example</title>
    <style>
      h1 {font-family: comic sans; color: #f0f;}
      div {background: yellow !important;}
      body {
        max-width: 50em;
        margin: 1em 2em 1em 5em;
      }
    </style>
  </head>
  <body>
    <h1>Mixed HTML Example</h1>
    <script>
      function jsFunc(arg1, arg2) {
        if (arg1 && arg2) document.body.innerHTML = "achoo";
      }
    </script>
  </body>
</html>
  `
});//  = function createTab(tabName, configGiven)
// ide.createTab("Second tab", {
//   autoRefresh: true,
//   lineNumbers: true,
//   theme: 'material',
//   styleActiveLine: true,
//   keyMap: "sublime",
//   lineWrapping: true,
//   foldGutter: true,
//   autoCloseBrackets: true,
//   autoCloseTags: true,
//   showTrailingSpace: true,
//   styleActiveSelected: true,
//   styleSelectedText: true,
//   matchBrackets: true,
//   mode: 'javascript',
//   // mode: 'htmlmixed',
//   htmlMode: true,
//   //  matchTags:{bothTags: false},
//   gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//   extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
//   highlightSelectionMatches: {annotateScrollbar: true},
//   //  hintOptions: {hint: synonyms},
//   indentWithTabs: true,
//   profile: 'xhtml',
//   value: `// Demo code (the actual new parser character stream implementation)

//   function StringStream(string) {
//     this.pos = 0;
//     this.string = string;
//   }
  
//   StringStream.prototype = {
//     done: function() {return this.pos >= this.string.length;},
//     peek: function() {return this.string.charAt(this.pos);},
//     next: function() {
//       if (this.pos < this.string.length)
//         return this.string.charAt(this.pos++);
//     },
//     eat: function(match) {
//       var ch = this.string.charAt(this.pos);
//       if (typeof match == "string") var ok = ch == match;
//       else var ok = ch && match.test ? match.test(ch) : match(ch);
//       if (ok) {this.pos++; return ch;}
//     },
//     eatWhile: function(match) {
//       var start = this.pos;
//       while (this.eat(match));
//       if (this.pos > start) return this.string.slice(start, this.pos);
//     },
//     backUp: function(n) {this.pos -= n;},
//     column: function() {return this.pos;},
//     eatSpace: function() {
//       var start = this.pos;
//       while (/\s/.test(this.string.charAt(this.pos))) this.pos++;
//       return this.pos - start;
//     },
//     match: function(pattern, consume, caseInsensitive) {
//       if (typeof pattern == "string") {
//         function cased(str) {return caseInsensitive ? str.toLowerCase() : str;}
//         if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {
//           if (consume !== false) this.pos += str.length;
//           return true;
//         }
//       }
//       else {
//         var match = this.string.slice(this.pos).match(pattern);
//         if (match && consume !== false) this.pos += match[0].length;
//         return match;
//       }
//     }
//   };
  
//   `
// })
// ide.createTab("Third tab", {
//   autoRefresh: true,
//   lineNumbers: true,
//   theme: 'shadowfox',
//   styleActiveLine: true,
//   keyMap: "sublime",
//   lineWrapping: true,
//   foldGutter: true,
//   autoCloseBrackets: true,
//   autoCloseTags: true,
//   showTrailingSpace: true,
//   styleActiveSelected: true,
//   styleSelectedText: true,
//   matchBrackets: true,
//   mode: 'jsx',
//   // mode: 'htmlmixed',
//   htmlMode: true,
//   //  matchTags:{bothTags: false},
//   gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//   extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
//   highlightSelectionMatches: {annotateScrollbar: true},
//   //  hintOptions: {hint: synonyms},
//   indentWithTabs: true,
//   profile: 'xhtml',
//   value: `// Code snippets from http://facebook.github.io/react/docs/jsx-in-depth.html

//   // Rendering HTML tags
//   var myDivElement = <div className="foo" />;
//   ReactDOM.render(myDivElement, document.getElementById('example'));
  
//   // Rendering React components
//   var MyComponent = React.createClass({/*...*/});
//   var myElement = <MyComponent someProperty={true} />;
//   ReactDOM.render(myElement, document.getElementById('example'));
  
//   // Namespaced components
//   var Form = MyFormComponent;`
// })
// ide.createTab("Fourth tab", {
//   autoRefresh: true,
//   lineNumbers: true,
//   theme: 'material',
//   styleActiveLine: true,
//   keyMap: "sublime",
//   lineWrapping: true,
//   foldGutter: true,
//   autoCloseBrackets: true,
//   autoCloseTags: true,
//   showTrailingSpace: true,
//   styleActiveSelected: true,
//   styleSelectedText: true,
//   matchBrackets: true,
//   mode: 'python',
//   // mode: 'htmlmixed',
//   htmlMode: true,
//   //  matchTags:{bothTags: false},
//   gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//   extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
//   highlightSelectionMatches: {annotateScrollbar: true},
//   //  hintOptions: {hint: synonyms},
//   indentWithTabs: true,
//   profile: 'xhtml',
//   value: `@nonsenseDecorator
//   def doesNothing():
//       pass
  
//   class ExampleClass(ParentClass):
//       @staticmethod
//       def example(inputStr):
//           a = list(inputStr)
//           a.reverse()
//           return ''.join(a)
  
//       def __init__(self, mixin = 'Hello'):
//           self.mixin = mixin`
// })
// ide.createTab("Fifth tab", {
//   autoRefresh: true,
//   lineNumbers: true,
//   theme: 'material',
//   useCPP:true,
//   styleActiveLine: true,
//   // keyMap: "sublime",
//   // lineWrapping: true,
//   // foldGutter: true,
//   // autoCloseBrackets: true,
//   // autoCloseTags: true,
//   // showTrailingSpace: true,
//   // styleActiveSelected: true,
//   // styleSelectedText: true,
//   // matchBrackets: true,
//   mode: 'clike',
//   // htmlMode: true,
//   // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//   // extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
//   // highlightSelectionMatches: {annotateScrollbar: true},
//   indentWithTabs: true,
//   // profile: 'xhtml',
//   value: `  //C++
//   #include <iostream>
//   #include "mystuff/util.h"

// #include <iostream>
// using namespace std;

// int addition (int a, int b)
// {
//   int r;
//   r=a+b;
//   return r;
// }`
// })
// // ide.createTab("Sixth tab", {})
// ide.createTab("Sixth tab", {
//   autoRefresh: true,
//   lineNumbers: true,
//   theme: 'dracula',
//   styleActiveLine: true,
//   keyMap: "sublime",
//   lineWrapping: true,
//   foldGutter: true,
//   autoCloseBrackets: true,
//   autoCloseTags: true,
//   showTrailingSpace: true,
//   styleActiveSelected: true,
//   styleSelectedText: true,
//   matchBrackets: true,
//   mode: 'css',
//   // mode: 'htmlmixed',
//   htmlMode: true,
//   //  matchTags:{bothTags: false},
//   gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//   extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
//   highlightSelectionMatches: {annotateScrollbar: true},
//   //  hintOptions: {hint: synonyms},
//   indentWithTabs: true,
//   profile: 'xhtml',
//   value: `
//   /* Some example CSS */

// @import url("something.css");

// body {
//   margin: 0;
//   padding: 3em 6em;
//   font-family: tahoma, arial, sans-serif;
//   color: #000;
// }

// #navigation a {
//   font-weight: bold;
//   text-decoration: none !important;
// }
//   `
// })

{/* <html>
  <body>
	<script>
	  function hello(){
		console.log("Hello World!")
	  }
	</script>
  </body>
</html> */}