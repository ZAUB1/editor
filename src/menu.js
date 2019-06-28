const {app, Menu, MenuItem, ipcMain} = require("electron");

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
                //This is gonna open a folder
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