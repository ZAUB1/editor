const {app} = require("electron");
const Editor = require("./editor");
require("./menu");

app.on("ready", () => {
    const editor = new Editor();

    global.editor = editor;
});