'use strict';

export enum TypeOperation{
    SUM = "SUM",
    CONCATENATION = "CONCAT",
    LAST = "LAST",
    FIRST = "FIRST"
    
}

/**
 * Get the enum value associated to the string in parameters
 * @param enumValue String value of the TypeOperation Enum
 */
export function getEnumKeyByEnumValue(enumValue:string): TypeOperation {
    let value = TypeOperation[enumValue as keyof typeof TypeOperation];
    return value ? value : TypeOperation.LAST;
}