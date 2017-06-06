import { themeVars } from 'app/utils';

import 'brace';
import 'brace/mode/plain_text';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/solarized_light';
import 'brace/theme/katzenmilch';
import 'brace/theme/tomorrow_night';

// const themes = [
//   'monokai',
//   'github',
//   'tomorrow',
//   'kuroir',
//   'twilight',
//   'xcode',
//   'textmate',
//   'solarized_dark',
//   'solarized_light',
//   'terminal',
// ]

export const selectProps = theme => ({
	listStyle: {
		backgroundColor: themeVars(theme)('primary2Color')
	},
	floatingLabelStyle: {
		color: themeVars(theme)('textColor')
	},
	underlineStyle: {
		display: 'none'
	},
	iconStyle: {
		fill: themeVars(theme)('textColor')
	},
});

export const subheaderProps = () => ({
	style: {
		lineHeight: '36px'
	}
});

export const textFieldProps = theme => ({
	underlineFocusStyle: {
		borderColor: themeVars(theme)('primary2Color')
	},
	underlineStyle: {
		borderColor: themeVars(theme)('primary1Color')
	},
	floatingLabelStyle: {
		color: themeVars(theme)('textColor'),
	},
	floatingLabelFocusStyle: {
		color: themeVars(theme)('primary2Color'),
	},
});

const themeToSyntaxTheme = {
	dark: 'tomorrow_night_eighties',
	'giant-goldfish': 'solarized_light',
	'cheer-up': 'katzenmilch',
	sugar: 'solarized_light',
	'thought-provoking': 'tomorrow_night',
	'fresh-cut': 'katzenmilch',
};

export const aceEditorProps = theme => ({
	mode: 'plain_text',
	theme: themeToSyntaxTheme[theme] || 'monokai',
	showPrintMargin: false,
	showGutter: true,
	highlightActiveLine: true,
	tabSize: 4,
	editorProps: {
		$blockScrolling: Infinity
	},
});
