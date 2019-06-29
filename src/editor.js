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
        this.farr = [];

        global.editWin = this.win;
    }

    getCurrentFolder(cb)
    {
        fs.readdir(process.cwd(), (err, files) => {
            if (err)
                throw err;

            let arr = [];

            const ___dirname = process.cwd().split("\\").join("/");

            files.forEach(file => {
                if (file.includes("."))
                    arr.push({n: file, type: "file", extension: file.split(".")[1], path: ___dirname + "/" + file});
                else
                    arr.push({n: file, type: "folder", subfiles: [], opened: false, path: ___dirname + "/" + file});
            });

            this.farr = arr;
            this.currentFiles = files;
            cb(arr, ___dirname.split("/")[___dirname.split("/").length - 1]);
        });
    }

    getFileContent(file)
    {
        return fs.readFileSync(file, 'utf8');
    }

    saveFile(file, data)
    {
        return fs.writeFileSync(file, data);
    }

    getFolderFiles(folder, cb)
    {
        var index = this.farr.findIndex(p => p.path == folder);

        console.log(folder);

        if (!this.farr[index].opened)
        {
            fs.readdir(folder, (err, files) => {
                if (err)
                    throw err;

                //console.log(this.farr[folder]);

                let narr = [];

                const ___dirname = process.cwd().split("\\").join("/");

                files.forEach(file => {
                    if (file.includes("."))
                        narr.push({n: file, type: "file", extension: file.split(".")[1], path: folder + "/" + file});
                    else
                        narr.push({n: file, type: "folder", opened: false, subfiles: [], path: folder + "/" + file});
                });

                this.farr[index].subfiles = narr;

                cb(this.farr);

                this.farr[index].opened = true;
            });
        }
        else
        {
            this.farr[index].subfiles = [];
            cb(this.farr);

            this.farr[index].opened = false;
        }
    }
}