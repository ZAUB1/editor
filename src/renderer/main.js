const {remote} = require('electron');
const editor = remote.getGlobal("editor");

$(() => {
    const aEditor = ace.edit("editor");
    const expItems = document.getElementById("expi");

    aEditor.setTheme("ace/theme/monokai");
    aEditor.session.setMode("ace/mode/javascript");
    aEditor.setPrintMarginColumn(900);
    aEditor.setShowInvisibles(true);

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