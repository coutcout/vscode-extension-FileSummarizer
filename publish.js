const execSync = require('child_process').execSync;
const package = require('./package.json');

const gitToken = process.argv[3] || "wrong_token";
const vsceToken = process.argv[2] || "wrong_token";

const repoURL = "https://" + gitToken + "@github.com/coutcout/vscode-extension-FileSummarizer.git";
const gitCmd = "git push --follow-tags " + repoURL + " origin/master";

const vsceCmd = "vsce publish -p " + vsceToken;

const npmCmd = "npm install";

console.log(">>> Installing dependencies");
execSync(npmCmd, {stdio:[0, 1, 2]});

console.log(">>> Publishing");
execSync(vsceCmd, {stdio:[0, 1, 2]});

const version = package.version;
if(version){
    console.log(">>> Creating tag " + version);
    execSync("git tag " + version + " -m " + version);

    console.log(">>> Pushing tags on git repo");
    execSync(gitCmd, {stdio:[0, 1, 2]});
}



