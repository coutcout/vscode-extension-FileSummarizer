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
	let disposable = vscode.commands.registerCommand('filesummarizer.display', () => {
		let currentTxtEditor = vscode.window.activeTextEditor;

		if(currentTxtEditor){
			let currentDocument = currentTxtEditor.document;
			let settings = vscode.workspace.getConfiguration("filesummarizer");

			const tree = parseDocument(settings, currentDocument);
			displayResultat(tree, context);
		}
	});

	context.subscriptions.push(disposable);
}

function parseDocument(settings: vscode.WorkspaceConfiguration, currentDocument: vscode.TextDocument): Tree<Part> {
	let model = settings;

	let parser = new InputParser(model.titleLevelMarker, model.delimiter, model.categories);

	return parser.parseText(currentDocument.getText());
}


function displayResultat(tree: Tree<Part>, context: vscode.ExtensionContext){
	let viewer = new TreeHtmlViewer(context.extensionPath, 'src/media');
	const webview = vscode.window.createWebviewPanel('fileSummarizerPanel', 'FileSummarizer', vscode.ViewColumn.Two, {
		localResourceRoots:[
			vscode.Uri.file(path.join(context.extensionPath, 'src/media'))
		]
	});
	webview.webview.html = viewer.treeToTable(tree);
}

export function deactivate() {}