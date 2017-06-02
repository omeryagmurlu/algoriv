const Helper = (interpreter) => {
	const toNative = value => {
		if (value.isPrimitive) {
			return value.data;
		}

		if (value.type === 'function') {
			return () => {
				throw new Error('Functions passed from interpreter to native are masked and will throw when invoked');
			};
		}

		const isArray = value.parent === interpreter.ARRAY;
		const ret = isArray ? [] : {};
		Object.keys(value.properties).forEach(name => {
			const propValue = value.properties[name];
			const propNativeValue = toNative(propValue);
			ret[name] = propNativeValue;
		});
		return ret;
	};

	const toInterpreter = (value, containerObj) => {
		const valueType = typeof value;
		if (valueType === 'number' ||
			valueType === 'string' ||
			valueType === 'boolean') {
			return interpreter.createPrimitive(value);
		} else if (valueType === 'undefined') {
			return interpreter.UNDEFINED;
		} else if (valueType === 'function') {
			const applyObj = containerObj || window;
			return interpreter.createNativeFunction(createGenericNativeWrapper(applyObj, value));
		} else if (valueType === 'object') {
			const parent = Array.isArray(value) ? interpreter.ARRAY : interpreter.OBJECT;
			const ret = interpreter.createObject(parent);
			Object.keys(value).forEach(name => {
				const propValue = value[name];
				const propInterpeterValue = toInterpreter(propValue, value);
				interpreter.setProperty(ret, name, propInterpeterValue);
			});
			return ret;
		}
		throw new Error(`Native to interpreter does not support type: ${valueType}`);
	};

	const createGenericNativeWrapper = (obj, func) => (...args) => {
		const nativeArgs = args.map((arg) => toNative(arg));

		const ret = func.apply(obj, nativeArgs);
		return toInterpreter(ret);
	};

	return {
		toNative,
		toInterpreter
	};
};

export default Helper;
