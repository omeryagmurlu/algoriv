/* global sigma */
import 'sigma/src/sigma.core';
import 'sigma/src/conrad';
import 'sigma/src/utils/sigma.utils';
// import 'sigma/src/utils/sigma.polyfills';
import 'sigma/src/sigma.settings';
import 'sigma/src/classes/sigma.classes.dispatcher';
import 'sigma/src/classes/sigma.classes.configurable';
import 'sigma/src/classes/sigma.classes.graph';
import 'sigma/src/classes/sigma.classes.camera';
import 'sigma/src/classes/sigma.classes.quad';
import 'sigma/src/classes/sigma.classes.edgequad';
import 'sigma/src/captors/sigma.captors.mouse';
import 'sigma/src/captors/sigma.captors.touch';
import 'sigma/src/renderers/sigma.renderers.canvas';
import 'sigma/src/renderers/sigma.renderers.webgl';
import 'sigma/src/renderers/sigma.renderers.svg';
import 'sigma/src/renderers/sigma.renderers.def';
import 'sigma/src/renderers/webgl/sigma.webgl.nodes.def';
import 'sigma/src/renderers/webgl/sigma.webgl.nodes.fast';
import 'sigma/src/renderers/webgl/sigma.webgl.edges.def';
import 'sigma/src/renderers/webgl/sigma.webgl.edges.fast';
import 'sigma/src/renderers/webgl/sigma.webgl.edges.arrow';
import 'sigma/src/renderers/canvas/sigma.canvas.labels.def';
import 'sigma/src/renderers/canvas/sigma.canvas.hovers.def';
import 'sigma/src/renderers/canvas/sigma.canvas.nodes.def';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.def';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.curve';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.arrow';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.curvedArrow';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.def';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.curve';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.arrow';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.curvedArrow';
import 'sigma/src/renderers/canvas/sigma.canvas.extremities.def';
import 'sigma/src/renderers/svg/sigma.svg.utils';
import 'sigma/src/renderers/svg/sigma.svg.nodes.def';
import 'sigma/src/renderers/svg/sigma.svg.edges.def';
import 'sigma/src/renderers/svg/sigma.svg.edges.curve';
import 'sigma/src/renderers/svg/sigma.svg.labels.def';
import 'sigma/src/renderers/svg/sigma.svg.hovers.def';
import 'sigma/src/middlewares/sigma.middlewares.rescale';
import 'sigma/src/middlewares/sigma.middlewares.copy';
import 'sigma/src/misc/sigma.misc.animation';
import 'sigma/src/misc/sigma.misc.bindEvents';
import 'sigma/src/misc/sigma.misc.bindDOMEvents';
import 'sigma/src/misc/sigma.misc.drawHovers';

import 'sigma/build/plugins/sigma.layout.forceAtlas2.min';
import 'sigma/build/plugins/sigma.renderers.edgeLabels.min';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash.isequal';

import { flatten, ColorList, animateColor } from 'App/utils';
import { style } from './style.scss';

class Graph extends Component {
	static node = (i, x, y) => ({
		id: i,
		label: `${i}`,
		size: 1,
		color: Graph.defaultColor,
		x,
		y
	})

	static edge = (v, u) => ({
		id: `${v}${u}`,
		source: v,
		target: u,
		color: Graph.defaultColor,
		size: 1
	})

	static readGraph = graph => ({
		nodes: Array(graph.nodeCount).fill(1).map((v, i) => Graph.node(
			i,
			100 * Math.cos((2 * i * Math.PI) / graph.nodeCount),
			100 * Math.sin((2 * i * Math.PI) / graph.nodeCount)
		)),
		edges: flatten(graph.edges.map((negs, v) => negs.map((u) => (Graph.edge(v, u))))) // FIXME: check whether u array is
	})

	static defaultColor = '#ccc'
	static colors = [
		'#0f0', // past
		'#f0f', // future
		'#00f', // current
	]

	constructor(props) {
		super(props);
		this.graphId = `graph${this.props.id}`;
	}

	componentDidMount() {
		this.sigma = new sigma({ // eslint-disable-line new-cap
			renderer: {
				container: this.graphId,
				type: 'canvas'
			},
			graph: Graph.readGraph(this.props.graph),
			settings: {
				singleHover: true,
				zoomMin: 0.0001,
				zoomMax: 100,
				maxEdgeSize: 1,
				defaultEdgeType: 'arrow',
				minArrowSize: 6,
				edgeLabelSize: 'proportional'
			}
		});
		this.createGraph(this.props.graph);
		this.registerEvents();

		this.state = { // state, without react, we dont need to inform it
			graph: this.props.graph,
		};

		this.shortMem = {
			previouslySelectedNode: null
		};

		this.colorTemp = {
			edges: {},
			nodes: {}
		};
		this.colorPurgeStack = [];
	}

	componentWillReceiveProps({ graph }) {
		if (!_isEqual(graph, this.state.graph)) {
			console.log('force update');
			this.createGraph(graph);
			this.setState({ graph });
		}
	}

	componentWillUpdate({ colors }) {
		this.updateColors(colors);
	}

	createGraph(graph) {
		this.sigma.graph.clear();
		this.sigma.graph.read(Graph.readGraph(graph));
		this.forceAtlas();
	}

	forceAtlas() {
		this.sigma.startForceAtlas2({
			worker: true,
			barnesHutOptimize: false,
			strongGravityMode: true,
			startingIterations: 10000
		});
		setTimeout(() => this.sigma.killForceAtlas2(), 1000);
	}

	registerEvents() {
		if (this.props.algorithmInputChange.fields.includes('graph')) {
			const notify = () => this.props.algorithmInputChange.handler({
				graph: JSON.parse(JSON.stringify(this.state.graph)) // I need Immutable.js D:
			});

			const commonWork = cb => e => {
				if (e.data.captor.ctrlKey) {
					return cb(e, JSON.parse(JSON.stringify(this.state)));
				}
			};

			this.sigma.bind('clickStage', commonWork((e, state) => {
				// console.log(e);
				const id = state.graph.nodeCount;
				this.sigma.graph.addNode(Graph.node(id, e.data.captor.x, e.data.captor.y));
				this.forceAtlas();

				state.graph.edges[state.graph.nodeCount] = [];
				state.graph.nodeCount++;

				this.setState({ graph: state.graph });
				notify();
			}));

			this.sigma.bind('clickNode', commonWork((e, state) => {
				// console.log(e);
				if (this.shortMem.previouslySelectedNode !== null) {
					const fromNode = this.shortMem.previouslySelectedNode;
					const toNode = e.data.node.id;

					if (!this.sigma.graph.edges(`${fromNode}${toNode}`)) {
						this.sigma.graph.addEdge(Graph.edge(fromNode, toNode));
						this.forceAtlas();

						state.graph.edges[fromNode].push(toNode);
						this.setState({ graph: state.graph });
						notify();
					}

					this.shortMem.previouslySelectedNode = null;
					return;
				}
				this.shortMem.previouslySelectedNode = e.data.node.id;
			}));
		}
	}

	updateColors(deadClist) {
		const clist = ColorList.revive(deadClist);
		while (this.colorPurgeStack.length !== 0) {
			this.colorPurgeStack.pop()();
		}

		clist.forEachEdge((edge, idx) => {
			this.colorizeThing(edge.join(''), Graph.colors[idx], 'edges');
		});

		clist.forEachNode((node, idx) => {
			this.colorizeThing(node, Graph.colors[idx], 'nodes');
		});

		const scaleCache = {};
		const eachTimeCache = {};

		Object.keys(this.colorTemp).forEach(type =>
			Object.keys(this.colorTemp[type]).forEach(id => animateColor({
				remainingTime: () => this.props.animationNextFrameTime,
				scaleCache,
				eachTimeCache,
				firstCol: this.sigma.graph[type](id).color,
				secCol: this.colorTemp[type][id],
				callback: col => {
					this.sigma.graph[type](id).color = col;
					this.sigma.refresh();
				}
			}))
		);
	}

	colorizeThing = (thing, color, type) => {
		this.colorTemp[type][thing] = color;
		this.colorPurgeStack.push(() => (this.colorTemp[type][thing] = Graph.defaultColor));
	}

	render() {
		return (
			<div id={this.graphId} className={style} />
		);
	}
}

Graph.propTypes = {
	id: PropTypes.string.isRequired,

	graph: PropTypes.shape({
		nodeCount: PropTypes.number.isRequired,
		edges: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
	}).isRequired,

	algorithmInputChange: PropTypes.shape({
		fields: PropTypes.arrayOf(PropTypes.string).isRequired,
		handler: PropTypes.func.isRequired
	}).isRequired,

	animationNextFrameTime: PropTypes.number.isRequired
};

export default Graph;
