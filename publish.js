const execSync = require('child_process').execSync;
const package = require('./package.json');

const gitToken = process.argv[3] || "wrong_token";
const vsceToken = process.argv[2] || "wrong_token";

const repoURL = "https://" + gitToken + "@github.com/coutcout/vscode-extension-FileSummarizer.git";

const vsceCmd = "vsce publish -p " + vsceToken;

const npmCmd = "npm install";

console.log(">>> Installing dependencies");
execSync(npmCmd, {stdio:[0, 1, 2]});

console.log(">>> Publishing")
let isNewVersion = false;
try{
    execSync(vsceCmd, {stdio:[0, 1, 2]});
    isNewVersion = true;
} catch (error) {
    console.log(error);
}


if(isNewVersion){
    const version = package.version;

    const gitEMail = process.argv[4];
    const gitName = process.argv[5];

    if(version && gitEMail && gitName){
        console.log(">>> Creating tag " + version);
        const gitCmd = "git push " + repoURL + " " + version;

        execSync("git config --global user.email \""+ gitEMail +"\"");
        execSync("git config --global user.name \""+ gitName +"\"");
        execSync("git tag " + version + " -m " + version);

        console.log(">>> Pushing tag " + version + " on git repo");
        execSync(gitCmd, {stdio:[0, 1, 2]});
    }
} else {
    console.log("No new version created, no tag pushed");
}




