# FileSummarizer

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/CouturierValentin.filesummarizer?style=flat-square)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/CouturierValentin.filesummarizer?style=flat-square)
![GitHub](https://img.shields.io/github/license/coutcout/vscode-extension-FileSummarizer?style=flat-square)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/CouturierValentin.filesummarizer?style=flat-square)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/CouturierValentin.filesummarizer?style=flat-square)
![Azure DevOps builds](https://img.shields.io/azure-devops/build/couturiervalentin/92ebe3f6-ba79-43fa-ae0d-681dc7221df6/3?style=flat-square)

Visual studio code extension to quickly visualize important elements of a file using keywords defined in the parameters.

## Commands

* "File Summarizer: Display document informations"
  * Key: filesummarizer.display
  * Description: Displays the retrieved information in a new Visual Studio Code window, in the form of a table.
* "File Summarizer: Copy the document information in HTML format to the clipboard"
  * Key: filesummarizer.copyToClipboard
  * Description: Copy the document information in HTML format to the clipboard

## Exemple

Avec les paramètres suivants:
![Paramétrage de l'exemple](https://github.com/coutcout/vscode-extension-FileSummarizer/blob/master/resources/images/display_parametres.png)

L'affiche suivant se produit:
![Exemple d'affichage d'information](https://github.com/coutcout/vscode-extension-FileSummarizer/blob/master/resources/gifs/display.gif)

## Paramétrage

```JSON
{
   "filesummarizer":{
        "titleLevelMarker":"#",
        "delimiter":"_",
        "categories":[
            {
                "name":"Estimation",
                "suffix":"j",
                "identifier":"Estimation",
                "operation":"SUM", // LAST by default
                "delimiter":"_",
                "concatentionDelimiter":"/" // In case of "CONCATENATION", "," by default
            },
            {
                "name":"Dépendance",
                "identifier":"Dépendance",
                "operation":"CONCAT",
                "delimiter":"_",
                "concatentionDelimiter":", "
            }
        ]
    }
}
```

* titleLevelMarker: Character marking the title level of a game
* delimiter: Value delimiter
* categories: A category corresponds to one information to be retrieved per part. This will correspond to a column in the result of the display
  * name: Category name that will be displayed in the header of the column
  * suffix: Element that will be added after the values in the column
  * identifier: Element that will identify a line as the line that includes the value to be retrieved
  * operation: Operation to be performed when several values are found for a part
  * delimiter: Overload the delimiter defined above
  * concatenationDelimiter: When the operation is concatenation, it is the character (or string) that will join the elements

## Operations

When several values have been found for the same part, there are 4 ways to handle this:

* SUM: Sum of all fields. Warning, values must be numbers
* CONCAT: Concatenation of values using concatenationDelimiter
* FIRST: Keep the first value found
* LAST: Keep the last value found

By default, the value is LAST.