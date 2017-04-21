export const map = (thing, cb) =>
	(Array.isArray(thing)
		? thing.map((v, i) => cb(v, i))
		: [cb(thing, 0)]);

export const flatten = (ary) => ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []); // http://stackoverflow.com/a/27267762/3873452

export const typee = (type, data = {}) => ({
	type,
	data
});

	//
	// export const snapFactoryFactory = (frames, cb) => (vis, q) =>
	// 	(highlightCode, explanation, currentNode, currentEdge) => snapshot(frames, {
			// code: [highlightCode],
			// explanation: [explanation],
			// graph: [{
			// 	currentNode,
			// 	currentEdge,
			// 	pastNodes: vis.map((v, i) =>
			// 		((v !== true) ? -1 : i)).filter(v => (v !== -1)), // to high
			// 	futureNodes: q.map(v => v),
			// }],
			// table: [
			// 	{
			// 		width: 150,
			// 		columns: [
			// 			{ title: 'Node' },
			// 			{ title: 'Visited' }
			// 		],
			// 		data: vis.map((Visited, Node) => ({
			// 			Visited: Visited.toString(),
			// 			Node
			// 		}))
			// 	},
			// 	{
			// 		width: 75,
			// 		columns: [
			// 			{ title: 'Queue' }
			// 		],
			// 		data: q.map((Queue) => ({
			// 			Queue
			// 		}))
			// 	},
			// ]
	// 	});
