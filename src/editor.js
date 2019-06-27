const {BrowserWindow} = require("electron");
const fs = require('fs');

module.exports = class Editor {
    constructor()
    {
        this.win = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.win.loadFile("./src/renderer/index.html");
        this.win.webContents.openDevTools();

        this.win.maximize();

        this.currentFiles = [];
    }

    getCurrentFolder(cb)
    {
        fs.readdir(__dirname, (err, files) => {
            if (err)
                throw err;

            let arr = [];

            files.forEach(file => {
                if (file.includes("."))
                    arr.push({n: file, type: "file", extension: file.split(".")[1]});
                else
                    arr.push({n: file, type: "folder"});
            });

            this.currentFiles = files;
            cb(arr);
        });
    }

    getFileContent(file)
    {
        return fs.readFileSync(__dirname + "/" + this.currentFiles[file], 'utf8');
    }
}