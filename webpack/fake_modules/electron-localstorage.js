import path from 'path';

const { remote: { app } } = require('electron');
const { LocalStorage: Lstor } = require('node-localstorage');

export function LocalStorage() {
	return new Lstor(path.join(app.getPath('userData'), './storage.json'));
}

export const isFakeModule = true;
