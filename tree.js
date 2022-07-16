/**
* TreeJS is a JavaScript librarie for displaying TreeViews
* on the web.
*
* @author Matthias Thalmann
*/

function TreeView(root, container, options){
	var self = this;

	/*
	* Constructor
	*/
	if(typeof root === "undefined"){
		throw new Error("Parameter 1 must be set (root)");
	}

	if(!(root instanceof TreeNode)){
		throw new Error("Parameter 1 must be of type TreeNode");
	}

	if(container){
		if(!TreeUtil.isDOM(container)){
			container = document.querySelector(container);

			if(container instanceof Array){
				container = container[0];
			}

			if(!TreeUtil.isDOM(container)){
				throw new Error("Parameter 2 must be either DOM-Object or CSS-QuerySelector (#, .)");
			}
		}
	}else{
		container = null;
	}

	if(!options || typeof options !== "object"){
		options = {};
	}

	/*
	* Methods
	*/
	this.setRoot = function(_root){
		if(root instanceof TreeNode){
			root = _root;
		}
	}

	this.getRoot = function(){
		return root;
	}

	this.expandAllNodes = function(){
		root.setExpanded(true);

		root.getChildren().forEach(function(child){
			TreeUtil.expandNode(child);
		});
	}

	this.expandPath = function(path){
		if(!(path instanceof TreePath)){
			throw new Error("Parameter 1 must be of type TreePath");
		}

		path.getPath().forEach(function(node){
			node.setExpanded(true);
		});
	}

	this.collapseAllNodes = function(){
		root.setExpanded(false);

		root.getChildren().forEach(function(child){
			TreeUtil.collapseNode(child);
		});
	}

	this.toggleAllNodes = function(){
/* 		if (root.isExpanded()){
			//collapse
		} */
		root.isExpanded() ? this.collapseAllNodes() : this.expandAllNodes();
		//get the current state, invert it and do the opposite of what is already done.
	}

	this.setContainer = function(_container){
		if(TreeUtil.isDOM(_container)){
			container = _container;
		}else{
			_container = document.querySelector(_container);

			if(_container instanceof Array){
				_container = _container[0];
			}

			if(!TreeUtil.isDOM(_container)){
				throw new Error("Parameter 1 must be either DOM-Object or CSS-QuerySelector (#, .)");
			}
		}
	}

	this.getContainer = function(){
		return container;
	}

	this.setOptions = function(_options){
		if(typeof _options === "object"){
			options = _options;
		}
	}

	this.changeOption = function(option, value){
		options[option] = value;
	}

	this.getOptions = function(){
		return options;
	}

	// TODO: set selected key: up down; expand right; collapse left; enter: open;
	this.getSelectedNodes = function(){
		return TreeUtil.getSelectedNodesForNode(root);
	}

	this.reload = function(){
		if(container == null){
			console.warn("No container specified");
			return;
		}

		container.classList.add("tj_container");

		var cnt = document.createElement("ul");

		if(TreeUtil.getProperty(options, "show_root", true)){
			cnt.appendChild(renderNode(root));
		}else{
			root.getChildren().forEach(function(child){
				cnt.appendChild(renderNode(child));
			});
		}

		container.innerHTML = "";
		container.appendChild(cnt);
	}

	//values
	const htmlValue = `
	<!doctype html>
	<html>
	<head>
	<title>HTML Page</title>
	<meta name="description" content="First page">
	<meta name="keywords" content="html">
	</head>
	<body>
	<p>Hello World!</p>
	</body>
	</html>
	`;
	const jsValue = `// Demo code (the actual new parser character stream implementation)

	function StringStream(string) {
	  this.pos = 0;
	  this.string = string;
	}`
	const pyValue = `@nonsenseDecorator
	def doesNothing():
		pass
	
	class ExampleClass(ParentClass):
		@staticmethod
		def example(inputStr):
			a = list(inputStr)
			a.reverse()
			return ''.join(a)
	
		def __init__(self, mixin = 'Hello'):
			self.mixin = mixin`;
	const cssValue = `
	/* Some example CSS */
  
  @import url("something.css");
  
  body {
	margin: 0;
	padding: 3em 6em;
	font-family: tahoma, arial, sans-serif;
	color: #000;
  }
  
  #navigation a {
	font-weight: bold;
	text-decoration: none !important;
  }
	`;
	const jsxValue = `// Code snippets from http://facebook.github.io/react/docs/jsx-in-depth.html

	// Rendering HTML tags
	var myDivElement = <div className="foo" />;
	ReactDOM.render(myDivElement, document.getElementById('example'));
	
	// Rendering React components
	var MyComponent = React.createClass({/*...*/});
	var myElement = <MyComponent someProperty={true} />;
	ReactDOM.render(myElement, document.getElementById('example'));
	
	// Namespaced components
	var Form = MyFormComponent;`;
	const cppValue = `  //C++
	#include <iostream>
	#include "mystuff/util.h"
  
  #include <iostream>
  using namespace std;
  
  int addition (int a, int b)
  {
	int r;
	r=a+b;
	return r;
  }`;
	
	const tabConfigDict = {"html": ["text/html", htmlValue],
							"js": ["javascript", jsValue],
							"py": ["python", pyValue],
							"css": ["css", cssValue],
							"jsx": ["jsx", jsxValue],
							"cpp": ["clike", cppValue] } //array = mode, value
	// tabConfigDict["html"] = ["text/html", htmlValue]


	function renderNode(node){
		var li_outer = document.createElement("li");
		var span_desc = document.createElement("span");
		span_desc.className = "tj_description";
		span_desc.tj_node = node;

		if(!node.isEnabled()){
			li_outer.setAttribute("disabled", "");
			node.setExpanded(false);
			node.setSelected(false);
		}
		
		if(node.isSelected()){
			span_desc.classList.add("selected");
		}

		span_desc.addEventListener("dblclick", function(e){
			//function to create a tree.
			
			console.log("file double clicked");
			//get the tab by count using the function
			//or the selected node since it does the same thing.
			console.log(node);
			node.toString();
			console.log(node.name);
			// console.log(tabConfigDict[nodeExt[nodeExt.length - 1]][0])
			if (!fileTabDict[node.count]){
				const nodeExt = node.name.split(".")
				console.log(nodeExt)
				console.log(nodeExt.length)
				if (nodeExt.length > 1){
					//has extension
					
					if (nodeExt[nodeExt.length - 1]){
						console.log(nodeExt[nodeExt.length - 1])
						// console.log(tabConfigDict[nodeExt[nodeExt.length - 1]][0])
						ide.createTab(node.name, {
							autoRefresh: true,
							lineNumbers: true,
							theme: 'dracula',
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
							mode: tabConfigDict[nodeExt[nodeExt.length - 1]][0],
							htmlMode: true,
							gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
							extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
							highlightSelectionMatches: {annotateScrollbar: true},
							indentWithTabs: true,
							profile: 'xhtml',
							value: tabConfigDict[nodeExt[nodeExt.length - 1]][1]
						  });
						console.log(ide.getTabs().length);
						const tabIndex = ide.getTabs().length-1;
						fileTabDict[node.count] = [tabIndex, ide.getTab(tabIndex)]
/* 						switch (nodeExt[nodeExt.length -1]){
							case "html":
								// we create the tab.
								
								//we open the tab
								//break
								break;
							case "js":
								//create, open, break.
								break;
							case "css":
								//create, open, break.
								break;
							case "py":
								//create, open, break.
								break;
							case "cpp":
								//create, open, break.
								break;
							default:
								//defaults to html


						} */
						//for each case we add the file in fileTabDict[node.count]
/* 						console.log(ide.getTabs().length);
						const tabIndex = ide.getTabs().length-1;
					  fileTabDict[node.count] = [tabIndex, ide.getTab(tabIndex)] */
						
					}
				}
				else{
					//simple create an html file
					ide.createTab(node.name, {
						autoRefresh: true,
						lineNumbers: true,
						theme: 'dracula',
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
						// mode: tabConfigDict["html"][0],
						mode: undefined,
						htmlMode: true,
						gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
						extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },  'Tab': 'emmetExpandAbbreviation', "Ctrl-T": "autocomplete"},
						highlightSelectionMatches: {annotateScrollbar: true},
						indentWithTabs: true,
						profile: 'xhtml',
						// value: tabConfigDict["html"][1]
						value: "Hello World!"
					  });

				}

			}
			else{
				//just open the tab without creating it.
				// const index = node.count;
				const tabIn = fileTabDict[node.count][0];
				ide.openTab(tabIn);
			} 
			//first split the text if it does not include a second part,
			//check the length of the array. then pick the last item
			//we create a tab with html
			//if it has a second part, we check the mode and then open with
			//it
			
			// else{
			// 	//has no extension
			// 	//check whether tab is opened first.
			// }
			// nodeExt[nodeExt.length - 1]
			// if(node.name.split(".")[1].includes("html")){
/* 			if(node){
				console.log("html tab")
			
			}
			else{
				console.log("js tab")
			} */
			/* ide.createTab("First tab", {
				autoRefresh: true,
				lineNumbers: true,
				theme: 'dracula',
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
			  }); */ //the default html config
			//   console.log(ide.getTabs().length);
			//   const tabIndex = ide.getTabs().length-1;
			// fileTabDict[node.count] = [tabIndex, ide.getTab(tabIndex)]
		});

			
			//later a function that checks if a tab with the file is created
			//else it creates it and opens it, otherwise just opens it.
			//for now create a simple tab
			//create another one but switch to the first one.
			//need to find a way to link files with tabs
			//dict of file count with tab id, tab object, etc.
		// })

		span_desc.addEventListener("click", function(e){
			var cur_el = e.target;
			// console.log(e.target.parentElement);
			// console.log(e.target.innerText);

			// console.log(e.target.parentElement.children[0].innerText.split("F", 2)[1])
			console.log("Icon: ", e.target.parentElement.children[0].innerText.substr(0, 2), "Name: ", e.target.parentElement.children[0].innerText.substr(2))
			// console.log("Name: ", e.target.parentElement.children[0].innerText.substr(2))
			// .children[0].firstChild
			// console.log(e.target.parentElement)

			// console.log(e.target.parentElement.children[0].children[0].children[0])

/* 			for (let i = 0; i < e.target.parentElement.children.length; i++){
				console.log(i)
				console.log(e.target.parentElement.children[i])
			} */
			// console.log(e.target.firstChild.children[0].innerHTML)

			while(typeof cur_el.tj_node === "undefined" || cur_el.classList.contains("tj_container")){
				cur_el = cur_el.parentElement;
			}

			var node_cur = cur_el.tj_node;

			if(typeof node_cur === "undefined"){
				return;
			}

			if(node_cur.isEnabled()){
				if(e.ctrlKey == false){
					if(!node_cur.isLeaf()){
						node_cur.toggleExpanded();
						self.reload();
					}else{
						node_cur.open();
					}

					node_cur.on("click")(e, node_cur);
				}


				if(e.ctrlKey == true){
					node_cur.toggleSelected();
					self.reload();
				}else{
					var rt = node_cur.getRoot();

					if(rt instanceof TreeNode){
						TreeUtil.getSelectedNodesForNode(rt).forEach(function(_nd){
							_nd.setSelected(false);
						});
					}
					node_cur.setSelected(true);

					self.reload();
				}
			}
		});

		span_desc.addEventListener("contextmenu", function(e){
			var cur_el = e.target;

			while(typeof cur_el.tj_node === "undefined" || cur_el.classList.contains("tj_container")){
				cur_el = cur_el.parentElement;
			}

			var node_cur = cur_el.tj_node;

			if(typeof node_cur === "undefined"){
				return;
			}

			if(typeof node_cur.getListener("contextmenu") !== "undefined"){
				node_cur.on("contextmenu")(e, node_cur);
				e.preventDefault();
			}else if(typeof TreeConfig.context_menu === "function"){
				TreeConfig.context_menu(e, node_cur);
				e.preventDefault();
			}
		});

/* 		if(node.isLeaf() && !TreeUtil.getProperty(node.getOptions(), "forceParent", false)){
			var ret = '';
			var icon = TreeUtil.getProperty(node.getOptions(), "icon", "");
			if(icon != ""){
				ret += '<span class="tj_icon">' + icon + '</span>';
			}else if((icon = TreeUtil.getProperty(options, "leaf_icon", "")) != ""){
				ret += '<span class="tj_icon">' + icon + '</span>';
			}else{
				ret += '<span class="tj_icon">' + TreeConfig.leaf_icon + '</span>';
				// ret += '<span class="tj_icon">' + icon + '</span>';
			}

			span_desc.innerHTML = ret + node.toString() + "</span>";
			span_desc.classList.add("tj_leaf");

			li_outer.appendChild(span_desc);
		}else{
			var ret = '';
			if(node.isExpanded()){
				ret += '<span class="tj_mod_icon">' + TreeConfig.open_icon + '</span>';
			}else{
				ret+= '<span class="tj_mod_icon">' + TreeConfig.close_icon + '</span>';
			}

			var icon = TreeUtil.getProperty(node.getOptions(), "icon", "");
			if(icon != ""){
				ret += '<span class="tj_icon">' + icon + '</span>';
			}else if((icon = TreeUtil.getProperty(options, "parent_icon", "")) != ""){
				ret += '<span class="tj_icon">' + icon + '</span>';
			}else{
				ret += '<span class="tj_icon">' + TreeConfig.parent_icon + '</span>';
			}

			span_desc.innerHTML = ret + node.toString() + '</span>';

			li_outer.appendChild(span_desc);

			if(node.isExpanded()){
				var ul_container = document.createElement("ul");

				node.getChildren().forEach(function(child){
					ul_container.appendChild(renderNode(child));
				});

				li_outer.appendChild(ul_container)
			}
		} */
		if(node.isLeaf() && !TreeUtil.getProperty(node.getOptions(), "forceParent", false)){
			var ret = '';
			// && node.type !== "folder"
			var icon = TreeUtil.getProperty(node.getOptions(), "icon", "");
			if(icon != ""){
				//add another span in between for the count.
				ret += '<span class="tj_icon"> (' + node.count +')</span><span class="tj_icon">' + icon + '</span>';
			}else if((icon = TreeUtil.getProperty(options, "leaf_icon", "")) != ""){
				ret += '<span class="tj_icon"> (' + node.count +')</span><span class="tj_icon">' + icon + '</span>';
			}else{
				// console.log(node.type);
				if (node.type === "file"){
					// console.log("file")
					ret += '<span class="tj_icon"> (' + node.count +')</span><span class="tj_icon">' + TreeConfig.leaf_icon + '</span>';
				}
				else if (node.type === "folder"){
					// console.log("folder");
					ret = '';
					// ret += '<span class="tj_icon">' + TreeConfig.default_parent_icon + '</span>';
					// ret += '<span class="tj_icon">' + TreeConfig.leaf_icon + '</span>';

					ret += '<span class="tj_icon"> (' + node.count +')</span><span class="tj_icon">' + TreeConfig.parent_icon + '</span>';
					// ret += '<span class="tj_icon"> (' + node.count +')</span>'
				}
/* 				else{
					console.log("undefined")
					ret += '<span class="tj_icon">' + TreeConfig.parent_icon + '</span>';
					// ret += '<span class="tj_icon">' + TreeConfig.default_parent_icon + '</span>';

				} */
/* 				console.log("icon equal nothing!")
				ret += '<span class="tj_icon">' + TreeConfig.leaf_icon + '</span>'; */
				// ret += '<span class="tj_icon">' + TreeConfig.parent_icon + '</span>';
				// ret += '<span class="tj_icon">' + icon + '</span>';
			}

			span_desc.innerHTML = ret + node.toString() + "</span>";
			span_desc.classList.add("tj_leaf");

			li_outer.appendChild(span_desc);
		}else{
			var ret = '';
			if(node.isExpanded()){
				// ret += '<span class="tj_mod_icon">' + TreeConfig.open_icon + '</span>';
				ret += '<span class="tj_mod_icon">' + TreeConfig.open_icon + '</span><span class="tj_icon"> (' + node.count +')</span>';
				//<span class="tj_icon"> (' + node.count +')</span>
			}else{
				// ret+= '<span class="tj_mod_icon">' + TreeConfig.close_icon + '</span>';
				ret+= '<span class="tj_mod_icon">' + TreeConfig.close_icon + '</span><span class="tj_icon"> (' + node.count +')</span>';
			}

			var icon = TreeUtil.getProperty(node.getOptions(), "icon", "");
			if(icon != ""){
				ret += '<span class="tj_icon">' + icon + '</span>';
			}else if((icon = TreeUtil.getProperty(options, "parent_icon", "")) != ""){
				ret += '<span class="tj_icon">' + icon + '</span>';
			}else{
				ret += '<span class="tj_icon">' + TreeConfig.parent_icon + '</span>';
			}

			span_desc.innerHTML = ret + node.toString() + '</span>';

			li_outer.appendChild(span_desc);

			if(node.isExpanded()){
				var ul_container = document.createElement("ul");

				node.getChildren().forEach(function(child){
					ul_container.appendChild(renderNode(child));
				});

				li_outer.appendChild(ul_container)
			}
		}

		return li_outer;
	}

	if(typeof container !== "undefined")
		this.reload();
}

function TreeNode(userObject, type, options){
	var children = new Array();
	var self = this;
	this.type = type;
	var events = new Array();
	// let folderCount = 0;
	this.count;
	this.name = userObject;

	var expanded = true;
	var enabled = true;
	var selected = false;

	/*
	* Konstruktor
	*/
	if (this.type === "root"){
		this.count = 0;
		folderDict[this.count] = this;
	}
	if (this.type === "folder"){
		this.count = folderCount;
		folderDict[this.count] = this;
		folderCount++;
		console.log(folderDict[this.count]);
		console.log(folderDict[this.count].toString());
	}
	else{
		this.count = fileCount;
		fileDict[this.count] = this;
		fileCount++;
		console.log(fileDict[this.count]);
	}
	if(userObject){
		if(typeof userObject !== "string" && typeof userObject.toString !== "function"){
			throw new Error("Parameter 1 must be of type String or Object, where it must have the function toString()");
		}
		else{
			this.name = userObject;
		}
	}else{
		userObject = "";
	}

	if(!options || typeof options !== "object"){
		options = {};
	}else{
		expanded = TreeUtil.getProperty(options, "expanded", true);
		enabled = TreeUtil.getProperty(options, "enabled", true);
		selected = TreeUtil.getProperty(options, "selected", false);
	}
	if (!this.type){
		type = "folder";
	}

	/*
	* Methods
	*/
	this.addChild = function(node){
		if(!TreeUtil.getProperty(options, "allowsChildren", true)){
			console.warn("Option allowsChildren is set to false, no child added");
			return;
		}

		if(node instanceof TreeNode){
			children.push(node);

			Object.defineProperty(node, "parent", {
				value: this,
				writable: false,
				enumerable: true,
				configurable: true
			});
		}else{
			throw new Error("Parameter 1 must be of type TreeNode");
		}
	}

	this.removeChildPos = function(pos){
		if(typeof children[pos] !== "undefined"){
			if(typeof children[pos] !== "undefined"){
				children.splice(pos, 1);
			}
		}
	}

	this.removeChild = function(node){
		if(!(node instanceof TreeNode)){
			throw new Error("Parameter 1 must be of type TreeNode");
		}

		this.removeChildPos(this.getIndexOfChild(node));
	}

	this.getChildren = function(){
		return children;
	}

	this.getChildCount = function(){
		return children.length;
	}

	this.getIndexOfChild = function(node){
		for(var i = 0; i < children.length; i++){
			if(children[i].equals(node)){
				return i;
			}
		}

		return -1;
	}

	this.getRoot = function(){
		var node = this;

		while(typeof node.parent !== "undefined"){
			node = node.parent;
		}

		return node;
	}
/* 	this.getFolders = function(file){
		var node = this;

		// while(typeof node.parent !== "undefined"){
			console.log("getting children")
			children = node.getChildren();
			childCount = node.getChildCount();
			if (childCount > 0){
				// console.log("ChildCount> 0")
				console.log(children)
				for (let i = 0; i < childCount; i++){
					if (children[i].type === "file") {return node}
					else {
						console.log("name: ", children[i].toString());
						var y = 0
						while(y < children[i].getChildCount()){
							console.log("while loop")
							//another loop
							
							// if (i.getChildren()[y].toString() === "File"){
								// children[i].getChildren()[y].equals(file)
								console.log("Y: ", y)
								console.log(children[i].getChildren()[y].equals(file));
								if (children[i].getChildren()[y].equals(file)){
									value = children[i].getChildren()[y].toString()
									//instead return the parenting folder
									console.log(children[i].toString());
									return children[i];
									break;
								}
								// if (children[i].getChildren()[y].equals(file)){
								y++;
							// }

						}
					}
				}
			}
		// }

		// return node;
	} */

	//latest. 4 loops
	this.getFolders = function(file){
		var node = this;
		var current;
		var found;
		var parent;
		// while(typeof node.parent !== "undefined"){
			console.log("getting children")
			var children = node.getChildren();
			var childCount = node.getChildCount();
			//first loop
			parent = node;
			for (let i = 0; i < children.length; i++){
				console.log("Currently on: ", children[i].toString())
				console.log(parent.toString())
				console.log(children[i].toString());
				if (children[i].type === "file") {
					//logic to check if the file equals the one we're looking for.
					if (children[i].equals(file)){
						//return the parent
						found = true;
						console.log("Found file", found);
						console.log(parent.toString())
						// return parent;
						// returnItem = parent;
						return parent;
						break;
					}
					// return parent
				}
				//it is a folder
				else{
					//if it has children
					if (children[i].getChildCount() > 0){
						// loop over again.
						var childNodes = children[i].getChildren();
						parent = children[i];
						for (let i = 0; i < childNodes.length; i++){
							console.log("Currently on: ", childNodes[i].toString())
							console.log(parent.toString())
							console.log(childNodes[i].toString());
							if (childNodes[i].type === "file") {
								//logic to check if the file equals the one we're looking for.
								if (childNodes[i].equals(file)){
									//return the parent
									found = true;
									console.log("Found file", found);
									console.log(parent.toString())
									// return parent;
									// returnItem = parent;
									return parent;
									break;
								}
								// return parent
							}
							else{
								//if it has children
								if (childNodes[i].getChildCount() > 0){
									// loop over again.
									var secondChildNodes = childNodes[i].getChildren();
									parent = childNodes[i];
									for (let i = 0; i < secondChildNodes.length; i++){
										console.log("Currently on: ", secondChildNodes[i].toString())
										console.log(parent.toString())
										console.log(secondChildNodes[i].toString());
										if (secondChildNodes[i].type === "file") {
											//logic to check if the file equals the one we're looking for.
											if (secondChildNodes[i].equals(file)){
												//return the parent
												found = true;
												console.log("Found file", found);
												console.log(parent.toString())
												// return parent;
												// returnItem = parent;
												return parent;
											}
											// return parent
										}
										else{
											//if it has children
											if (secondChildNodes[i].getChildCount() > 0){
												// loop over again.
												var thirdChildNodes = secondChildNodes[i].getChildren();
												parent = secondChildNodes[i];
												for (let i = 0; i < thirdChildNodes.length; i++){
													console.log("Currently on: ", thirdChildNodes[i].toString())
													console.log(parent.toString())
													console.log(thirdChildNodes[i].toString());
													if (thirdChildNodes[i].type === "file") {
														//logic to check if the file equals the one we're looking for.
														if (thirdChildNodes[i].equals(file)){
															//return the parent
															found = true;
															console.log("Found file", found);
															console.log(parent.toString())
															// return parent;
															// returnItem = parent;
															return parent;
															break;
														}
														// return parent
													}
													else{
														//if it has children
														if (thirdChildNodes[i].getChildCount() > 0){
															// loop over again.
															var fourthChildNodes = thirdChildNodes[i].getChildren();
															parent = thirdChildNodes[i];
															for (let i = 0; i < fourthChildNodes.length; i++){
																console.log("Currently on: ", fourthChildNodes[i].toString())
																console.log(parent.toString())
																console.log(fourthChildNodes[i].toString());
																if (fourthChildNodes[i].type === "file") {
																	//logic to check if the file equals the one we're looking for.
																	if (fourthChildNodes[i].equals(file)){
																		//return the parent
																		found = true;
																		console.log("Found file", found);
																		console.log(parent.toString())
																		// return parent;
																		// returnItem = parent;
																		return parent;
																	}
																	// return parent
																}
															}
														}
													}
												}
											}
										}


									}
								}
							}
						}
					}
				}
			}
	}

	//to be started. Requires recusive loop from getFolders.
	function loopfolders(){
		//loops through nodes from the root and prints folders with the 
		//folder count from 1. Count carries into the loop.
	}
			//if it finds nothing, then we return the root.

			//inside first loop we check children and if so
			//we loop a second time inside that node'sx
			//children
/* 			if (childCount > 0){
				// console.log("ChildCount> 0")
				// console.log(children)
				let folder = loopNodes(node, children, file);
				console.log(folder) //.toString())
				// return folder;
				current = folder;
				// console.log
				if (current){
					console.log(current.toString());
					return current;
				}
			}
			else{
				// return node;
				console.log(node.toString(), "has no children");
			}

			if (found){
				console.log("folder found");
				return current;
			}
		// }

		// return node;
		if (typeof current == 'undefined'){
			console.log("current undefined");
		} */
		// return current;
	// }

	// function loopNodes(parent, children, file){
		function loopNodes(file, children, parent){
		//children - get length of list.
		let cCount = children.length;
		// console.log(parent)
		var returnItem;
		console.log("# of Children: ", cCount);
		for (let i = 0; i < children.length; i++){
			console.log("Currently on: ", children[i].toString())
			console.log(parent.toString())
			console.log(children[i].toString());
			if (children[i].type === "file") {
				//logic to check if the file equals the one we're looking for.
				if (children[i].equals(file)){
					//return the parent
					found = true;
					console.log("Found file", found);
					console.log(parent.toString())
					// return parent;
					returnItem = parent;
					break;
				}
				// return parent
			}
			else{

				//loop into the nodes of that node's children. (if it has them)
				console.log(children[i].toString());
				if (children[i].getChildCount()>0){
					return loopNodes(children[i], children[i].getChildren(), file);
				}
/* 				else{
					// return children[i];
				} */
			}
		}
		console.log(returnItem);
		return returnItem;
	}
/* 	this.getFolders = function(file){
		var node = this;
		var current;
		// while(typeof node.parent !== "undefined"){
			console.log("getting children")
			children = node.getChildren();
			childCount = node.getChildCount();
			var found = false;
			if (childCount > 0){
				// console.log("ChildCount> 0")
				// console.log(children)
				let folder = loopNodes(node, children, file);
				console.log(folder) //.toString())
				// return folder;
				current = folder;
				// console.log
				if (current){
					console.log(current.toString());
					return current;
				}

			}
			else{
				// return node;
				console.log(node.toString(), "has no children");
			}

			if (found){
				console.log("folder found");
				return current;
			}
		// }

		// return node;
		if (typeof current == 'undefined'){
			console.log("current undefined");
		}
		// return current;
	} */

	/* this.getFolders = function(file, children=null, parent=null){
		var node = this;
		var current;
		// console.log(children, parent);
		// while(typeof node.parent !== "undefined"){

			if (parent === null){
				parent = node;
			}
			if (children=== null){
				var children = parent.getChildren();
			}

			if (children.length > 0){

				for (let i = 0; i < children.length; i++){
					console.log("Currently on: ", children[i].toString())
					console.log(parent.toString())
					console.log(children[i].toString());
					if (children[i].type === "file") {
						//logic to check if the file equals the one we're looking for.
						if (children[i].equals(file)){
							//return the parent
							// found = true;
							// console.log("Found file", found);
							console.log(parent.toString())
							// return parent;
							// returnItem = parent;
							return parent;
							break;
						}
						// return parent
					}
					else{
		
						//loop into the nodes of that node's children. (if it has them)
						console.log(children[i].toString());
						if (children[i].type !== "file" && children[i].getChildCount()>0){
							// return loopNodes(children[i], children[i].getChildren(), file);
							return this.getFolders(file, children=children[i].getChildren(), parent=children[i]);
						}
					}
				}
			}
			//loop through the children if they have children > 0, we run loop again
			//else we check if it is a file and equals the file in question.
		// }

		// return node;
		// return current;
	} */

	function loopOverChildren(parent1, children, file){
		let y = 0
/* 		while(y < children[i].getChildCount()){
			console.log("while loop")
			if (children[i].getChildren()[y]){
				var child = children[i].getChildren()[y]
				loopOverChildren(child, y);
			}
			//another loop
			
			// if (i.getChildren()[y].toString() === "File"){
				// children[i].getChildren()[y].equals(file)
				console.log("Y: ", y)
				console.log(children[i].getChildren()[y].equals(file));
				if (children[i].getChildren()[y].equals(file)){
					value = children[i].getChildren()[y].toString()
					//instead return the parenting folder
					console.log(children[i].toString());
					return children[i];
					break;
				}
				// if (children[i].getChildren()[y].equals(file)){
				y++;
			// }

		} */
		const leng = children.length;
		
		for (let j = 0; j < leng; j++){
			//
			console.log("recursive for loop")
			// if (children[j].getChildren()[y]){
				console.log("loop for ", children[j].toString())
				if (children[j].getChildCount() > 0){
					console.log("item: ", children[j].toString());
					var child = children[j].getChildren(); //[y]
					console.log(child);
					loopOverChildren(children[j], child, file);
				}
				else{
					console.log("Y: ", y)
					// console.log(children[j].getChildren()[y].equals(file));
					// console.log(children[j].getChildren())
					console.log("parent: ", parent1.toString(), "of type", parent1.type);
					if (children[j].equals(file)){
						console.log(children[j].equals(file));
						value = children[j].toString()
						//instead return the parenting folder
						console.log(parent1.toString());
						fold = parent1;
						console.log("child in recursive func: ", children[j].toString());
						abort = true;
						break;
						return;

						// break exit_loops;
					}
					else{
						console.log(children[j].toString(), "not equal ", file.toString());
						return;
					}
					// if (children[i].getChildren()[y].equals(file)){
					y++;

				}
		}
		return fold;
	}

/* 	this.getFolders = function(file){
		var node = this;
		var fold = "";

		// while(typeof node.parent !== "undefined"){
			console.log("getting children")
			children = node.getChildren();
			childCount = node.getChildCount();
			var abort = false;
			if (childCount > 0){
				// console.log("ChildCount> 0")
				console.log(children)
				exit_loops:
				for (let i = 0; i < childCount; i++){
					if (children[i].type === "file") {return node}
					else {
						console.log("name: ", children[i].toString());
						var y = 0
						console.log(children[i].getChildCount(), "child");
						// console.log(children[0].getChildren().length, "children");
						console.log(children.length, "children");
						if (children[i].getChildCount() > 0){
							// loop over the children recursively
							console.log(children[i].getChildren())
							fold = children[i]
							loopOverChildren(children[i], children[i].getChildren(), file);
						}
						else{
							console.log("childless: ", children[i].toString())
						}
					}
				}
			}
		// }

		return fold;
	} */

	//second getFolders method using recursion.

	this.setUserObject = function(_userObject){
		if(!(typeof _userObject === "string") || typeof _userObject.toString !== "function"){
			throw new Error("Parameter 1 must be of type String or Object, where it must have the function toString()");
		}else{
			userObject = _userObject;
		}
	}

	this.getUserObject = function(){
		return userObject;
	}

	this.setOptions = function(_options){
		if(typeof _options === "object"){
			options = _options;
		}
	}

	this.changeOption = function(option, value){
		options[option] = value;
	}

	this.getOptions = function(){
		return options;
	}

	this.isLeaf = function(){
		return (children.length == 0);
		// return (this.type !== "folder" && children.length == 0);

	}

	this.setExpanded = function(_expanded){
		if(this.isLeaf()){
			return;
		}

		if(typeof _expanded === "boolean"){
			if(expanded == _expanded){
				return;
			}

			expanded = _expanded;

			if(_expanded){
				this.on("expand")(this);
			}else{
				this.on("collapse")(this);
			}

			this.on("toggle_expanded")(this);
		}
	}

	this.toggleExpanded = function(){
		if(expanded){
			this.setExpanded(false);
		}else{
			this.setExpanded(true);
		}
	};

	this.isExpanded = function(){
		if(this.isLeaf()){
			return true;
		}else{
			return expanded;
		}
	}

	this.setEnabled = function(_enabled){
		if(typeof _enabled === "boolean"){
			if(enabled == _enabled){
				return;
			}

			enabled = _enabled;

			if(_enabled){
				this.on("enable")(this);
			}else{
				this.on("disable")(this);
			}

			this.on("toggle_enabled")(this);
		}
	}

	this.toggleEnabled = function(){
		if(enabled){
			this.setEnabled(false);
		}else{
			this.setEnabled(true);
		}
	}

	this.isEnabled = function(){
		return enabled;
	}

	this.setSelected = function(_selected){
		if(typeof _selected !== "boolean"){
			return;
		}

		if(selected == _selected){
			return;
		}

		selected = _selected;

		if(_selected){
			this.on("select")(this);
		}else{
			this.on("deselect")(this);
		}

		this.on("toggle_selected")(this);
	}

	this.toggleSelected = function(){
		if(selected){
			this.setSelected(false);
		}else{
			this.setSelected(true);
		}
	}

	this.isSelected = function(){
		return selected;
	}

	this.open = function(){
		if(!this.isLeaf()){
			this.on("open")(this);
		}
	}

	this.on = function(ev, callback){
		if(typeof callback === "undefined"){
			if(typeof events[ev] !== "function"){
				return function(){};
			}else{
				return events[ev];
			}
		}

		if(typeof callback !== 'function'){
			throw new Error("Argument 2 must be of type function");
		}

		events[ev] = callback;
	}

	this.getListener = function(ev){
		return events[ev];
	}

	this.equals = function(node){
		if(node instanceof TreeNode){
			if(node.getUserObject() == userObject){
				return true;
			}
		}

		return false;
	}

	this.toString = function(){
		if(typeof userObject === "string"){
			return userObject;
		}else{
			return userObject.toString();
		}
	}
}

function TreePath(root, node){
	var nodes = new Array();

	this.setPath = function(root, node){
		nodes = new Array();

		while(typeof node !== "undefined" && !node.equals(root)){
			nodes.push(node);
			node = node.parent;
		}

		if(node.equals(root)){
			nodes.push(root);
		}else{
			nodes = new Array();
			throw new Error("Node is not contained in the tree of root");
		}

		nodes = nodes.reverse();

		return nodes;
	}

	this.getPath = function(){
		return nodes;
	}

	this.toString = function(){
		return nodes.join(" - ");
	}

	if(root instanceof TreeNode && node instanceof TreeNode){
		this.setPath(root, node);
	}
}

/*
* Util-Methods
*/
const TreeUtil = {
	default_leaf_icon: "<span>&#128441;</span>",
	default_parent_icon: "<span>&#128449;</span>",
	default_open_icon: "<span>&#9698;</span>",
	default_close_icon: "<span>&#9654;</span>",

	isDOM: function(obj){
		try {
			return obj instanceof HTMLElement;
		}
		catch(e){
			return (typeof obj==="object") &&
			(obj.nodeType===1) && (typeof obj.style === "object") &&
			(typeof obj.ownerDocument ==="object");
		}
	},

	getProperty: function(options, opt, def){
		if(typeof options[opt] === "undefined"){
			return def;
		}

		return options[opt];
	},

	expandNode: function(node){
		node.setExpanded(true);

		if(!node.isLeaf()){
			node.getChildren().forEach(function(child){
				TreeUtil.expandNode(child);
			});
		}
	},

	collapseNode: function(node){
		node.setExpanded(false);

		if(!node.isLeaf()){
			node.getChildren().forEach(function(child){
				TreeUtil.collapseNode(child);
			});
		}
	},

	getSelectedNodesForNode: function(node){
		if(!(node instanceof TreeNode)){
			throw new Error("Parameter 1 must be of type TreeNode");
		}

		var ret = new Array();

		if(node.isSelected()){
			ret.push(node);
		}

		node.getChildren().forEach(function(child){
			if(child.isSelected()){
				if(ret.indexOf(child) == -1){
					ret.push(child);
				}
			}

			if(!child.isLeaf()){
				TreeUtil.getSelectedNodesForNode(child).forEach(function(_node){
					if(ret.indexOf(_node) == -1){
						ret.push(_node);
					}
				});
			}
		});

		return ret;
	}
};

var TreeConfig = {
	leaf_icon: TreeUtil.default_leaf_icon,
	parent_icon: TreeUtil.default_parent_icon,
	open_icon: TreeUtil.default_open_icon,
	close_icon: TreeUtil.default_close_icon,
	context_menu: undefined
};
