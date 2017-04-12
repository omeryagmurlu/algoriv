const electron = require('electron');
const path = require('path');

require('electron-reload')(path.join(__dirname, '/public'));

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
const createWindow = () => {
	BrowserWindow.addDevToolsExtension('/home/omer/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.0.12_0');

	mainWindow = new BrowserWindow({
		width: 500,
		height: 500,
		maximizeable: false
	});

	mainWindow.loadURL(`file://${path.join(__dirname, '/index.html')}`);

	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => (mainWindow = null));
};
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
