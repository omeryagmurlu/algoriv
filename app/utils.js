import _pickBy from 'lodash.pickby';
import graphology from 'graphology';
import _isNil from 'lodash.isnil';
import { themes } from 'app/styles/themes.json';
import Buckets from 'buckets-js';

export const AlgorithmError = message => ({
	toString: () => `AlgorithmError: ${message}`,
	message,
	name: 'AlgorithmError'
});

export const trimPx = pix => parseFloat(pix.slice(0, -2));

export const ifModuleEnabled = (mName, props, element) => {
	if (props.app.settings('options')('enabled-modules')(mName).get()) {
		return element;
	}
	return null;
};

export function reverseGraph(graph) {
	const reversed = graph.emptyCopy();
	reversed.importNodes(graph.exportNodes());
	reversed.importEdges(graph.exportUndirectedEdges());
	graph.directedEdges().forEach(edge => {
		const [source, target] = graph.extremities(edge);
		reversed.addDirectedEdgeWithKey(
			edge,
			target,
			source,
			graph.getAttributes(edge)
		);
	});
	return graphologyImportFix(reversed.export());
}

export const vis2array = vis => Object.keys(vis)
	.map((k) => ((vis[k] !== true) ? -1 : k))
	.filter(v => (v !== -1));

export const labelizer = v => ({
	Infinity: '∞'
})[v.toString()] || v.toString();

export const DataStructures = Buckets;

export const themeVars = theme => key => {
	if (!themes[theme][key]) {
		throw new ReferenceError(`${key} is a non-existent style`);
	}
	return themes[theme][key];
};

export const themedStyle = (style) => {
	if (!style) {
		throw new ReferenceError(`themedStyle: unknown style ${style}`);
	}
	return (className, theme) => {
		const retVal = `${style[`${className}${theme ? `-${theme}` : ''}`]}${style[className] ? ` ${style[className]}` : ''}`;
		if (!retVal) {
			throw new ReferenceError(`themedStyle: could'nt find: ${className} in [${Object.keys(style).join(' ,')}]`);
		}
		return retVal;
	};
};

export const isNotNil = (...a) => !_isNil(...a);

export const graphologyOptions = {
	edgeKeyGenerator({ source, target }) {
		return `${source}->${target}: ${getRandomArbitrary(0, 100000)}`;
	}
};

export const graphologyImportFix = obj => {
	const type = obj.edges.find(o => o.undirected) ? 'UndirectedGraph' : 'DirectedGraph';
	const graph = new graphology[type](graphologyOptions);
	graph.import(obj);
	if (graph.type === 'undirected') {
		graph.inNeighbors = graph.outNeighbors = graph.neighbors;
	}
	return graph;
};

export const rippleWait = fn => setTimeout(fn, 500);

export const getEvents = obj => _pickBy(obj, (v, k) => k.startsWith('on'));

export const px = a => String(a).concat('px');

export const getRandomArbitrary = (min, max) => (Math.random() * (max - min)) + min;

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const trace = a => {
	console.log(a);
	return a;
};

export const map = (thing, cb) =>
	(Array.isArray(thing)
		? thing.map((v, i) => cb(v, i))
		: [cb(thing, 0)]);

export const flatten = (ary) => ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []); // http://stackoverflow.com/a/27267762/3873452

export class ColorList {
	static revive = cl => new ColorList(cl.nodesList, cl.edgesList) // we snapshot D:

	constructor(nodesList = [], edgesList = []) {
		this.nodesList = nodesList;
		this.edgesList = edgesList;
	}

	static push = (list, items) => list.push(items.filter(isNotNil))
	static set = (list, i, items) => (list[i] = items.filter(isNotNil))

	pushNode = node => ColorList.push(this.nodesList, [node])
	pushNodes = nodes => ColorList.push(this.nodesList, nodes)
	pushEdge = edge => ColorList.push(this.edgesList, [edge])
	pushEdges = edges => ColorList.push(this.edgesList, edges)

	setNode = (node, i) => ColorList.set(this.nodesList, i, [node])
	setNodes = (nodes, i) => ColorList.set(this.nodesList, i, nodes)
	setEdge = (edge, i) => ColorList.set(this.edgesList, i, [edge])
	setEdges = (edges, i) => ColorList.set(this.edgesList, i, edges)

	static forEach = (list, callback) => {
		list.forEach((things, idx) => {
			if (!Array.isArray(things)) {
				return;
			}
			things.forEach(thing => callback(thing, idx));
		});
	}

	neededColorVariety = () => Math.max(this.edgesList.length, this.nodesList.length)

	forEachEdge = callback => ColorList.forEach(this.edgesList, callback)
	forEachNode = callback => ColorList.forEach(this.nodesList, callback)
}
