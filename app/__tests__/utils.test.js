/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import UtilsInjector from 'inject-loader!app/utils';

const {
	themeVars,
	themedStyle
} = UtilsInjector({
	'app/styles/themes.json': {
		themes: {
			appleJoe: {
				marmelade: 'red'
			}
		}
	}
});

describe('utils', () => {
	describe('themeVars', () => {
		it('throws an error if style couldnt be found', () => {
			expect(() => themeVars('appleJoe')('nice')).to.throw();
			expect(() => themeVars('sdfdsf')('marmelade')).to.throw();
			expect(() => themeVars('sdfdsf')('sdfdsfsdsd')).to.throw();
		});

		it('returns the style for themes', () => {
			expect(themeVars('appleJoe')('marmelade')).to.be.equal('red');
		});
	});

	describe('themedStyle', () => {
		let s;
		let css;
		beforeEach(() => {
			s = {
				conty: 'very-hashy-conty',
				'conty-matheme': 'very-hashy-conty-with-theme'
			};
			css = themedStyle(s);
		});

		it('throws an error if no style is given', () => {
			expect(() => themedStyle()).to.throw('themedStyle: unknown style');
		});

		it('throws an error if the class couldnt be found', () => {
			expect(() => css('no conty arsch')).to.throw('themedStyle: could\'nt find:');
		});

		it('returns the name of the style with both -theme prefixed one and the nonprefixed one', () => {
			const style = expect(css('conty', 'matheme')).to.be.a('string');
			style.includes('very-hashy-conty-with-theme');
			style.includes('very-hashy-conty');
		});
	});
});
