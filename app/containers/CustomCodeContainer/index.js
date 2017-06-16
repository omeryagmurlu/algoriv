import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Algorithm, { AlgorithmTypes, DefaultAlgorithmProps as DefAlgProps } from 'app/features/algorithm-helpers';
import CustomCodeView from 'app/views/CustomCodeView';
import Babel from 'ALIAS-babel';
import _mapValues from 'lodash.mapvalues';

import shimString from './features/shim.txt';
import createInterpreter from './features/interpreter';

import { initialCode, initialDescription, initialPseudocode, initialAlgName, initialSaves } from './features/assets';

const valSet = (value, set) => ({ value, set });

class CustomCodeContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code:
`${Object.keys(DefAlgProps).map(key => `// ${DefAlgProps[key]} is available as \`Algorithm.${key}\``).join('\n')}

${initialCode}`,
			name: initialAlgName,
			type: undefined,
			typeFeatures: {},
			pseudoCode: initialPseudocode,
			description: initialDescription,
			tables: [],

			debugConsole: [],
		};

		this.saves = () => this.props.app.settings('custom-code')('saves');
		this.saves().default(initialSaves);
	}

	debugBindings = {
		log: (...p) => {
			this.setState(prev => {
				prev.debugConsole.push(p.map(arg => {
					const type = typeof arg;
					if (type === 'function') {
						return `function ${arg.name}`;
					}
					if (type === 'undefined') {
						return 'undefined';
					}
					return JSON.stringify(arg, (k, v) => (typeof v === 'function' ? `function ${v.name}` : v), 2);
				}).join(' '));
				return prev;
			});
		}
	}

	onCodeChange = code => {
		this.addToState('code', code);
	}

	onSelectSave = save => {
		this.setState(save.data);
	}

	renameSave = (save, newName) => {
		this.saves().set(prev => {
			prev.find(v => v.name === save.name).name = newName;
			return prev;
		});
	}

	deleteSave = (save) => {
		this.saves().set(prev => {
			prev.splice(prev.findIndex(v => v.name === save.name), 1);
			return prev;
		});
	}

	addSave = (name) => {
		this.saves().set(prev => {
			const vorhanden = prev.findIndex(o => o.name === name);
			if (vorhanden !== -1) {
				prev[vorhanden] = {
					name,
					data: { ...this.state }
				};
				return prev;
			}
			prev.push({
				name,
				data: { ...this.state }
			});
			return prev;
		});
	}

	getCodeTranspiled = () => `\
"use strict";\
;${shimString};\
!(function() {;${Babel.transform(this.state.code, { presets: ['es2015'] }).code}\n\
;}());`

	createAlgFromInfo() {
		const Alg = Algorithm(this.state.name, this.state.type);
		Object.keys(this.state.typeFeatures)
			.filter(v => this.state.typeFeatures[v])
			.map(name => AlgorithmTypes[this.state.type].find(v => v.name === name))
			.forEach(feature => {
				Alg[feature.method](this.state.typeFeatures[feature.name]);
			});

		this.state.tables.forEach(table => {
			Alg.addTable(table.id, table.columns);
		});

		Alg.addDescription(this.state.description);
		Alg.addCode(this.state.pseudoCode);

		return Alg;
	}

	run = () => {
		this.addToState('debugConsole', []);
		const Alg = this.createAlgFromInfo();
		Alg.dryRun(this.getLogic(Alg, this.debugBindings))
		.catch(e => {
			if (e.name !== 'AlgorithmError') {
				throw e;
			}
		});
	}

	visualize = () => {
		const continuation = () => {
			const Alg = this.createAlgFromInfo();
			Alg.logic = this.getLogic(Alg, _mapValues(this.debugBindings, () => () => {}));
			this.props.app.changeView(Alg.asView());
		};

		// Ask for save if not saved
		const saveIndex = this.saves().get().findIndex(o => o.name === this.state.name);
		if (saveIndex === -1 || this.saves().get()[saveIndex].data.code !== this.state.code) {
			// If no save or code modified
			this.props.app.confirm('Save before visualizing?', () => {
				this.addSave(this.state.name);
				continuation();
			}, continuation);
			return;
		}

		continuation();
	}

	getLogic({ algorithm } = {}, bindings) {
		return (algInput, frame) => new Promise((resolve, reject) => {
			let ip;
			try {
				ip = createInterpreter(algorithm, algInput, frame, bindings, this.getCodeTranspiled());
			} catch (e) {
				return reject(e);
			}

			let stillRunning = true;

			const out = setTimeout(() => {
				stillRunning = false;
				ip = undefined;
				reject(new Error('Algorithm is taking too long to complete, check for infinite loops'));
			}, 1000 * this.props.app.settings('options')('custom-code')('timeout').get()); // 7000 must be configurable in options

			const nextSync = () => {
				if (!stillRunning) {
					return;
				}

				let runResult = false;
				try {
					let syncEnd = true; // not everything is async, for c.alg to be fast, do 1000 blocks sync
					for (let syncLimit = 1000; syncLimit > 0 && syncEnd; syncLimit--) {
						syncEnd = ip.step();
					}
					runResult = syncEnd;
				} catch (e) {
					return reject(e);
				}

				if (runResult) {
					return setImmediate(nextSync);
				}

				clearTimeout(out);
				return resolve();
			};
			nextSync();
		});
	}

	checkAlgorithmValidity() {
		const Alg = this.createAlgFromInfo();
		return new Promise(resolve => {
			Alg.dryRun(this.getLogic(Alg,
				_mapValues(this.debugBindings, () => () => {})))
			.then(() => resolve(false))
			.catch(err => {
				if (err.name === 'AlgorithmError') {
					resolve({
						alg: true,
						err: `Problems with your code, can't visualize!\n${err.toString()}`
					});

					return;
				}

				resolve({
					alg: false,
					err: err.toString()
				});
			});
		});
	}

	prependCode = (stuff) => {
		this.setState(prev => {
			prev.code = `${stuff}\n${prev.code}`;
			return prev;
		});
	}

	addToState = (key, val) => {
		this.setState({ [key]: val });
	};

	algName = () => valSet(this.state.name, (name) => this.addToState('name', name))
	algType = () => valSet({
		current: this.state.type,
		possible: Object.keys(AlgorithmTypes),
	}, (type) => {
		this.prependCode(`// Algorithm Type is ${type}, input is available as \`input.${type}\`, controls are available as \`Algorithm.${type}\`\
${this.state.name.includes(' ') ? '' : ` and \`${this.state.name}[${type}]\``}`);
		this.addToState('type', type);
		this.addToState('typeFeatures', {});
	})
	algTypeFeatures = () => valSet((AlgorithmTypes[this.state.type] || []).map(v => ({
		name: v.name,
		value: this.state.typeFeatures[v.name],
		type: v.type // FIXME: We shouldn't blindly pass type, I think
	})), (name, newValue) => {
		const propName = AlgorithmTypes[this.state.type].find(v => v.name === name).propName;
		if (propName) {
			this.prependCode(`// Feature ${name} of type ${this.state.type} is now ${newValue ? `enabled, available as \`input.${propName}\`` : 'disabled'} `);
		}
		this.setState(prev => {
			prev.typeFeatures[name] = newValue;
			return prev;
		});
	})
	algPseudoCode = () => valSet(this.state.pseudoCode.join('\n'), (pseudoCode) => this.addToState('pseudoCode', pseudoCode.split('\n')))
	algDescription = () => valSet(this.state.description, (description) => this.addToState('description', description))
	algTables = () => valSet(this.state.tables, () => ({
		add: (id, columns, optNewId, cb = () => {}) => {
			this.prependCode(`// Table ${id} is available as \`input['${id}']\`, you need to supply it with data of ${columns.length} columns`);
			this.setState(prev => {
				const vorhanden = prev.tables.find(o => o.id === id);
				if (vorhanden) {
					vorhanden.columns = columns;
					vorhanden.id = optNewId || id;
					return prev;
				}
				prev.tables.push({ id, columns });
				return prev;
			}, cb);
		},
		remove: (id, cb = () => {}) => {
			this.prependCode(`// Removed table ${id}`);
			this.setState(prev => {
				const index = prev.tables.findIndex(o => o.id === id);
				if (index !== -1) {
					prev.tables.splice(index, 1);
				}
				return prev;
			}, cb);
		}
	}))

	render() {
		return (
			<CustomCodeView
				{...this.props}
				onCodeChange={this.onCodeChange}
				code={this.state.code}
				savedCodes={this.saves().get()}
				onSelectSave={this.onSelectSave}
				renameSave={this.renameSave}
				deleteSave={this.deleteSave}
				addSave={this.addSave}
				visualize={this.visualize}
				run={this.run}
				errProms={this.checkAlgorithmValidity()}

				debugConsole={this.state.debugConsole}

				algName={this.algName()}
				algType={this.algType()}
				algTypeFeatures={this.algTypeFeatures()}
				algPseudoCode={this.algPseudoCode()}
				algDescription={this.algDescription()}
				algTables={this.algTables()}
			/>
		);
	}
}

CustomCodeContainer.propTypes = {
	app: PropTypes.any.isRequired
};

export default CustomCodeContainer;
