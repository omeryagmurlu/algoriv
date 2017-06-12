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
	const _set = (obj, causeChange) => {
		storage.setItem('settings', JSON.stringify(obj));
		if (causeChange) {
			changeHandler();
		}
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
			_set(wholeCtx, true); // .set must cause change since it mutates
		};
		fn.default = (val) => {
			const stuff = typeof val === 'function' ? val : () => val;
			if (!_isNil(context[key])) {
				return;
			}
			context[key] = stuff(context[key]);
			_set(wholeCtx, false); // but default is just prep, no need to change value
		};
		return fn;
	};

	const getH = (initialKey = false, ctx = _get(), deadFlag = false) => { // FIXME: time, impl aga.
		let deadFlagLocal = deadFlag;
		let context = ctx;
		if (initialKey) {
			if (!_isNil(ctx[initialKey])) {
				context = ctx[initialKey];
			} else {
				deadFlagLocal = true;
			}
		}
		const fn = key => {
			if (!deadFlagLocal && !_isNil(fn.ctx[key])) {
				return getH(false, fn.ctx[key]);
			}
			return getH(false, {}, true);
		};
		fn.get = (defVal = undefined) => (deadFlagLocal ? defVal : context);
		if (!deadFlagLocal) {
			fn.ctx = context;
		}
		return fn;
	};

	const selector = (key, list = []) => {
		if (key) {
			list.push(key);
		}

		const ferry = (gSH, met) => (...p) => {
			let curr = gSH(list[0]);
			list.slice(1).forEach(k => (curr = curr(k)));
			return curr[met](...p);
		};

		const fn = k => selector(k, list);
		fn.get = ferry(getH, 'get');
		fn.set = ferry(setH, 'set');
		fn.default = ferry(setH, 'default');

		return fn;
	};

	return selector;
};

export default Settings;
