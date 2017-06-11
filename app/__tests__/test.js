/* eslint-env mocha */
import 'jsdom-global/register';
import chai from 'chai';
import 'chai/register-expect';
import chaiJestSnapshot from 'chai-jest-snapshot';

chai.use(chaiJestSnapshot);

before(() => {
	chaiJestSnapshot.resetSnapshotRegistry();
});

beforeEach(function snapshotBeforeEach() {
	const fileNameArray = [__dirname, '__snaps__'];
	const bail = suite => {
		if (suite.root) {
			return;
		}
		bail(suite.parent);
		fileNameArray.push(suite.title);
	};
	bail(this.currentTest.parent);
	fileNameArray.push(this.currentTest.title);
	chaiJestSnapshot.setFilename(`${fileNameArray.join('/')}.snap`);
	chaiJestSnapshot.setTestName(this.currentTest.fullTitle());
});
