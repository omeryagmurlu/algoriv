/* global Babel */

require('babel-standalone/babel.min.js');

const BabelLocal = Babel;
Babel = undefined; // eslint-disable-line no-global-assign

export default BabelLocal;

export const isFakeModule = true;
