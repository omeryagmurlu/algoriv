const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');

require('electron-reload')(path.join(__dirname, '/public'));

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
const createMain = () => {
	// BrowserWindow.addDevToolsExtension('/home/omer/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.0.12_0');

	const mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800
	});

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 600,
		minHeight: 800,
		toolbar: false,
		show: false, // FOUC FIX
	});

	mainWindowState.manage(mainWindow);

	mainWindow.loadURL(`file://${path.join(__dirname, '/index.electron.html')}`);

	// mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => (mainWindow = null));

	mainWindow.on('ready-to-show', () => {
		mainWindow.show(); // FOUC FIX
		mainWindow.focus();
	});
};
app.on('ready', createMain);

app.on('browser-window-created', (e, window) => {
	window.setMenu(null); // get rid of menu
});

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
		createMain();
	}
});
