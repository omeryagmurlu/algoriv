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
import tinycolor from 'tinycolor2';

import { ColorList, animateColor, graphologyImportFix as gimport, themeVars } from 'app/utils';
import { style } from './style.scss';

class Graph extends Component {
	node = (id, x, y) => ({
		id,
		label: `${id}`,
		size: 1,
		color: this.defaultColor(),
		x,
		y
	})

	edge = (id, graph, weight) => ({
		id,
		source: graph.source(id),
		target: graph.target(id),
		label: weight && `${weight}`,
		color: this.defaultColor(),
		size: 1
	})

	readGraph = graph => ({
		nodes: graph.nodes().map((id, i) => this.node(
			id,
			100 * Math.cos((2 * i * Math.PI) / graph.order),
			100 * Math.sin((2 * i * Math.PI) / graph.order)
		)),
		edges: graph.edges().map(id => this.edge(
			id,
			graph,
			graph.getEdgeAttribute(id, 'weight')
		))
	})

	defaultColor() {
		return themeVars(this.props.theme)('primary1Color');
	}

	colors() {
		return [
			tinycolor(this.defaultColor()).spin(90).toString(), // past
			tinycolor(this.defaultColor()).spin(180).toString(), // future
			tinycolor(this.defaultColor()).spin(270).toString(), // current
		];
	}

	static typeOptions = {
		directed: {
			defaultEdgeType: 'arrow',
			minArrowSize: 6
		},
		undirected: {},
		mixed: {}
	}

	constructor(props) {
		super(props);
		this.graphId = `graph${this.props.id}`;
	}

	componentDidMount() {
		const graph = gimport(this.props.graph);
		this.sigma = new sigma({ // eslint-disable-line new-cap
			renderer: {
				container: this.graphId,
				type: 'canvas'
			},
			graph: this.readGraph(graph),
		});
		this.createGraph(graph);
		this.registerEvents();

		this.colorTemp = {
			edges: {},
			nodes: {}
		};
		this.colorPurgeStack = [];
	}

	componentWillReceiveProps({ graph: deadGraph }) {
		const graph = gimport(deadGraph);
		if (!_isEqual(graph, gimport(this.props.graph))) {
			console.log('force update');
			this.createGraph(graph);
		}
	}

	componentWillUpdate({ colors }) {
		this.updateColors(colors);
	}

	createGraph(graph) {
		this.sigma.graph.clear();
		this.sigma.settings({
			singleHover: true,
			zoomMin: 0.0001,
			zoomMax: 100,
			maxEdgeSize: 1,
			edgeLabelSize: 'proportional',
			...Graph.typeOptions[graph.type]
		});
		this.sigma.graph.read(this.readGraph(graph));
		this.layout();
	}

	layout() {
		this.sigma.startForceAtlas2({
			worker: true,
			barnesHutOptimize: false,
			strongGravityMode: true,
			startingIterations: 10000
		});
		setTimeout(() => this.sigma.killForceAtlas2(), 1000);
	}

	registerEvents() {
		const notify = graph => this.props.input(
			gimport(JSON.parse(JSON.stringify(graph))) // I need Immutable.js D: // I really do
		);

		const commonWork = fn => e => {
			if (e.data.captor.ctrlKey) {
				return fn(e, gimport(this.props.graph));
			}
		};

		this.sigma.bind('clickStage', commonWork((e, graph) => {
			const id = graph.addNode(graph.order);

			this.sigma.graph.addNode(this.node(id, e.data.captor.x, e.data.captor.y));
			this.layout();

			notify(graph);
		}));

		let previouslySelectedNode = null;
		this.sigma.bind('clickNode', commonWork((e, graph) => {
			if (previouslySelectedNode !== null) {
				const fromNode = previouslySelectedNode;
				const toNode = e.data.node.id;

				if (!graph.hasEdge(fromNode, toNode)) {
					const id = graph.addEdge(fromNode, toNode);

					this.sigma.graph.addEdge(this.edge(id, graph));
					this.layout();

					notify(graph);
				}

				previouslySelectedNode = null;
				return;
			}
			previouslySelectedNode = e.data.node.id;
		}));
	}

	updateColors(deadClist) {
		const clist = ColorList.revive(deadClist);
		while (this.colorPurgeStack.length !== 0) {
			this.colorPurgeStack.pop()();
		}

		clist.forEachEdge((edge, idx) => {
			this.colorizeThing(edge, this.colors()[idx], 'edges');
		});

		clist.forEachNode((node, idx) => {
			this.colorizeThing(node, this.colors()[idx], 'nodes');
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
		this.colorTemp = {
			edges: {},
			nodes: {}
		};
	}

	colorizeThing = (thing, color, type) => {
		this.colorTemp[type][thing] = color;
		this.colorPurgeStack.push(() => (this.colorTemp[type][thing] = this.defaultColor()));
	}

	render() {
		return (
			<div id={this.graphId} className={style} />
		);
	}
}

Graph.propTypes = {
	id: PropTypes.string.isRequired,

	graph: PropTypes.object.isRequired,

	input: PropTypes.func.isRequired,

	animationNextFrameTime: PropTypes.number.isRequired
};

export default Graph;
