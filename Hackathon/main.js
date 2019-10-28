const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  // Open the DevTools.
  win.webContents.openDevTools();
}

app.on("ready", createWindow);
