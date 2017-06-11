/* eslint-env mocha, chai */
import { ModuleInput, InitInput } from '../input-types';

describe('input-types', () => {
	describe('ModuleInput', () => {
		it('has type `module`', () => {
			expect(ModuleInput().type).to.be.equal('module');
		});

		it('has a always false returning invalid function', () => {
			expect(ModuleInput().invalid()).to.be.equal(false);
		});

		it('has data: moduleName, targetModule and inputIdentifier from params', () => {
			const a = ModuleInput('a', 'b', 'c');
			expect(a.data.moduleName).to.be.equal('a');
			expect(a.data.targetModule).to.be.equal('b');
			expect(a.data.inputIdentifier).to.be.equal('c');
		});
	});

	describe('InitInput', () => {
		it('has type `init`', () => {
			expect(InitInput().type).to.be.equal('init');
		});

		it('utilizes an invalid function', () => {
			expect(InitInput(0, () => 'bodooo').invalid()).to.be.equal('bodooo');
		});

		it('has data: description from params', () => {
			const a = InitInput('a');
			expect(a.data.description).to.be.equal('a');
		});
	});
});
