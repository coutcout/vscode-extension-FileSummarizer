'use strict';

import { Part } from "../part";
import { cpus } from "os";
import { Uri } from "vscode";
import { HTMLGenerator } from "../tools/htmlGenerator";
import { Tree, TreeNode } from "@coutcout/tree-datastructure";

export class TreeHtmlViewer<T extends Part> {

    extPath: string;
    mediaPath: string;
    
    constructor(extPath: string, mediaPath: string){
        this.extPath = extPath;
        this.mediaPath = mediaPath;
    }

    treeToTable(tree: Tree<T>): string{
        let tableHeader =`
            <tr><th>Titre</th><th>Estimation</th></tr>
        `;

        let table = `
        <table>
            ${tableHeader}
            ${this.treeNodeToTable(tree.getRoot())}
        </table>
        `;

        let htmlGenerator = new HTMLGenerator(this.extPath, this.mediaPath);
        htmlGenerator.addMeta(`<meta charset="utf-8">`);
        htmlGenerator.addMeta(`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; style-src vscode-resource: 'unsafe-inline';">`);

        htmlGenerator.addExternalStyle("styles/sumViewer.css");

        htmlGenerator.body = table;

        return htmlGenerator.generateHTML();
    }

    private treeNodeToTable(node: TreeNode<T>): string{
        let nodeHtml = node.getParent() ? `<tr><td class="title" style="--level:${node.value.level - 1};">${node.value.title ? node.value.title : ""}</td><td class="number">${node.value.number ? node.value.number : ""}${node.value.numberSuffix ? node.value.numberSuffix : ""}</td></tr>` : "";

        node.getChilds().forEach(child => {
            nodeHtml += this.treeNodeToTable(child);
        });

        return nodeHtml;
    }
}