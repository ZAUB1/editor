const {remote} = require('electron');
const editor = remote.getGlobal("editor");

$(() => {
    const aEditor = ace.edit("editor");

    aEditor.setTheme("ace/theme/monokai");
    aEditor.session.setMode("ace/mode/javascript");
    aEditor.setPrintMarginColumn(900);
    aEditor.setShowInvisibles(true);

    editor.getCurrentFolder((files) => {
        console.log(files);
    });
});