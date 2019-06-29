const {app, Menu, MenuItem, ipcMain, dialog} = require("electron");
const Socket = require("zsockets");

const WSS = new Socket.WebSocketServer(8080, () => {
    console.log("Listening on port 8080");
});

const editWin = global.editWin;

const menu = new Menu;
Menu.setApplicationMenu(menu);

menu.append(new MenuItem({
    label: "File",
    submenu: [
        {
            label: "New File",
            click: () => {
                //This is gonna create a new file
            }
        },
        {type: "separator"},
        {
            label: "Open File",
            click: () => {
                //This is gonna open a file
            }
        },
        {
            label: "Open Folder",
            click: () => {
                const path = dialog.showOpenDialog(editWin, {
                    properties: ['openDirectory']
                });

                if (path)
                {
                    process.chdir(path[0]);
                    WSS.EmitToAll("changedir", {});
                }
            }
        },
        {type: "separator"},
        {
            label: "Save",
            click: () => {
                ipcMain.emit("askforsave");
            }
        },
        {
            label: "Save As",
            click: () => {
                //This is gonna prompt for file save
            }
        },
        {type: "separator"},
        {
            label: "Exit",
            click: () => {
                app.quit();
            }
        }
    ]
}));