import _isNil from 'lodash.isnil';

// BUG: referencing a middle point causes undefined behaviour:
//      eg.   const a = settings('a')('b');
//            a('c').set(value) // => value
//            a('c').set(anotherVal) => still value
//            a(' ').get() => undefined!!!
//      workaround: reference using functions, evaluate on call:
//      eg.   const a = () => settings('a')('b')
const Settings = (storage, changeHandler = () => {}) => {
	const _get = () => JSON.parse((storage.getItem('settings') || '{}'));
	const _set = (obj) => {
		storage.setItem('settings', JSON.stringify(obj));
		changeHandler();
	};

	const setH = (key = false, context = _get(), wC) => {
		const wholeCtx = wC || context;
		const fn = inKey => {
			let ctx;
			if (context[key]) {
				ctx = context[key];
			} else {
				ctx = context[key] = {};
			}
			return setH(inKey, ctx, wholeCtx);
		};
		fn.set = (val) => {
			const stuff = typeof val === 'function' ? val : () => val;
			// Well, we are already getting shit from localstorage, so parsed, once more wont hurt
			context[key] = stuff(context[key]);
			_set(wholeCtx);
		};
		fn.default = (val) => {
			const stuff = typeof val === 'function' ? val : () => val;
			if (!_isNil(context[key])) {
				return;
			}
			context[key] = stuff(context[key]);
			_set(wholeCtx);
		};
		return fn;
	};

	const getH = (initialKey = false, ctx = _get(), deadFlag = false) => { // FIXME: time, impl aga.
		let context = ctx;
		if (initialKey) {
			if (!_isNil(ctx[initialKey])) {
				context = ctx[initialKey];
			} else {
				deadFlag = true;
			}
		}
		const fn = key => {
			if (!deadFlag && !_isNil(fn.ctx[key])) {
				return getH(false, fn.ctx[key]);
			}
			return getH(false, {}, true);
		};
		fn.get = (defVal = undefined) => (deadFlag ? defVal : context);
		if (!deadFlag) {
			fn.ctx = context;
		}
		return fn;
	};

	const selector = (key, list = []) => {
		if (key) {
			list.push(key);
		}

		const fn = k => selector(k, list);
		fn.get = (...p) => {
			let curr = getH(list[0]);
			list.slice(1).forEach(k => (curr = curr(k)));
			return curr.get(...p);
		};

		fn.set = (...p) => {
			let curr = setH(list[0]);
			list.slice(1).forEach(k => (curr = curr(k)));
			return curr.set(...p);
		};

		fn.default = (...p) => {
			let curr = setH(list[0]);
			list.slice(1).forEach(k => (curr = curr(k)));
			return curr.default(...p);
		};

		return fn;
	};

	return selector;
};

export default Settings;
