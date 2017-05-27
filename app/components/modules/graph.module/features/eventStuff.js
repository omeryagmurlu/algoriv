import { Graph as GRAPH } from 'app/data/inputsRegistry';
import { graphologyImportFix as gimport } from 'app/utils';

const eventStuff = (instance, clas) => {
	const notify = graph => instance.props.input[GRAPH].update(
		graph
	);

	const commonWork = fn => e => {
		if (e.data.captor.ctrlKey) {
			return fn(e, gimport(JSON.parse(JSON.stringify(clas.getGraph(instance.props)))));
		}
	};

	const removeNode = ({
		handlerClickNode: commonWork((e, graph) => {
			if (!e.data.captor.altKey) {
				return;
			}
			graph.dropNode(e.data.node.id);

			instance.sigma.graph.dropNode(e.data.node.id);
			instance.layout();

			notify(graph);
		}),

		get bind() {
			return () => instance.sigma.bind('clickNode', this.handlerClickNode);
		},

		get unbind() {
			return () => instance.sigma.unbind('clickNode', this.handlerClickNode);
		}
	});

	const addNode = ({
		handlerClickStage: commonWork((e, graph) => {
			if (e.data.captor.altKey) {
				return;
			}
			let predOrder = graph.order;
			while (graph.hasNode(predOrder)) {
				predOrder++;
				if (predOrder > 1000) {
					throw new Error('Sictin');
				}
			}

			const id = graph.addNode(predOrder);

			instance.sigma.graph.addNode(instance.node(id));
			instance.layout();

			notify(graph);
		}),

		get bind() {
			return () => instance.sigma.bind('clickStage', this.handlerClickStage);
		},

		get unbind() {
			return () => instance.sigma.unbind('clickStage', this.handlerClickStage);
		}
	});

	let previouslySelectedNode = null;
	const addEdge = ({
		handlerClickNode: commonWork((e, graph) => {
			if (e.data.captor.altKey) {
				return;
			}
			if (previouslySelectedNode !== null && graph.hasNode(previouslySelectedNode)) {
				const fromNode = previouslySelectedNode;
				const toNode = e.data.node.id;

				if (!graph.hasEdge(fromNode, toNode)) {
					const continuation = (weight) => {
						const id = graph.addEdge(fromNode, toNode, {
							weight
						});

						instance.sigma.graph.addEdge(instance.edge(id, graph));
						instance.layout();

						notify(graph);
					};

					if (graph.edges().find(edge => graph.getEdgeAttribute(edge, 'weight'))) {
						instance.props.app.prompt('Enter Weight', weight =>
							continuation(parseInt(weight, 10))
						);
					} else {
						continuation();
					}
				}

				previouslySelectedNode = null;
				return;
			}
			previouslySelectedNode = e.data.node.id;
		}),

		get bind() {
			previouslySelectedNode = null;
			return () => instance.sigma.bind('clickNode', this.handlerClickNode);
		},

		get unbind() {
			previouslySelectedNode = null;
			return () => instance.sigma.unbind('clickNode', this.handlerClickNode);
		}
	});

	const attachEvents = () => {
		addNode.bind();
		removeNode.bind();
		addEdge.bind();
	};

	const detachEvents = () => {
		addNode.unbind();
		removeNode.unbind();
		addEdge.unbind();
	};

	return {
		attachEvents,
		detachEvents
	};
};

export default eventStuff;
