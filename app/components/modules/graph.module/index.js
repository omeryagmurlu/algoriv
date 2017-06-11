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

import 'sigma/build/plugins/sigma.plugins.animate.min';
import 'sigma/build/plugins/sigma.renderers.edgeLabels.min';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash.isequal';
import _isNil from 'lodash.isnil';

import { Graph as GRAPH } from 'app/data/inputsRegistry';
import { graphologyImportFix as gimport, ifModuleEnabled, themedStyle } from 'app/utils';

import { uiFont } from 'app/styles/variables';

import './features/custom-plugins/sigma.renderers.glyphs.min';
import './features/custom-plugins/autoCurve.min';
import './features/custom-plugins/sigma.layouts.forceLink.min';

import appearanceStuff from './features/appearanceStuff';
import eventStuff from './features/eventStuff';
import updateStuff from './features/updateStuff';

import style from './style.scss';
import vars from './variables.json';

const css = themedStyle(style);

class Graph extends Component {
	static parseGraph = (props) => gimport(JSON.parse(JSON.stringify(
		props.optGraph || props.input[GRAPH.graph].value
	)))

	static typeOptions = {
		directed: {
			defaultEdgeType: vars.curvedEdges ? 'curvedArrow' : 'arrow',
		},
		undirected: {
			defaultEdgeType: vars.curvedEdges ? 'curvedLine' : 'line',
		},
		mixed: {}
	}

	constructor(props) {
		super(props);
		this.graphId = `graph${this.props.id}`;
		this.graph = Graph.parseGraph(this.props);
		Object.assign(this,
			appearanceStuff(this, Graph),
			eventStuff(this, Graph),
			updateStuff(this, Graph)
		);
	}

	componentDidMount() {
		this.sigma = new sigma({ // eslint-disable-line new-cap
			renderer: {
				container: this.graphId,
				type: 'canvas'
			},
			graph: this.readGraph(this.graph),
		});
		sigma.utils.zoomTo(this.sigma.cameras[0], 0, 0, 1.2);
		this.sigma.renderers[0].glyphs();
		this.sigma.renderers[0].bind('render', () => this.sigma.renderers[0].glyphs());
		this.attachEvents();
		this.createGraph();
	}

	componentWillReceiveProps(newProps) {
		const graph = Graph.parseGraph(newProps);
		const continuation = () => {
			this.updateAppearence(newProps.colors, newProps.customLabels);
		};
		const beforeGraphChange = () => {
			this.killAppearenceAnimations();
		};

		this.killAppearenceAnimations();
		if (!_isEqual(graph, this.graph)) {
			// console.log('hard update');
			this.resetAppearence();
			this.updateGraphHard(graph, continuation, beforeGraphChange);
		} else if (!_isEqual(graph.export(), this.graph.export())) {
			// console.log('soft update');
			this.updateGraphSoft(graph, continuation, beforeGraphChange);
		} else {
			continuation();
		}
	}

	shouldComponentUpdate = () => false

	componentWillUnmount() {
		this.killAppearenceAnimations();
		this.detachEvents();
		this.sigma.kill();
	}

	node = (id, x = 0, y = 0) => ({
		id,
		label: `${id}`,
		size: 1,
		color: this.defaultColor,
		x,
		y,
		glyphs: [{
			position: 'top-left',
			strokeColor() { return this.color; },
			content: undefined,
			draw: false
		}]
	})

	edge = (id, graph, weight) => ({
		id,
		source: graph.source(id),
		target: graph.target(id),
		label: !_isNil(weight) && `${weight}`,
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

	createGraph() {
		const graph = this.graph;
		this.sigma.graph.clear();
		this.sigma.settings({
			// singleHover: true,
			zoomMin: 0.3,
			zoomMax: 5.5,
			minArrowSize: 6,
			maxEdgeSize: 5,
			minNodeSize: 15,
			maxNodeSize: 15,
			defaultLabelSize: vars.labelSize,
			font: uiFont,
			edgeLabelSize: 'proportional',
			defaultLabelColor: this.textColor,
			defaultEdgeLabelColor: this.textColor,
			doubleClickEnabled: false,
			// enableEdgeHovering: true,
			enableHovering: false,
			edgeLabelSizePowRatio: 1.1,
			glyphScale: 0.7,
			glyphLineWidth: 5,
			glyphFontScale: 1.5,
			glyphThreshold: 6,
			glyphFillColor: this.backgroundColor,
			glyphTextColor: this.textColor,
			animationsTime: this.props.app.animationsEnabled ? 400 : 0,
			autoCurveRatio: 10,
			...Graph.typeOptions[graph.type]
		});
		this.sigma.graph.read(this.readGraph(graph));

		this.layout();
	}

	layout() {
		sigma.canvas.edges.autoCurve(this.sigma);
		sigma.layouts.killForceLink(this.sigma);
		sigma.layouts.startForceLink(this.sigma, {
			worker: true,
			gravity: 1.5,
			scalingRatio: 10,
			autoStop: true,
			background: true,
			easing: 'cubicInOut',
			alignNodeSiblings: true
		});
		// setTimeout(() => sigma.layouts.killForceLink(this.sigma), 1000);
	}

	render() {
		return (
			<div
				id={this.graphId}
				className={css('style', this.props.theme)}
				style={{
					display: ifModuleEnabled('graph', this.props, true) ? 'block' : 'none'
				}}
			/>
		);
	}
}

Graph.defaultProps = {
	optGraph: null,
	customLabels: {}
};

Graph.propTypes = {
	id: PropTypes.string.isRequired,
	app: PropTypes.any.isRequired,

	optGraph: PropTypes.object,
	customLabels: PropTypes.object,

	input: PropTypes.objectOf(PropTypes.shape({
		update: PropTypes.func,
		value: PropTypes.any
	})).isRequired,

	theme: PropTypes.string.isRequired,

	animationNextFrameTime: PropTypes.number.isRequired
};

export default Graph;
