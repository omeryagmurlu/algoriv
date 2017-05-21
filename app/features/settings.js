import _merge from 'lodash.merge';
import _isNil from 'lodash.isnil';

class Settings {
	constructor(localStorage) {
		this.storage = localStorage;
	}

	set = (settings = {}, areWeDefault, cb = () => {}) => {
		let fn = settings;
		if (typeof settings !== 'function') {
			fn = () => settings;
		}

		const prevSettings = this.get();

		const zirka = [
			prevSettings.get(),
			fn(JSON.parse(JSON.stringify(prevSettings.get())))
		];
		if (areWeDefault) {
			zirka.reverse();
		}

		this.storage.setItem('settings', JSON.stringify(
			_merge(
				{},
				zirka[0],
				zirka[1]
			)
		));
		cb();
		return this.get();
	}

	defaults = (objfunc, cb) => this.set(objfunc, true, cb)

	_get = () => JSON.parse((this.storage.getItem('settings') || '{}'))

	_safeSet = (key = false, context = this._get(), wholeCtx = this._get()) => {
		const fn = inKey => {
			let ctx;
			if (context[key]) {
				ctx = context[key];
			} else {
				ctx = context[key] = {};
			}
			return this._safeSet(inKey, ctx, wholeCtx);
		};
		fn.set = val => {
			context[key] = val;
		};
		fn.default = val => {
			context[key] = _isNil(context[key]) ? val : context[key];
		};
		return fn;
	}

	get = (initialKey = false, ctx = this._get(), deadFlag = false) => {
		let context = ctx;
		if (initialKey) {
			context = ctx[initialKey];
		}
		const fn = key => {
			if (!deadFlag && fn.ctx[key]) {
				return this.get(false, fn.ctx[key]);
			}
			return this.get(false, {}, true);
		};
		fn.get = (defVal = undefined) => (deadFlag ? defVal : context);
		if (!deadFlag) {
			fn.ctx = context;
		}
		return fn;
	}
}

export default Settings;
