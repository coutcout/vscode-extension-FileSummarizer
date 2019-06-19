'use strict';

export class Part {
    level: number;
    title: string | null | undefined;
    number: number | null | undefined;
    numberSuffix: string | null | undefined;

    constructor(level: number, title?: string, number?: number, numberSuffix?: string){
        this.level = level;
        this.title = title;
        this.number = number;
        this.numberSuffix = numberSuffix;
    }
}