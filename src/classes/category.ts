'use strict';

import { TypeOperation, getEnumKeyByEnumValue } from "../enums/typeOperation";

/**
 * Represent a group for a document part
 */
export class CategoryPart {
    title: string;
    values: any[];
    suffix: string;
    delimiter: string;
    private operation: TypeOperation;

    constructor(title: string, suffix: string, operation: string, delimiter: string){
        this.title = title;
        this.suffix = suffix;
        this.operation = getEnumKeyByEnumValue(operation);
        this.delimiter = delimiter ? delimiter : ",";
        this.values = [];
    }

    getOperation(){
        return this.operation;
    }

    /**
     * Return the value computed depending the operation asked:
     * - SUM: sum all the values
     * - CONCATENATION: concatenate all the value with the instance delimiter
     * - FIRST: return the first value
     * - LAST: return the last value
     * - default: LAST
     */
    getComputedValue(): string {
        let res: string = "";
        switch(this.operation){
            case TypeOperation.SUM:{
                let sum = 0;
                this.values.forEach(value => {
                    if(isNaN(value)){
                        throw new Error("Impossible to sum not a number object");
                    }

                    sum += +value;
                });

                res = sum.toString();
                break;
            }
            case TypeOperation.CONCATENATION:{
                res = this.values.join(this.delimiter);
                break;
            }
            case TypeOperation.FIRST:{
                res = this.values.length > 0 ? this.values[0] : "";
                break;
            }
            case TypeOperation.LAST:
            default:{
                res = this.values.length > 0 ? this.values[this.values.length - 1] : "";
                break;
            }
        }

        if(this.suffix){
            res += this.suffix;
        }

        return res;
    }
}