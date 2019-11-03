'use strict';

import { Part } from "../classes/part";
import { HTMLGenerator } from "vsce-html-generator";
import { Tree, TreeNode } from "@coutcout/tree-datastructure";

/**
 * Generate the HTML code of a Tree
 */
export class TreeHtmlViewer<T extends Part> {

    extPath: string;
    mediaPath: string;
    
    constructor(extPath: string, mediaPath: string){
        this.extPath = extPath;
        this.mediaPath = mediaPath;
    }

    /**
     * Convert a tree in HTML code
     * @param tree The tree to convert
     */
    treeToTable(tree: Tree<T>): string{

        // Transformation of the tree into data usable in HTML generation
        let data = this.treeToDataTable(tree);

        let tableHeader = this.generateHeader(data);

        let tableContent = this.generateContent(data);

        let table = `
        <table>
            ${tableHeader}
            ${tableContent}
        </table>
        `;

        let htmlGenerator = new HTMLGenerator(this.extPath, this.mediaPath);
        
        // Adding external stylesheet
        htmlGenerator.addExternalStyle("sumviewer", "styles/sumViewer.css");

        htmlGenerator.body = table;

        return htmlGenerator.generateHTML();
    }

    /**
     * Generate the table body
     * @param data Data used to generate the table
     */
    private generateContent(data: DataTable) {
        let tableContent = "";
        for (const line of data.lines) {
            let lineHtml = "<tr>";
            for (const column of data.headers) {
                let level = "";
                if(column === "Titre"){
                    level = line["Level"];
                }
                let value = line[column] ? line[column] : "";
                lineHtml += "<td>" + level +" "+ value + "</td>";
            }
            lineHtml += "</tr>";
            tableContent += lineHtml;
        }
        return tableContent;
    }

    /**
     * Generate the table header
     * @param data Data used to generate the table
     */
    private generateHeader(data: DataTable) {
        let headerContent = "";
        for (const header of data.headers) {
            headerContent += "<th>" + header + "</th>";
        }
        let tableHeader = `
            <tr>${headerContent}</tr>
        `;
        return tableHeader;
    }

    /**
     * Convert a tree into a datatable object
     * @param tree Tree to transform
     */
    private treeToDataTable(tree: Tree<T>): DataTable{
        let res: DataTable = {
            "headers":[],
            "lines":[]
        };

        let root = tree.getRoot();
        res.headers.push("Titre");
        this.nodeToData(root, res, "");
        return res;
    }

    /**
     * Convert a TreeNode into a datatable object
     * @param node Node to transform
     * @param res datable object to modify
     */
    private nodeToData(node: TreeNode<T>, res: DataTable, level: string){
        let nodes = node.getChilds();
        let tabulationChar = "-";
        let childNumber = 1;
        for(const child of nodes){
            let value: Part = child.value;
            let line:{[key: string]: any} = {};
            let nodeLevel = level + childNumber + ".";

            // Getting title of the part
            line["Titre"] = value.title;
            line["Level"] = nodeLevel;
            console.log("Node: %s - Beginning", value.title);
            // Getting the elements described into the extension settings
            for(const category of Object.values(value.categories)){
                // If the category is not already found, we add it
                if(!res.headers.includes(category.title)){
                    res.headers.push(category.title);
                }

                line[category.title] = category.getComputedValue();
                console.log("   Category: %s - Value: %s", category.title, category.getComputedValue());  
            }
            res.lines.push(line);
            console.log("Node: %s - End", value.title);

            this.nodeToData(child, res, nodeLevel);
            childNumber++;
        }
    }
}

interface DataTable{
    headers:string[];
    lines: {
        [key: string]: any
    }[];
}