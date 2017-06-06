import Modules from 'app/features/modules';
import AlgorithmFactory, { framer } from 'app/containers/AlgorithmContainer';
import { graphs, randomGraph, suitingGraphs } from 'app/data/graphs';
import { InitInput } from 'app/features/input-types';
import { graphologyImportFix as gimport, flatten } from 'app/utils';

export const Algorithm = (algorithmName, algorithmType) => {
	const getHelperSnaps = () => helpers.reduce((obj, helper, i) => {
		obj[i] = helper._internals.getSnap();
		return obj;
	}, {});
	const instance = {
		create: () => AlgorithmFactory(prot),
		set logic(fn) {
			prot.logic = fn;
		},
		asView: () => ({
			name: algorithmName,
			view: AlgorithmFactory(prot)
		}),
		algorithm: {},
		dryRun: (logic = prot.logic) => framer(logic, () => getHelperSnaps())(prot.input)
	};

	const prot = {
		info: {
			name: algorithmName
		},
		input: {},
		inputType: {},
		snap: (/* yes, we are not passing any shit to snap */) => getHelperSnaps(),
		modules: settings =>
			helpers.reduce((obj, helper, i) => {
				obj[i] = helper._internals.getModule(settings);
				return obj;
			}, {}),
	};

	const helpers = [];

	const addInput = instance.addInput = (name, value, init) => {
		prot.input[name] = value;
		if (init) {
			prot.inputType[name] = prot.inputType[name] || [];
			prot.inputType[name].push(InitInput(init.description, init.invalid));
		}
		return addInput;
	};

	const addModule = instance.addModule = helper => {
		helpers.push(helper);
		helper._internals.getInputType(helpers.length - 1).forEach(({ id: inputId, inputType }) => {
			prot.inputType[inputId] = prot.inputType[inputId] || [];
			prot.inputType[inputId].push(inputType);
		});
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

	instance.addText = (name) => {
		instance.algorithm[name] = Text();
		addModule(instance.algorithm[name]);
	};

	instance.algorithm.explanation = Text();
	addModule(instance.algorithm.explanation);


	if (algorithmType === 'graph') {
		/**
		 * Input ids for type 'graph':
		 *  - graph
		 *  - ?startVertex
		 */
		instance.algorithm.graph = Graph([{
			id: 'graph',
			input: 'graph'
		}, {
			id: 'startVertex',
			input: 'startNode'
		}])();
		instance.addStartingNodeInput = () => {
			addInput('startVertex', '0', {
				description: 'Starting Vertex',
				invalid: (sV, { graph }) => !gimport(graph).hasNode(sV) && `node doesn't exist (${sV})`
			});
		};

		addInput('graph', randomGraph(algorithmName).graph);

		addModule(instance.algorithm.graph);
		const suiting = suitingGraphs(algorithmName);
		addModule(ExampleGraphs([{
			id: 'graph',
			input: 'graph'
		}, {
			id: 'startVertex',
			input: 'startNode'
		}])(suiting.length > 0 ? suiting : flatten(graphs.map(o => o.graphs))));
	}

	return instance;
};

export const AlgorithmTypes = {
	graph: [
		{
			name: 'Starting Vertex',
			method: 'addStartingNodeInput',
			propName: 'startVertex'
		}
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
	input,
	getSnaps,
	resetSnaps
}) => ({
	getSnap: () => {
		const valToRet = Modules[mod].snap(...getSnaps());
		resetSnaps();
		return valToRet;
	},
	getModule: (settings) => Modules[mod].module(...moduleArgs,
		shouldPassSettings ? settings : undefined),
	getInputType: (moduleId) => input.map(({ id, input: inputWhich }) => ({
		id,
		inputType: inputWhich
			? Modules[mod].input(moduleId)[inputWhich]
			: Modules[mod].input(moduleId)
	}))
});

const _proxyHelper = (mod, {
	shouldPassSettings
} = {}) => (input = []) => (...moduleArgs) => {
	let snapDatas = [];
	const snapFn = (...datas) => {
		snapDatas = datas;
	};

	snapFn._internals = _internals({
		mod,
		moduleArgs,
		shouldPassSettings,
		input,
		getSnaps: () => snapDatas,
		resetSnaps: () => (snapDatas = [])
	});

	return snapFn;
};

const Graph = (input = []) => (...moduleArgs) => {
	let snapDatas = [[], []];

	const instance = {
		setColor: (index, nodes, edges) => {
			snapDatas[0][index] = nodes;
			snapDatas[1][index] = edges;
		},
		setGlyphs: (glp) => {
			snapDatas[2] = glp;
		},
		setOverrideGraph: graph => {
			snapDatas[3] = graph;
		},
		_internals: _internals({
			mod: 'RefinedGraph',
			moduleArgs,
			input,
			getSnaps: () => snapDatas,
			resetSnaps: () => (snapDatas = [[], []])
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

export default Algorithm;
