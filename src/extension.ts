// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { Tree } from '@coutcout/tree-datastructure';
import { Part } from './part';
import { TreeHtmlViewer } from './viewers/treeHtmlViewer';
import { InputParser } from './tools/inputParser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "sumviewer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.computeSum', () => {
		// The code you place here will be executed every time your command is executed
		let currentTxtEditor = vscode.window.activeTextEditor;

		if(currentTxtEditor){
			let currentDocument = currentTxtEditor.document;
			let settings = vscode.workspace.getConfiguration("sumViewer");

			const tree = parseDocument(settings, currentDocument);

			vscode.window.showInformationMessage('Done !');	
			displayResultat(tree, context);
		}
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

function parseDocument(settings: vscode.WorkspaceConfiguration, currentDocument: vscode.TextDocument): Tree<Part> {
	let model = settings.models.markdown;
	let regexs = model.regexs;

	let parser = new InputParser(regexs.titleLevelMarker, regexs.numberPrefix);
	parser.sumIfNumberAlreadyFound = true;

	return parser.parseText(currentDocument.getText());
}


function displayResultat(tree: Tree<Part>, context: vscode.ExtensionContext){
	let viewer = new TreeHtmlViewer(context.extensionPath, 'src/media');
	const webview = vscode.window.createWebviewPanel('sumViewerPanel', 'SumViewer', vscode.ViewColumn.Two, {
		localResourceRoots:[
			vscode.Uri.file(path.join(context.extensionPath, 'src/media'))
		]
	});
	webview.webview.html = viewer.treeToTable(tree);
}

// this method is called when your extension is deactivated
export function deactivate() {}