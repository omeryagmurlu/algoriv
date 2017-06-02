import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlgorithmTypes, Algorithm, DefaultAlgorithmProps as DefAlgProps } from 'app/features/algorithm-helpers';
import CustomCodeView from 'app/views/CustomCodeView';
import Babel from 'ALIAS-babel';
import _mapValues from 'lodash.mapvalues';

import createInterpreter from './features/interpreter';

import { initialCode, initialDescription, initialPseudocode, initialAlgName } from './features/assets';

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

			debugConsole: [],
		};

		this.saves = () => this.props.app.settings('custom-code')('saves');
	}

	debugBindings = {
		log: (...p) => {
			this.setState(prev => {
				prev.debugConsole.push(p.map(arg => {
					const type = typeof arg;
					if (type === 'function') {
						return `function ${arg.name}`;
					}
					if (type === 'object') {
						return JSON.stringify(arg, (k, v) => (typeof v === 'function' ? `function ${v.name}` : v), 2);
					}
					return arg.toString();
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
			prev.push({
				name,
				data: { ...this.state }
			});
			return prev;
		});
	}

	getCodeTranspiled = () => Babel.transform(this.state.code, { presets: ['es2015'] }).code

	createAlgFromInfo() {
		const Alg = Algorithm(this.state.name, this.state.type);
		Object.keys(this.state.typeFeatures)
			.filter(v => this.state.typeFeatures[v])
			.map(name => AlgorithmTypes[this.state.type].find(v => v.name === name).method)
			.forEach(feature => {
				Alg[feature]();
			});

		Alg.addDescription(this.state.description);
		Alg.addCode(this.state.pseudoCode);

		return Alg;
	}

	run = () => {
		this.addToState('debugConsole', []);
		const Alg = this.createAlgFromInfo();
		Alg.logic = this.getLogic(Alg, this.debugBindings);
		Alg.dryRun(/* Here coan pass an array */);
	}

	visualize = () => {
		const Alg = this.createAlgFromInfo();
		Alg.logic = this.getLogic(Alg, _mapValues(this.debugBindings, () => () => {}));
		this.props.app.changeView(Alg.asView());
	}

	getLogic({ algorithm } = {}, bindings) {
		return (algInput, frame) => {
			const ip = createInterpreter(algorithm, algInput, frame,
				bindings, this.getCodeTranspiled(), this.state.name);
			let iteration = 0;
			while (ip.step()) {
				iteration++;
			} // TODO make it non-blocking, but do not need to be async at the same time
			console.log(iteration);
		};
	}

	checkAlgorithmValidity() {
		const Alg = this.createAlgFromInfo();
		Alg.logic = this.getLogic(Alg,
			_mapValues(this.debugBindings, () => () => {}));
		const logicErr = Alg.hasLogicErr();
		if (logicErr) {
			if (logicErr.name === 'AlgorithmError') {
				return {
					alg: true,
					err: `Problems with your code, can't visualize!\n${logicErr.toString()}`
				};
			}

			return {
				alg: false,
				err: logicErr.toString()
			};
		}

		return undefined;
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
		// Setting it to an empty one makes features undefined instead of false
		// which I fix below by defaulting to false, this is kinda a hack (language feature)
		// but I can't bother 'fixing' it now, it works, and will work
	})
	algTypeFeatures = () => valSet((AlgorithmTypes[this.state.type] || []).map(
		v => ({
			name: v.name,
			enabled: this.state.typeFeatures[v.name] || false // here
		})
	), (name, isEnabled) => {
		this.prependCode(`// Feature ${name} of type ${this.state.type} is \
now ${isEnabled ? `enabled, available as \`input.${AlgorithmTypes[this.state.type].find(v => v.name === name).propName}\`` : 'disabled'} `);
		this.setState(prev => {
			prev.typeFeatures[name] = isEnabled;
			return prev;
		});
	})
	algPseudoCode = () => valSet(this.state.pseudoCode.join('\n'), (pseudoCode) => this.addToState('pseudoCode', pseudoCode.split('\n')))
	algDescription = () => valSet(this.state.description, (description) => this.addToState('description', description))

	render() {
		const errs = this.checkAlgorithmValidity();
		const visErr = (errs && errs.alg) ? errs.err : undefined;
		const runErr = (errs && !errs.alg) ? errs.err : undefined;
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
				visErr={visErr}
				run={this.run}
				runErr={runErr}

				debugConsole={this.state.debugConsole}

				algName={this.algName()}
				algType={this.algType()}
				algTypeFeatures={this.algTypeFeatures()}
				algPseudoCode={this.algPseudoCode()}
				algDescription={this.algDescription()}
			/>
		);
	}
}

CustomCodeContainer.propTypes = {
	app: PropTypes.any.isRequired
};

export default CustomCodeContainer;