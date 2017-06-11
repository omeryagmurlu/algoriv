/* eslint-env mocha, chai */
import { settingsMock } from 'app/__tests__/test-utils';
import Modules from '../modules';

const moduleTester = ({
	name: MNAME,
	snap: {
		params: SNAPPARAMS,
		returns: SNAPOBJ
	},
	module: {
		params: MODULEPARAMS,
		type: MTYPE,
		location: MLOCATION,
		dataFn: MDATAFN
	},
	optDescs = () => {}
}) => describe(MNAME, () => {
	let m;

	beforeEach(() => {
		m = Modules[MNAME];
	});

	it('.snap', () => {
		if (typeof SNAPOBJ === 'object') {
			expect(m.snap(...SNAPPARAMS)).to.be.deep.equal(SNAPOBJ);
		} else {
			SNAPOBJ(expect(m.snap(...SNAPPARAMS)));
		}
	});

	it('.module.type', () => {
		expect(m.module(...MODULEPARAMS)).to.be.an('object').that.has.property('type', MTYPE);
	});

	it('.module.layout', () => {
		const layObj = expect(m.module(...MODULEPARAMS)).to.be.an('object').that.has.property('layout').that.is.an('object');
		layObj.has.property('location', MLOCATION);
		layObj.has.property('order');
	});

	it('.module.data', () => {
		MDATAFN(expect(m.module(...MODULEPARAMS)).to.have.property('data'));
	});

	optDescs(...MODULEPARAMS);
});

describe('modules', () => {
	moduleTester({
		name: 'Graph',
		snap: {
			params: ['a', 'b', 'c'],
			returns: {
				colors: 'a',
				customLabels: 'b',
				optGraph: 'c'
			}
		},
		module: {
			params: ['x'],
			type: 'graph',
			location: 'main',
			dataFn: data => {
				data.is.an('object').that.has.property('options', 'x');
			}
		}
	});

	moduleTester({
		name: 'Table',
		snap: {
			params: [[
				[1, 2, 3],
				['one', 'two', 'three']
			]],
			returns: { data: [[1, 'one'], [2, 'two'], [3, 'three']] }
		},
		module: {
			params: [['Numbers', 'String']],
			type: 'table',
			location: 'right',
			dataFn: data => data.is.an('object').that.has.deep.property('columns', ['Numbers', 'String'])
		}
	});

	moduleTester({
		name: 'Text',
		snap: {
			params: ['yazidir bu'],
			returns: { text: 'yazidir bu' }
		},
		module: {
			params: [],
			type: 'text',
			location: 'right',
			dataFn: data => data.is.an('object').that.has.property('text')
		}
	});

	moduleTester({
		name: 'Examples',
		snap: {
			params: [],
			returns: {}
		},
		module: {
			params: ['stuffName', 'examples are here', undefined, settingsMock([{ name: 'get this', data: 'madata' }]).settings],
			type: 'examples',
			location: 'left',
			dataFn: data => data.is.an('object').that.deep.includes({
				exampleGroup: 'stuffName',
				examples: 'examples are here',
				customs: [{ name: 'get this', data: 'madata' }]
			})
		},
		optDescs: (...modParams) => {
			describe('.data - Methods', () => {
				let mock;
				let m;
				beforeEach(() => {
					mock = settingsMock([{ name: 'get this', data: 'madata' }], [
						{ name: 'deleteMe', data: 'yup plz' },
						{ name: 'but', data: 'not me' },
					]);
					const imprams = modParams.map((v, i) => (i === 3 ? mock.settings : v));
					m = Modules.Examples.module(...imprams);
					mock.resetTrace();
				});

				it('.addCustom', () => {
					m.data.addCustom('boo', 'arsh');
					expect(mock.trace()[2].data).to.be.deep.equal([
						{ name: 'deleteMe', data: 'yup plz' },
						{ name: 'but', data: 'not me' },
						{ name: 'boo', data: 'arsh' }
					]);
				});

				it('.deleteCustom', () => {
					m.data.deleteCustom('deleteMe');
					expect(mock.trace()[2].data).to.be.deep.equal([{ name: 'but', data: 'not me' }]);
				});

				it('.renameCustom', () => {
					m.data.renameCustom('deleteMe', 'deleteMeNoLonger');
					expect(mock.trace()[2].data).to.be.deep.equal([
						{ name: 'deleteMeNoLonger', data: 'yup plz' },
						{ name: 'but', data: 'not me' }
					]);
				});
			});
		}
	});

	moduleTester({
		name: 'Code',
		snap: {
			params: [[5, 6]],
			returns: { highlights: [5, 6] }
		},
		module: {
			params: ['take this code'],
			type: 'code',
			location: 'right',
			dataFn: data => data.is.an('object').that.has.property('code').which.is.equal('take this code')
		}
	});

	moduleTester({
		name: 'Description',
		snap: { params: [], returns: {} },
		module: {
			params: ['take this text'],
			type: 'description',
			location: 'left',
			dataFn: data => data.is.an('object').that.has.property('text').which.is.equal('take this text')
		}
	});
});
