/* eslint-env mocha */
import React from 'react';
import idObj from 'identity-obj-proxy';
import _mapValues from 'lodash.mapvalues';
import * as utils from 'app/utils';

export const MockComponent = (name) => {
	const fn = props => {
		const { children, ...rProps } = props;
		return (<div
			mockName={name}
			mockProps={rProps}
		>
			{children}
		</div>);
	};

	Object.defineProperty(fn, 'name', { value: name });

	return fn;
};

export const injectExport = (injectedOnes, whole = {}) => {
	const toRet = _mapValues(whole, v => v); // Not using fp for performance
	Object.defineProperty(toRet, '__esModule', { // this is ugly but the only way
		value: true // to be able to set default
	});
	Object.keys(injectedOnes).forEach(key => { // one can override default here
		toRet[key] = injectedOnes[key];
	});
	return toRet;
};

export const infiniteObj = (endpoints = {}) => new Proxy({}, {
	get: (_, prop) => endpoints[prop] || infiniteObj(endpoints)
});

export const StyleMocks = {
	'app/utils': injectExport({
		themedStyle: () => (className, theme) => `${className} ${theme}`,
		themeVars: (theme) => (key) => `${theme} ${key}`
	}, utils)
};

export const StyleVariablesMocks = {
	'app/styles/variables': idObj
};

export const StyleModuleComponentProps = {
	'app/styles/module-component-props': ['selectProps', 'subheaderProps', 'aceEditorProps', 'textFieldProps'].reduce((acc, v) => {
		acc[v] = () => ({});
		return acc;
	}, {})
};

export const settingsMock = (get, prev) => {
	let trace = [];
	const settings = (toTrace) => {
		trace.push({
			action: 'path',
			data: toTrace
		});
		return settings;
	};
	settings.get = () => {
		trace.push({
			action: 'get',
			data: trace[trace.length - 1].data
		});
		return get;
	};
	settings.set = x => {
		trace.push({
			action: 'set',
			data: typeof x === 'function' ? x(prev) : x
		});
	};
	settings.default = x => {
		trace.push({
			action: 'default',
			data: typeof x === 'function' ? x(prev) : x
		});
	};

	return { settings, trace: () => trace, resetTrace: () => (trace = []) };
};
