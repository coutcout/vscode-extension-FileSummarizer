# vscode-extension-FileSummarizer

Extension Visual studio code permettant de visualiser rapidement les éléments importants d'un fichier à l'aide de mots clés définis dans les paramètres.

## Commande

Utiliser la commande "File Summarizer: Display document informations" disponible sous le paramétrage filesummarizer.display.

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
                "name":"Dépenance",
                "identifier":"Dépendance",
                "operation":"CONCAT",
                "delimiter":"_",
                "concatentionDelimiter":", "
            }
        ]
    }
}
```

* titleLevelMarker: Caractère marquant le niveau de titre d'une partie
* delimiter: Délimiteur de la valeur à garder
* categories: Une catégorie correspond à une information à récupérer par partie. Cela correspondra à une colonne dans le résultat de l'affichage
  * name: Nom de la catégorie qui sera affiché en tête de colonne
  * suffix: Elément qui sera rajouter à la suite des valeurs dans la colonne
  * identifier: Elément qui permettra d'identifier une ligne comme étant la ligne qui comprend la valeur à récupérer
  * operation: Opération à effectuer lorsque plusieurs valeurs sont trouvées pour une partie
  * delimiter: Permet de surcharger le délimiteur définie plus haut
  * concatenationDelimiter: Lorsque l'opération est la concatenation, il s'agit du caractère (ou de la chaîne de caractères) qui joindra les éléments

## Les opérations

Lorsque plusieurs valeurs ont été trouvée pour une même partie, il y a 4 manières de gérer cela:

* SUM: Somme de tous les champs. Attention, les valeurs doivent être des nombres
* CONCAT: Concaténation des valeurs à l'aide du paramètre concatenationDelimiter
* FIRST: Garde la première valeur trouvée
* LAST: Garde la dernière valeur trouvée

Par défaut, la valeur est LAST.