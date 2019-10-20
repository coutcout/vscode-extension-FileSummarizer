import * as vscode from 'vscode';
import * as path from 'path';

import { Tree } from '@coutcout/tree-datastructure';
import { Part } from './classes/part';
import { TreeHtmlViewer } from './viewers/treeHtmlViewer';
import { InputParser } from './tools/inputParser';

/**
 * Method called on extension activation
 * @param context Visual Studio code context
 */
export function activate(context: vscode.ExtensionContext) {

	console.log("Congratulation for activating FileSummarizer Extension");
	let display = vscode.commands.registerCommand('filesummarizer.display', () => {
		let currentTxtEditor = vscode.window.activeTextEditor;

		if(currentTxtEditor){
			let currentDocument = currentTxtEditor.document;
			let settings = vscode.workspace.getConfiguration("filesummarizer");

			const tree = parseDocument(settings, currentDocument);
			displayResultat(tree, context);
		}
	});

	let copyToClipboard = vscode.commands.registerCommand('filesummarizer.copyToClipboard', () => {
		let currentTxtEditor = vscode.window.activeTextEditor;

		if(currentTxtEditor){
			let currentDocument = currentTxtEditor.document;
			let settings = vscode.workspace.getConfiguration("filesummarizer");

			const tree = parseDocument(settings, currentDocument);
			let viewer = new TreeHtmlViewer(context.extensionPath, 'media');
			vscode.env.clipboard.writeText(viewer.treeToTable(tree));
		}
	});

	context.subscriptions.push(display);
	context.subscriptions.push(copyToClipboard);
}

function parseDocument(settings: vscode.WorkspaceConfiguration, currentDocument: vscode.TextDocument): Tree<Part> {
	let model = settings;

	let parser = new InputParser(model.titleLevelMarker, model.delimiter, model.categories);

	return parser.parseText(currentDocument.getText());
}


function displayResultat(tree: Tree<Part>, context: vscode.ExtensionContext){
	let viewer = new TreeHtmlViewer(context.extensionPath, 'media');
	const webview = vscode.window.createWebviewPanel('fileSummarizerPanel', 'FileSummarizer', vscode.ViewColumn.Two, {
		localResourceRoots:[
			vscode.Uri.file(path.join(context.extensionPath, 'media'))
		]
	});
	let html = viewer.treeToTable(tree);
	webview.webview.html = viewer.treeToTable(tree);
	vscode.env.clipboard.writeText(html);
}

export function deactivate() {}