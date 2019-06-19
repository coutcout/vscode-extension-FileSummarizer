'use strict';

import { Part } from "../part";
import { Tree, TreeNode } from "@coutcout/tree-datastructure";

export class InputParser{
    private titleLevelMarker: string;
    private numberPrefix: string;
    sumIfNumberAlreadyFound: boolean = false;

    constructor(titleLevelMarker: string, numberPrefix: string){
        this.titleLevelMarker = titleLevelMarker;
        this.numberPrefix = numberPrefix;
    }

    parseText(textToParse: string): Tree<Part>{
        const titleRegex = this.getTitleLineRegex();
        const numberRegex = this.getNumberLineRegex();
        
        let tree: Tree<Part> = new Tree(new Part(0, "root", 0, ""));
        
        // On parcourt ligne par ligne
        let parent: TreeNode<Part> = tree.getRoot();
        let res;
        let part!: Part;
        for (const line of textToParse.split(/[\r\n]+/)){
            if((res = titleRegex.exec(line)) !== null){
                // On a trouvé un titre
                part = new Part(res[1].length, res[2]);
                if (parent.value.level < part.level) {
                    parent = parent.addChild(part);
                }
                else {
                    parent = parent.getParent(parent.value.level - part.level).addChild(part);
                }
            } else if ((res = numberRegex.exec(line)) !== null){
                // On a trouvé un nombre à l'intérieur d'une section de titre
                if(part !== null){
                    // Si on trouve un nombre avec le même suffixe, on additionne
                    if(this.sumIfNumberAlreadyFound && part.number && part.numberSuffix === res[2]){
                        part.number += parseFloat(res[1].replace(',','.'));
                    } else {
                        part.number = parseFloat(res[1].replace(',','.'));
                        part.numberSuffix = res[2];
                    }
                }
            }

        }

        return tree;
    }

    private getTitleLineRegex(): RegExp{
        let levelGroup = "(" + this.titleLevelMarker + "+?)";
	    let titleGroup = " +(.*)";

        let titleLineRegex = "^" + levelGroup + titleGroup + "?";
        
        return new RegExp(titleLineRegex);
    }

    private getNumberLineRegex(): RegExp{
        let numberGroup = "(\\d+(?:\\,\\d*)?)"; 
        let numberSuffixGroup = "([a-zA-Z][a-zA-Z0-9]*)";
        
        let numberLineRegex = "^" + this.numberPrefix + " *" + numberGroup + " *" + numberSuffixGroup;
    
        return new RegExp(numberLineRegex);
    }
}