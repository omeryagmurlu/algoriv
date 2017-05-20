class Settings {
	constructor(localStorage) {
		this.storage = localStorage;
	}

	set = (settings = {}, cb = () => {}) => {
		let fn = settings;
		if (typeof settings !== 'function') {
			fn = () => settings;
		}

		const prevSettings = this.get();
		this.storage.setItem('settings', JSON.stringify({
			...prevSettings,
			...fn(prevSettings)
		}));

		cb();
	}

	defaults = (settings = {}, cb = () => {}) => {
		this.storage.setItem('settings', JSON.stringify({
			...settings,
			...this.get()
		}));
		cb();
	}

	get = () => JSON.parse((this.storage.getItem('settings') || '{}'))
}

export default Settings;
