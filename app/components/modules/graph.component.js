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

import { flatten } from '../../utils';
import { style } from '../../styles/graph.scss';

class Graph extends Component {

	static defaultColor = '#ccc'
	static currentColor = '#00f'
	static futureColor = '#0f0'
	static pastColor = '#f0f'

	constructor(props) {
		super(props);
		this.graphId = `graph${this.props.id}`;
	}

	componentDidMount() {
		this.sigma = new sigma({ // eslint-disable-line new-cap
			container: this.graphId,
			graph: {
				nodes: Array(this.props.nodeCount).fill(1).map((v, i) => ({
					id: i,
					label: `${i}`,
					size: 1,
					color: Graph.defaultColor,
					x: 100 * Math.cos((2 * i * Math.PI) / this.props.nodeCount),
					y: 100 * Math.sin((2 * i * Math.PI) / this.props.nodeCount),
				})),
				edges: flatten(this.props.edges.map((negs, v) => negs.map((u) => ({
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
		setTimeout(() => this.sigma.stopForceAtlas2(), 1000);
		this.colorTemp = {
			edges: {},
			nodes: {}
		};
		this.purgeStack = [];
	}

	componentWillUpdate({ currentNode, currentEdge, futureNodes, pastNodes }) {
		while (this.purgeStack.length !== 0) {
			this.purgeStack.pop()();
		}

		if (currentNode) this.colorizeThing(currentNode, Graph.currentColor, 'nodes');
		futureNodes.forEach(v => this.colorizeThing(v, Graph.futureColor, 'nodes'));
		pastNodes.forEach(v => this.colorizeThing(v, Graph.pastColor, 'nodes'));
		if (currentEdge) {
			this.colorizeThing(currentEdge.join(''), Graph.currentColor, 'edges');
			this.colorizeThing(currentEdge.slice(0).reverse().join(''), Graph.currentColor, 'edges');
		}

		this.updateGraph();
	}

	updateGraph() {
		const scaleCache = {};
		const eachTimeCache = {};
		const anft = () => this.props.animationNextFrameTime;
		Object.keys(this.colorTemp).forEach(type => Object.keys(this.colorTemp[type]).forEach(id => {
			const firstCol = this.sigma.graph[type](id).color;
			const secCol = this.colorTemp[type][id];

			if (chroma(secCol).hex() === chroma(firstCol).hex()) {
				return;
			}

			const aimedEachTime = 50;
			const steps = () => Math.floor((anft() * (1.5 / 3)) / aimedEachTime);
			const eachTime = sps => eachTimeCache[sps * anft()] // Can use DP here, if slow
				|| (eachTimeCache[sps * anft()] = Math.floor((anft() * (1.5 / 3)) / sps));

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
				this.sigma.graph[type](id).color = scale(steps())(i).hex();
				this.sigma.refresh();
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
	id: PropTypes.string.isRequired,

	nodeCount: PropTypes.number.isRequired,
	edges: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,

	animationNextFrameTime: PropTypes.number.isRequired
};

export default Graph;
