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

	const addNode = ({
		handlerClickStage: commonWork((e, graph) => {
			const id = graph.addNode(graph.order);

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
			if (previouslySelectedNode !== null) {
				const fromNode = previouslySelectedNode;
				const toNode = e.data.node.id;

				if (!graph.hasEdge(fromNode, toNode)) {
					const id = graph.addEdge(fromNode, toNode);

					instance.sigma.graph.addEdge(instance.edge(id, graph));
					instance.layout();

					notify(graph);
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
		addEdge.bind();
	};

	const detachEvents = () => {
		addNode.unbind();
		addEdge.unbind();
	};

	return {
		attachEvents,
		detachEvents
	};
};

export default eventStuff;
