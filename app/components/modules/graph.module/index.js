/* global sigma */

import 'sigma/build/sigma.min';

import 'sigma/build/plugins/sigma.plugins.animate.min';
import 'sigma/build/plugins/sigma.renderers.edgeLabels.min';

import 'dagre/dist/dagre.min';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash.isequal';
import _isNil from 'lodash.isnil';

import { graphologyImportFix as gimport, ifModuleEnabled, themedStyle } from 'app/utils';

import { uiFont } from 'app/styles/variables';

import './features/custom-plugins/sigma.renderers.glyphs.min';
import './features/custom-plugins/autoCurve.min';
import './features/custom-plugins/sigma.layouts.dagre.min';
import './features/custom-plugins/sigma.layouts.forceLink.min';
import './features/custom-plugins/sigma.layouts.fructurman.min';

import appearanceStuff from './features/appearanceStuff';
import eventStuff from './features/eventStuff';
import updateStuff from './features/updateStuff';

import style from './style.scss';
import vars from './variables.json';

const css = themedStyle(style);

class Graph extends Component {
	static parseGraph = (props) => gimport(JSON.parse(JSON.stringify(
		props.graph
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

		this.componentWillReceiveProps(this.props);
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
		glyphs: []
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

	layoutsDB = {
		forceLink: () => {
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
		},
		dagre: () => {
			if (!sigma.layouts.dagre.isRunning(this.sigma)) {
				sigma.layouts.dagre.configure(this.sigma, {
					easing: 'cubicInOut',
					directed: true // undirected is disgusting for undirected ones
				});
				sigma.layouts.dagre.start(this.sigma);
			}
		},
		fruchtermanReingold: () => { // why no use worker dumbs
			if (!sigma.layouts.fruchtermanReingold.isRunning(this.sigma)) {
				sigma.layouts.fruchtermanReingold.configure(this.sigma, {
					easing: 'cubicInOut',
					iterations: 2000
				});
				setImmediate(() => sigma.layouts.fruchtermanReingold.start(this.sigma));
			}
		}
	}

	layout() {
		this.sigma.refresh();
		sigma.canvas.edges.autoCurve(this.sigma);
		this.layoutsDB[this.props.layout]();
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
	customLabels: [],
	layout: 'forceLink',
};

Graph.propTypes = {
	id: PropTypes.string.isRequired,
	app: PropTypes.any.isRequired,

	graph: PropTypes.object.isRequired,
	updateGraph: PropTypes.func.isRequired,
	canRemoveThisNode: PropTypes.func.isRequired,

	customLabels: PropTypes.array,
	colors: PropTypes.any.isRequired,

	layout: PropTypes.string,

	theme: PropTypes.string.isRequired,

	animationNextFrameTime: PropTypes.number.isRequired,
};

export default Graph;
