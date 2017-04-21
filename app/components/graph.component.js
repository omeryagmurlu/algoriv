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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import { flatten } from '../utils';
import { style } from '../styles/graph.scss';

class Graph extends Component {

	static defaultColor = '#ccc'
	static currentColor = '#00f'
	static futureColor = '#0f0'
	static pastColor = '#f0f'

	constructor(props) {
		super(props);
		this.graphId = `graph${this.props.index}`;
	}

	componentDidMount() {
		this.sigma = new sigma({ // eslint-disable-line new-cap
			container: this.graphId,
			graph: {
				nodes: Array(this.props.algorithmGraph.nodeCount).fill(1).map((v, i) => ({
					id: i,
					label: `${i}`,
					size: 1,
					color: Graph.defaultColor,
					x: 100 * Math.cos((2 * i * Math.PI) / this.props.algorithmGraph.nodeCount),
					y: 100 * Math.sin((2 * i * Math.PI) / this.props.algorithmGraph.nodeCount),
				})),
				edges: flatten(this.props.algorithmGraph.edges.map((negs, v) => negs.map((u) => ({
					id: `${v}${u}`,
					source: v,
					target: u,
					color: Graph.defaultColor,
					size: 1
				}))))
			}
		});
		this.sigma.startForceAtlas2({
			worker: true,
			barnesHutOptimize: false,
			strongGravityMode: true,
			startingIterations: 10000
		});
		this.colorTemp = {
			edges: {},
			nodes: {}
		};
		this.purgeStack = [];
	}

	componentWillUpdate({ graph: { currentNode, currentEdge, futureNodes, pastNodes } }) {
		while (this.purgeStack.length !== 0) {
			this.purgeStack.pop()();
		}

		futureNodes.forEach(v => this.colorizeThing(v, Graph.futureColor, 'nodes'));
		pastNodes.forEach(v => this.colorizeThing(v, Graph.pastColor, 'nodes'));
		if (currentNode) this.colorizeThing(currentNode, Graph.currentColor, 'nodes');
		if (currentEdge) {
			const bidirectional = currentEdge.splice(2, 1)[0];
			this.colorizeThing(currentEdge.join(''), Graph.currentColor, 'edges');
			if (bidirectional) {
				this.colorizeThing(currentEdge.slice(0).reverse().join(''), Graph.currentColor, 'edges');
			}
		}

		this.updateGraph();
		this.sigma.refresh();
	}

	updateGraph() {
		Object.keys(this.colorTemp).forEach(type => Object.keys(this.colorTemp[type]).forEach(id => {
			console.log(this.sigma.graph[type](id), id);
			const steps = 50;
			const eachTime = Math.floor((this.props.animationNextFrameTime * (1.5 / 3)) / steps);

			const scale = chroma.scale([
				this.sigma.graph[type](id).color,
				this.colorTemp[type][id]
			]).domain([0, steps - 1]);

			const timeout = fn => setTimeout(fn, eachTime);
			const fn = i => () => {
				if (i === steps) {
					return;
				}
				this.sigma.graph[type](id).color = scale(i).hex();
				timeout(fn(i + 1));
			};
			timeout(fn(0));
		}));
	}

	scheduleColorPurge = (thing, type) =>
		this.purgeStack.push(() => (this.colorTemp[type][thing] = Graph.defaultColor));

	colorizeThing = (thing, color, type) => {
		this.colorTemp[type][thing] = color;
		this.scheduleColorPurge(thing, type);
	}

	render() {
		return (
			<div id={this.graphId} className={style} />
		);
	}
}

Graph.propTypes = {
	index: PropTypes.number.isRequired,
	animationNextFrameTime: PropTypes.number.isRequired,
	graph: PropTypes.object.isRequired,
	algorithmGraph: PropTypes.object.isRequired
};

export default Graph;
