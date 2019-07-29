'use strict';

import { CategoryPart } from "./category";

export class Part {
    level: number;
    title: string | null | undefined;
    categories: CatgoryValue = {};

    constructor(level: number, title?: string){
        this.level = level;
        this.title = title;
    }

    addColumn(categoryName: string, suffix: string, operation: string, delimiter: string){
        if(!this.categories[categoryName]){
            this.categories[categoryName] = new CategoryPart(categoryName, suffix, operation, delimiter);
        }
    }

    addValue(categoryName: string, value: any){
        this.categories[categoryName].values.push(value);
    }
}

interface CatgoryValue {
    [key: string]: CategoryPart;
}