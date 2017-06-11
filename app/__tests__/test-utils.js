/* eslint-env mocha */
import React from 'react';
import idObj from 'identity-obj-proxy';
import _mapValues from 'lodash.mapvalues';
import * as utils from 'app/utils';

export const MockComponent = (name) => props => {
	const { children, ...rProps } = props;
	return (<div mockName={name} mockProps={rProps}>{children}</div>);
};

export const StyleMocks = {
	'app/utils': _mapValues(utils, (v, k) => {
		if (k === 'themedStyle') {
			return () => (className, theme) => `${className} ${theme}`;
		}

		if (k === 'themeVars') {
			return (theme) => (key) => `${theme} ${key}`;
		}

		return v;
	})
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
