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

import { flatten, ColorList, animateColor } from '../../utils';
import { style } from '../../styles/graph.scss';

class Graph extends Component {

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
		this.colorPurgeStack = [];
	}

	componentWillUpdate({ colors }) {
		this.updateColors(colors);
	}

	updateColors(deadClist) {
		const clist = ColorList.revive(deadClist);
		while (this.colorPurgeStack.length !== 0) {
			this.colorPurgeStack.pop()();
		}

		clist.forEachEdge((edge, idx) => {
			this.colorizeThing(edge.join(''), Graph.colors[idx], 'edges');
			this.colorizeThing(edge.slice(0).reverse().join(''), Graph.colors[idx], 'edges');
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

	nodeCount: PropTypes.number.isRequired,
	edges: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,

	animationNextFrameTime: PropTypes.number.isRequired
};

export default Graph;
