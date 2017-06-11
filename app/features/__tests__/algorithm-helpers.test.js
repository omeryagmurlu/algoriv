/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import { injectExport, infiniteObj as infObj } from 'app/__tests__/test-utils.js';
import Injector from 'inject-loader!../algorithm-helpers';

const { default: Algorithm } = Injector({
	'app/features/modules': infObj({
		input: () => ({})
	}),
	'app/containers/AlgorithmContainer': injectExport({
		default: (prot) => <div name="AlgprithmFactory" Prototype={prot} />,
		framer: (logic, snaps) => (input) => ({ logic, snaps, input })
	}),
	'app/data/graphs': injectExport({
		graphs: [],
		randomGraph: () => infObj(),
		suitingGraphs: () => []
	}),
	'app/features/input-types': injectExport({
		InitInput: () => ({ type: 'mockedInit' })
	}),
	'app/utils': injectExport({
		graphologyImportFix: x => x
	})
});

describe('algorithm-helpers', () => {
	describe('Algorithm', () => {
		let Alg;
		let prot;

		beforeEach(() => {
			Alg = Algorithm('test', 'graph');
			prot = Alg.purePrototype();
		});

		it('throws when not given a name', () => {
			expect(() => Algorithm()).to.throw();
		});

		it('asView has 2 fields, name and view', () => {
			const asV = Alg.asView();
			expect(asV).to.have.property('name');
			expect(asV).to.have.property('view');
		});

		it('runs dry, when dry run is invoked', () => { // tweak a little
			const fn = () => {};
			const { logic } = Alg.dryRun(fn);
			expect(logic).to.be.equal(fn);
		});

		it('add normal input', () => {
			Alg.addInput('myid', 12, false);
			expect(prot.input.myid).to.be.equal(12);
			expect(prot.inputType.myid).to.be.equal(undefined);
		});

		it('add init input', () => {
			Alg.addInput('myid', 1, true);
			expect(prot.input.myid).to.be.equal(1);
			expect(prot.inputType.myid[0].type).to.be.equal('mockedInit');
		});

		it('instance.addCode', () => {
			Alg.addCode('my super desc');
			expect(Alg.algorithm.code).to.not.be.equal(undefined);
		});

		it('instance.addTable', () => {
			Alg.addTable('idd', 'd');
			expect(Alg.algorithm.idd).to.not.be.equal(undefined);
		});

		it('instance.addNodedTable', () => {
			Alg.addNodedTable('idd', 'd');
			expect(Alg.algorithm.idd).to.not.be.equal(undefined);
		});

		it('instance.addText', () => {
			Alg.addText('idd');
			expect(Alg.algorithm.idd).to.not.be.equal(undefined);
		});
	});
});
