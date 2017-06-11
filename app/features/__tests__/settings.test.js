/* eslint-env mocha */
import Settings from '../settings';

const storageMock = () => {
	const storage = {};

	return {
		setItem: (key, value) => {
			storage[key] = value || '';
		},
		getItem: key => (key in storage ? storage[key] : null),
		removeItem: key => {
			delete storage[key];
		},
		get length() {
			return Object.keys(storage).length;
		},
		key: i => {
			const keys = Object.keys(storage);
			return keys[i] || null;
		}
	};
};

describe('settings', () => {
	describe('Settings', () => {
		let s;
		let t;

		beforeEach(() => {
			t = storageMock();
			s = Settings(t);
		});

		it('returns a monad', () => {
			expect(s).to.be.a('function');
			expect(s()).to.be.equal(s()());
		});

		it('doesn\'t create unnecessary paths', () => {
			s('boo')('lloo')('dogo');
			s('boo')('lloo')('dogo').get();
			expect(t.getItem('settings')).to.be.equal(null);
		});

		it('can create paths when needed', () => {
			s('boo')('lloo')('dogo').set(56);
			expect(JSON.parse(t.getItem('settings'))).to.be.deep.equal({ boo: { lloo: { dogo: 56 } } });
		});

		it('can overwrite prevs', () => {
			s('boo')('lloo')('dogo').set(56);
			s('boo')('lloo').set(56);
			expect(JSON.parse(t.getItem('settings'))).to.be.deep.equal({ boo: { lloo: 56 } });
		});

		it('can set defaults', () => {
			s('boo')('lloo').default(56);
			expect(JSON.parse(t.getItem('settings'))).to.be.deep.equal({ boo: { lloo: 56 } });
		});

		it('defaults do not overwrite', () => {
			s('boo')('lloo').set(56);
			s('boo')('lloo').default('do not get this');
			expect(JSON.parse(t.getItem('settings'))).to.be.deep.equal({ boo: { lloo: 56 } });
		});

		it('can get values', () => {
			s('boo')('lloo').set(56);
			expect(s('boo')('lloo').get()).to.be.equal(56);
			s('bsdfsdfsdfoo')('lloo').default('do not get this');
			expect(s('bsdfsdfsdfoo')('lloo').get()).to.be.equal('do not get this');
		});

		it('can be referenced from a middle of a chain', () => {
			const boo = s('boo');
			boo('asdf').set('ap56ple');
			boo('asdf').set('apple');
			expect(boo('asdf').get()).to.be.equal('apple');
		});
	});
});
