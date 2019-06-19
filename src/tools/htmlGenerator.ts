'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

export class HTMLGenerator {
    private HTML_TEMPLATE =`
        <!doctype html>
        <html>
            <head>
                HEAD_META
                HEAD_SCRIPT
                HEAD_STYLE
            </head>
            <body>
                BODY
            </body>
        </html>
    `;

    private headMeta: string[] = [];
    private headScript: string[] = [];
    private headStyle: string[] = [];

    body!: string;

    extPath: string;
    mediaPath!: string;

    constructor(extPath: string, mediaPath: string){
        this.extPath = extPath;
        this.mediaPath = mediaPath;
    }

    generateHTML(): string{
        let html = this.HTML_TEMPLATE;
        html = html.replace("HEAD_META", this.headMeta.join("\n"));
        html = html.replace("HEAD_SCRIPT", this.headScript.join("\n"));
        html = html.replace("HEAD_STYLE", this.headStyle.join("\n"));
        html = html.replace("BODY", this.body ? this.body : "");

        return html;
    }
    
    private getCompleteURI(scriptFile : string ) : vscode.Uri
    {
        if(!this.mediaPath){
            throw new Error("The media path is not set");
        }

        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.file(
        path.join(this.extPath, this.mediaPath, scriptFile)
        );

        // And the uri we use to load this script in the webview
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        return scriptUri ;
    }

    addMeta(meta: string){
        this.headMeta.push(meta);
    }

    addExternalStyle(uri: string){
        let completeURI = this.getCompleteURI(uri);
        let style =`
            <link rel="stylesheet" href="${completeURI}" type="text/css">
        `;
        this.headStyle.push(style);
    }
    
    addExternalScript(uri: string){
        let completeURI = this.getCompleteURI(uri);
        let script =`
            <script src=${completeURI}></script>
        `;
        this.headScript.push(script);
    }
}