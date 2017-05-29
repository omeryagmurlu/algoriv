/* global sigma */
import _isEqual from 'lodash.isequal';

const updateStuff = (instance) => {
	const updateGraphHard = (graph, cb, preChange = () => {}) => {
		instance.sigma.graph.nodes().forEach((node, i) => {
			node.ananx = 100 * Math.cos((2 * i * Math.PI) / instance.graph.order);
			node.anany = 100 * Math.sin((2 * i * Math.PI) / instance.graph.order);
		});
		sigma.plugins.animate(instance.sigma, {
			x: 'ananx',
			y: 'anany'
		}, {
			easing: 'cubicInOut',
			onComplete: () => {
				preChange();
				instance.graph = graph;
				instance.createGraph();
				cb();
			}
		});
	};

	const updateGraphSoft = (graph, cb, preChange = () => {}) => {
		if (_isEqual(graph.exportNodes(), instance.graph.exportNodes())
			&& !_isEqual(graph.exportEdges(), instance.graph.exportEdges())) {
			// only edges differ
			instance.sigma.graph.edges().forEach(({ id }) => instance.sigma.graph.dropEdge(id));
			instance.sigma.graph.read({
				edges: instance.readGraph(graph).edges
			});
		}
		preChange();
		instance.graph = graph;
		instance.layout();
		cb();
	};

	return {
		updateGraphSoft,
		updateGraphHard
	};
};

export default updateStuff;
