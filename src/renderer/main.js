const {remote} = require('electron');
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

$(() => {
    var aEditor;
    const expItems = document.getElementById("expi");

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
    });

    editor.getCurrentFolder((files) => {
        console.log(files);

        let ht = "";

        for (let i = 0; i < files.length; i++)
        {
            const file = files[i];
            let name = "";

            if (file.type == "file")
            {
                name += "(";

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
            }
            else
            {
                name += "->  " + file.n;
            }

            ht += "<exploreritem onclick=\"selectfile(" + i + ")\">" + name + "</exploreritem>\n";
        };

        expItems.innerHTML = ht;
    });

    selectfile = function(file)
    {
        aEditor.setValue(editor.getFileContent(file));
    };
});