import { themeVars } from 'app/utils';

import 'brace/mode/plain_text';
import 'brace/theme/monokai';
// import 'brace/theme/github';
// import 'brace/theme/tomorrow';
import 'brace/theme/tomorrow_night_eighties';
// import 'brace/theme/kuroir';
// import 'brace/theme/twilight';
// import 'brace/theme/xcode';
// import 'brace/theme/textmate';
// import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
// import 'brace/theme/terminal';

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

const themeToSyntaxTheme = {
	dark: 'tomorrow_night_eighties',
	'giant-goldfish': 'solarized_light'
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
