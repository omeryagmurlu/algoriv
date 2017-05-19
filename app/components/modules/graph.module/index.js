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

import { Graph as GRAPH } from 'app/data/inputsRegistry';
import { graphologyImportFix as gimport, themeVars } from 'app/utils';

import colorStuff from './features/colorStuff';
import eventStuff from './features/eventStuff';

import { style } from './style.scss';
import vars from './variables.json';

class Graph extends Component {
	static getGraph = (props) => gimport(props.optGraph || props.input[GRAPH].value)

	static typeOptions = {
		directed: {
			defaultEdgeType: vars.curvedEdges ? 'curvedArrow' : 'arrow',
		},
		undirected: {
			defaultEdgeType: vars.curvedEdges ? 'curved' : 'line',
		},
		mixed: {}
	}

	constructor(props) {
		super(props);
		this.graphId = `graph${this.props.id}`;
		Object.assign(this,
			colorStuff(this, Graph),
			eventStuff(this, Graph)
		);
	}

	componentDidMount() {
		const graph = Graph.getGraph(this.props);
		this.sigma = new sigma({ // eslint-disable-line new-cap
			renderer: {
				container: this.graphId,
				type: 'canvas'
			},
			graph: this.readGraph(graph),
		});
		sigma.utils.zoomTo(this.sigma.cameras[0], 0, 0, 1.2);
		this.createGraph(graph);
		this.attachEvents();
	}

	componentWillReceiveProps(newProps) {
		const graph = Graph.getGraph(newProps);
		if (!_isEqual(graph, Graph.getGraph(this.props))) {
			console.log('force update');
			this.createGraph(Graph.getGraph(newProps));
		}
	}

	componentWillUpdate({ colors }) {
		this.updateColors(colors);
	}

	node = (id, x, y) => ({
		id,
		label: `${id}`,
		size: 1,
		color: this.defaultColor,
		x,
		y
	})

	edge = (id, graph, weight) => ({
		id,
		source: graph.source(id),
		target: graph.target(id),
		label: weight && `${weight}`,
		color: this.defaultColor,
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

	theme = (key) => themeVars(this.props.theme)(key)

	createGraph(graph) {
		this.sigma.graph.clear();
		this.sigma.settings({
			// singleHover: true,
			zoomMin: 0.8,
			zoomMax: 2.5,
			minArrowSize: 6,
			maxEdgeSize: 5,
			maxNodeSize: 15,
			defaultLabelSize: vars.labelSize,
			edgeLabelSize: 'proportional',
			defaultLabelColor: this.theme('textColor'),
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

	render() {
		return (
			<div id={this.graphId} className={style} />
		);
	}
}

Graph.defaultProps = {
	optGraph: null
};

Graph.propTypes = {
	id: PropTypes.string.isRequired,

	optGraph: PropTypes.object,

	input: PropTypes.objectOf(PropTypes.shape({
		update: PropTypes.func.isRequired,
		value: PropTypes.object.isRequired
	})).isRequired,

	theme: PropTypes.string.isRequired,

	animationNextFrameTime: PropTypes.number.isRequired
};

export default Graph;
