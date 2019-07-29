'use strict';

import { Part } from "../classes/part";
import { Tree, TreeNode } from "@coutcout/tree-datastructure";

/**
 * Parser engine
 */
export class InputParser{
    private titleLevelMarker: string;
    private delimiter: string;
    private categories: any[];

    constructor(titleLevelMarker: string, delimiter: string, categories: any[]){
        this.titleLevelMarker = titleLevelMarker;
        this.delimiter = delimiter;
        this.categories = categories;
    }

    /**
     * Parse the string parameter into a Tree
     * @param textToParse Text to parse
     */
    parseText(textToParse: string): Tree<Part>{
        const titleRegex = this.getTitleLineRegex();        
        let tree: Tree<Part> = new Tree(new Part(0, "root"));
        
        let parent: TreeNode<Part> = tree.getRoot();
        let res;
        let part!: Part;
        // Reading line by line
        for (const line of textToParse.split(/[\r\n]+/)){
            if((res = titleRegex.exec(line)) !== null){
                // Title found
                part = new Part(res[1].length, res[2]);
                if (parent.value.level < part.level) {
                    parent = parent.addChild(part);
                }
                else {
                    parent = parent.getParent(parent.value.level - part.level).addChild(part);
                }
            } else {
                // For each category set in extension's settings
                for(const category of this.categories){
                    if(part !== null){
                        const regex = this.getLineRegex(category);

                        const res = regex.exec(line);
                        if(res !== null){
                            part.addColumn(category.name, category.suffix, category.operation, category.concatentionDelimiter);
                            part.addValue(category.name, res[1]);
                        }
                    }  
                }
            }
        }

        return tree;
    }

    /**
     * Generate the regex of a title line
     */
    private getTitleLineRegex(): RegExp{
        let levelGroup = "(" + this.titleLevelMarker + "+?)";
	    let titleGroup = " +(.*)";

        let titleLineRegex = "^" + levelGroup + titleGroup + "?";
        
        return new RegExp(titleLineRegex);
    }

    /**
     * Generate the regex of the category in parameter
     * @param category Category set in settings
     */
    private getLineRegex(category: any): RegExp{
        let marker = category.delimiter ? category.delimiter : this.delimiter;
        let valueGroupe = marker + "(.*?)" + marker ;
        
        let lineRegex = "^" + category.identifier + "[^\\" + marker + "]*" + valueGroupe;
    
        return new RegExp(lineRegex);
    }
}