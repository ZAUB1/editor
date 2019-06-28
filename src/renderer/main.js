const {remote, ipcRenderer} = require('electron');
const editor = remote.getGlobal("editor");
const path = require('path');
const amdLoader = require('../../node_modules/monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;
//const amdDefine = amdLoader.require.define;
const panda = require("./Panda.json").tokenColors;

function uriFromPath(_path)
{
    var pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/')
    {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}

var currentfile;

$(() => {
    var aEditor;
    const expItems = document.getElementById("expi");
    const folderName = document.getElementById("foldername");
    const lineCounter = document.getElementById("linecounter");

    amdRequire.config({
        baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
    });

    self.module = undefined;
    amdRequire(['vs/editor/editor.main'], () => {
        let arr = [];
        for (let i = 0; i < panda.length; i++)
        {
            arr.push({token: panda[i].scope, foreground: panda[i].settings.foreground});
        }

        monaco.editor.defineTheme('panda', {
            base: "vs-dark",
            inherit: true,
            rules: arr
        });
        monaco.editor.setTheme('panda');

        aEditor = monaco.editor.create(document.getElementById("editor"), {
            automaticLayout: true,
            value: "",
            language: 'javascript',
            theme: "panda",
            fontLigatures: true,
            renderWhitespace: "all",
            fontFamily: 'FiraEdit',
            tabSize: 4,
            indentSize: 4
        });

        setTimeout(() => {
            monaco.editor.remeasureFonts();
        }, 500);

        //aEditor.getModel().updateOptions({  });

        aEditor.getModel().onDidChangeContent((event) => {
            lineCounter.innerHTML = "Lines : " + (aEditor.getValue().split(/\r\n|\r|\n/).length || 0);
        });
    });

    const genFileName = (file) => {
        let name = "(";

        switch (file.extension)
        {
            case "cs":
                name += "C#";
                break;
            case "cpp":
                name += "C++";
                break;

            default:
                name += (file.extension).toUpperCase()
        }

        name += ") " + file.n;

        return name;
    };

    const genfiles = (files) => {
        let ht = "";

        for (let i = 0; i < files.length; i++)
        {
            const file = files[i];

            if (file.type == "file")
            {
                ht += "<exploreritem onclick=\"selectfile('" + file.path + "')\">" + genFileName(file) + "</exploreritem>\n";
            }
            else
            {
                let name = "";
                name += "->  " + file.n;

                ht += "<exploreritem onclick=\"selectfolder('" + file.path + "')\">" + name + "</exploreritem>\n";

                const subfiles = file.subfiles;
                for (let ii = 0; ii < subfiles.length; ii++)
                {
                    if (subfiles[ii].type == "file")
                        ht += "<exploreritem style = 'left: 10px' onclick=\"selectfile('" + subfiles[ii].path + "')\">" + genFileName(subfiles[ii]) + "</exploreritem>\n";
                    else
                        ht += "<exploreritem style = 'left: 10px' onclick=\"selectfolder('" + subfiles[ii].path + "')\">" + "-> " + subfiles[ii].n + "</exploreritem>\n";
                }
            }

        }

        expItems.innerHTML = ht;
    };

    editor.getCurrentFolder((files, fname) => {
        genfiles(files);

        foldername.innerHTML = "<leftsidetxt style='left: 10px'>" + fname + "</leftsidetxt>"
    });

    selectfile = function(file)
    {
        currentfile = file;
        aEditor.setValue(editor.getFileContent(file));

        const splitted = file.split("/")
        let model;

        switch (splitted[splitted.length - 1].split(".")[1])
        {
            case "js":
                model = "javascript";
                break;
            case "cs":
                model = "csharp";
                break;

            default:
                model = splitted[splitted.length - 1].split(".")[1];
        }

        monaco.editor.setModelLanguage(aEditor.getModel(), model);
    };

    selectfolder = function(folder)
    {
        editor.getFolderFiles(folder, (nfiles) => {
            genfiles(nfiles);
        });
    }

    window.addEventListener("keypress", (e) => {
        if (e.ctrlKey)
        {
            console.log(e.keyCode)
            switch (e.keyCode)
            {
                case 19:
                    if (currentfile)
                        editor.saveFile(currentfile, aEditor.getValue());
                    break;

                default:
                    //
            }
        }
    });

    ipcRenderer.on("askforsave", () => {
        editor.saveFile(currentfile, aEditor.getValue());
    });
});