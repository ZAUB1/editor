const {BrowserWindow} = require("electron");
const fs = require('fs');

module.exports = class Editor {
    constructor()
    {
        this.win = new BrowserWindow({
            //
        });

        this.win.loadFile("./src/renderer/index.html");
        this.win.webContents.openDevTools();
    }

    getCurrentFolder(cb)
    {
        fs.readdir(__dirname, (err, files) => {
            if (err)
                throw err;

            cb(files);
        });
    }
}