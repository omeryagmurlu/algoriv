import flatten from 'lodash.flattendeep';
import _mapValues from 'lodash.mapvalues';

import Modules, { GraphModuleData } from 'app/features/modules';
import AlgorithmFactory, { framer } from 'app/containers/AlgorithmContainer';
import { graphs, randomGraph, suitingGraphs, geometrys as geometryInputs } from 'app/data/graphs';
import InitInput from 'app/features/init-input';
import { graphologyImportFix as gimport } from 'app/utils';

const Algorithm = (algorithmName, algorithmType) => {
	if (!algorithmName) {
		throw new Error('An algorithm name must be specidied');
	}

	const getHelperSnaps = () => helpers.reduce((obj, helper, i) => {
		obj[i] = helper._internals.getSnap();
		return obj;
	}, {});
	const instance = {
		create: () => {
			processSchedule();
			return AlgorithmFactory(prot);
		},
		set logic(fn) {
			prot.logic = fn;
		},
		asView: () => {
			processSchedule();
			return ({
				name: algorithmName,
				view: AlgorithmFactory(prot)
			});
		},
		algorithm: {},
		dryRun: (logic = prot.logic) => {
			processSchedule();
			return framer(logic, () => getHelperSnaps())(prot.input).then(([frames]) => frames);
		},
		purePrototype: () => prot
	};

	const prot = {
		info: {
			name: algorithmName
		},
		input: {},
		snap: () => getHelperSnaps(),
		modules: settings =>
			helpers.reduce((obj, helper, i) => {
				obj[i] = helper._internals.getModule(settings);
				return obj;
			}, {}),
		modulesInputProps: inputs => helpers.reduce((obj, helper, i) => {
			obj[i] = helper._internals.getModuleInputProps(inputs);
			return obj;
		}, {}),
		initInputs: inputs => initInputsList.map(({ group, name, description, invalid }) => {
			const { update, value } = inputs[name];
			return InitInput(
				description,
				(newInput) => invalid(newInput, _mapValues(inputs, v => v.value)),
				update,
				value,
				group,
			);
		})
	};

	const schedule = [];
	const scheduleStart = (fn) => schedule.push(fn);
	const processSchedule = () => {
		while (schedule.length > 0) schedule.pop()();
	};

	const helpers = [];
	const initInputsList = [];

	const addInput = instance.addInput = (name, value, init) => {
		prot.input[name] = value;
		if (init) {
			const { description, invalid, group } = init;
			initInputsList.push({ name, description, invalid, group });
		}
		return addInput;
	};

	const addModule = helper => {
		helpers.push(helper);
		return addModule;
	};

	instance.addDescription = desc => {
		addModule(Description(desc));
	};

	instance.addCode = code => {
		instance.algorithm.code = Code(code);
		addModule(instance.algorithm.code);
	};

	instance.addTable = (name, ...stuff) => {
		instance.algorithm[name] = Table(...stuff);
		addModule(instance.algorithm[name]);
	};

	instance.addNodedTable = (name, ...stuff) => {
		instance.algorithm[name] = NodedTable(...stuff);
		addModule(instance.algorithm[name]);
	};

	instance.addText = (name, text, opts = {}) => {
		instance.algorithm[name] = Text(text, undefined, opts);
		addModule(instance.algorithm[name]);
	};

	scheduleStart(() => {
		instance.algorithm.explanation = Text(undefined, {
			location: 'right',
			order: 50
		});
		addModule(instance.algorithm.explanation);
	});

	if (algorithmType === 'graph') {
		/**
		 * Input ids for type 'graph':
		 *  - graph
		 *  - ?startVertex
		 */
		instance.addStartingNodeInput = () => {
			addInput('startVertex', '0', {
				description: 'Starting Vertex',
				invalid: (sV, { graph }) => !gimport(graph).hasNode(sV) && `node doesn't exist (${sV})`
			});
		};

		addInput('graph', randomGraph(algorithmName).graph);

		let layout;
		instance.selectRenderLayout = (supLay) => {
			layout = supLay;
		};

		scheduleStart(() => {
			instance.algorithm.graph = Graph(['graph', 'startVertex'])(layout);
			addModule(instance.algorithm.graph);
		});

		scheduleStart(() => {
			const suiting = suitingGraphs(algorithmName);
			addModule(ExampleGraphs(['graph', 'startVertex'])(suiting.length > 0 ? suiting : flatten(graphs.map(o => o.data))));
		});
	} else if (algorithmType === 'geometry') {
		/**
		 * Input ids for type 'geometry':
		 *  - geometry
		 *  - ?startVertex
		 */
		instance.addStartingNodeInput = () => {
			addInput('startVertex', '0', {
				description: 'Starting Vertex',
				invalid: (sV, { geometry }) => !geometry.nodes[sV] && `node doesn't exist (${sV})`
			});
		};

		addInput('geometry', randomGraph(algorithmName, geometryInputs).canvas);

		scheduleStart(() => {
			instance.algorithm.geometry = Geometry(['geometry', 'startVertex'])();
			addModule(instance.algorithm.geometry);
		});

		scheduleStart(() => {
			const suiting = suitingGraphs(algorithmName, geometryInputs);
			addModule(ExampleGeometrys(['geometry', 'startVertex'])(suiting.length > 0 ? suiting : flatten(geometryInputs.map(o => o.data))));
		});
	}

	return instance;
};

export const AlgorithmTypes = {
	graph: [
		{
			name: 'Starting Vertex',
			method: 'addStartingNodeInput',
			propName: 'startVertex',
			type: {
				name: 'toggle',
			}
		},
		{
			name: 'Rendering Layout',
			method: 'selectRenderLayout',
			propName: null,
			type: {
				name: 'select',
				selections: GraphModuleData.layouts
			}
		}
	],
	geometry: [
		{
			name: 'Starting Vertex',
			method: 'addStartingNodeInput',
			propName: 'startVertex',
			type: {
				name: 'toggle',
			}
		},
	]
};

export const DefaultAlgorithmProps = {
	code: 'Code',
	explanation: 'Explanation'
};

const _internals = ({
	mod,
	moduleArgs,
	shouldPassSettings = false,
	inputNames,
	getSnapParameters,
	resetSnapParameters
}) => {
	const module = Modules[mod];
	return {
		getSnap: () => {
			const valToRet = module.snap(...getSnapParameters());
			resetSnapParameters();
			return valToRet;
		},
		getModule: (settings) =>
			module.module(...moduleArgs, shouldPassSettings ? settings : undefined),
		getModuleInputProps: (inputs) => module.input(...inputNames)(inputs)
	};
};

const _proxyHelper = (mod, {
	shouldPassSettings
} = {}) => (inputNames = []) => (...moduleArgs) => {
	let snapDatas = [];
	const snapFn = (...datas) => {
		snapDatas = datas;
	};

	snapFn._internals = _internals({
		mod,
		moduleArgs,
		shouldPassSettings,
		inputNames,
		getSnapParameters: () => snapDatas,
		resetSnapParameters: () => (snapDatas = [])
	});

	return snapFn;
};

const Graph = (inputNames = []) => (...moduleArgs) => {
	let snapDatas = [[], [], []];

	const instance = {
		setColor: (index, nodes, edges) => {
			snapDatas[0][index] = nodes;
			snapDatas[1][index] = edges;
		},
		setGlyphs: (glp, idx = 0) => {
			if (idx < 0 || idx > 3) {
				throw new RangeError('Glyph idx must be within range [0; 4)');
			}
			snapDatas[2][idx] = glp;
		},
		setOverrideGraph: graph => {
			snapDatas[3] = graph;
		},
		_internals: _internals({
			mod: 'RefinedGraph',
			moduleArgs,
			inputNames,
			shouldPassSettings: true,
			getSnapParameters: () => snapDatas,
			resetSnapParameters: () => (snapDatas = [[], [], []])
		})
	};

	return instance;
};

const Geometry = (inputNames = []) => (...moduleArgs) => {
	let snapDatas = [[], []];

	const instance = {
		setColor: (index, nodes, edges) => {
			snapDatas[0][index] = nodes;
			snapDatas[1][index] = edges;
		},
		setOverrideGraph: graph => {
			snapDatas[2] = graph;
		},
		_internals: _internals({
			mod: 'Geometry',
			moduleArgs,
			inputNames,
			shouldPassSettings: true,
			getSnapParameters: () => snapDatas,
			resetSnapParameters: () => (snapDatas = [[], []])
		})
	};

	return instance;
};

const Code = _proxyHelper('Code')();
const Text = _proxyHelper('Text')();
const Table = _proxyHelper('Table')();
const NodedTable = _proxyHelper('NodedTable')();
const Description = _proxyHelper('Description')();
const ExampleGraphs = _proxyHelper('ExampleGraphs', {
	shouldPassSettings: true
});
const ExampleGeometrys = _proxyHelper('ExampleGeometrys', {
	shouldPassSettings: true
});

export default Algorithm;
