import chroma from 'chroma-js';

export const px = a => String(a).concat('px');

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

	pushNode = node => this.nodesList.push([node])
	pushNodes = nodes => this.nodesList.push(nodes)
	pushEdge = edge => this.edgesList.push([edge])
	pushEdges = edges => this.edgesList.push(edges)

	setNode = (node, i) => (this.nodesList[i] = [node])
	setNodes = (nodes, i) => (this.nodesList[i] = nodes)
	setEdge = (edge, i) => (this.edgesList[i] = [edge])
	setEdges = (edges, i) => (this.edgesList[i] = edges)

	static forEach = (list, check, callback) => {
		list.forEach((things, idx) => {
			if (!Array.isArray(things)) {
				return;
			}
			things.filter(v => check(v)).forEach(thing => callback(thing, idx));
		});
	}

	static isEdge = thing => {
		if (
			Array.isArray(thing) &&
			(thing.length === 2) &&
			(thing.filter(num => typeof num === 'number').length === 2)
		) return true;
		return false;
	}

	static isNode = thing => {
		if (
			typeof thing === 'number'
		) return true;
		return false;
	}

	forEachEdge = callback => ColorList.forEach(this.edgesList, ColorList.isEdge, callback)
	forEachNode = callback => ColorList.forEach(this.nodesList, ColorList.isNode, callback)
}

export const animateColor = ({
	remainingTime,
	firstCol,
	secCol,
	eachTimeCache = {},
	scaleCache = {},
	callback
}) => {
	if (chroma(secCol).hex() === chroma(firstCol).hex()) {
		return;
	}

	const aimedEachTime = 50;
	const steps = () => Math.floor((remainingTime() * (1.5 / 3)) / aimedEachTime);
	const eachTime = sps => eachTimeCache[sps * remainingTime()]
		|| (eachTimeCache[sps * remainingTime()] = Math.floor((remainingTime() * (1.5 / 3)) / sps));

	const scale = sps => scaleCache[`${sps}..${firstCol}.${secCol}`] || (scaleCache[`${sps}..${firstCol}.${secCol}`] = chroma.scale([
		firstCol,
		secCol
	]).domain([0, sps - 1]));

	const timeout = fn => setTimeout(fn, eachTime(steps()));
	const fn = i => () => {
		if (i >= steps()) {
			// console.log('done', eachTime(steps()), steps())
			return;
		}
		// console.log('working', eachTime(steps()), steps(), scale(steps())(i).hex())
		callback(scale(steps())(i).hex());
		timeout(fn(i + 1));
	};
	timeout(fn(0));
};
