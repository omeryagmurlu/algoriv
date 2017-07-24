/* global sigma */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash.isequal';

import { ifModuleEnabled, themedStyle, graphologyImportFix as gimport } from 'app/utils';

import drawer from './features/draw';
import events from './features/events';
import style from './style.scss';

const css = themedStyle(style);

class Geometry extends Component {
	static parseGraph = (props) => gimport(JSON.parse(JSON.stringify(
		props.geometry
	)))

	constructor(props) {
		super(props);
		this.geometryId = `geo${this.props.id}`;
		this.graph = Geometry.parseGraph(props);
		this.events = events(this, Geometry);

		this.state = {
			height: 300,
			width: 300,
		};
	}

	componentDidMount() {
		this.canvas = document.getElementById(this.geometryId);
		this.ctx = this.canvas.getContext('2d');
		this.updateDimensions();
		this.events.attach();
	}

	componentWillReceiveProps(newProps) {
		if (!_isEqual(this.graph, Geometry.parseGraph(newProps))) {
			this.graph = Geometry.parseGraph(newProps);
		}
		drawer(this, Geometry, newProps);
	}

	componentWillUnmount() {
		this.events.detach();
	}

	updateDimensions = (preb = () => {}) => {
		const { height, width } = document.getElementById(this.geometryId).getBoundingClientRect();
		this.setState({ height, width }, () => {
			preb();
			drawer(this, Geometry);
		});
	}

	render() {
		return (
			<canvas
				id={this.geometryId}
				className={css('style', this.props.theme)}
				height={this.state.height}
				width={this.state.width}
				style={{
					display: ifModuleEnabled('geometry', this.props, true) ? 'block' : 'none'
				}}
			/>
		);
	}
}

Geometry.propTypes = {
	id: PropTypes.string.isRequired,
	app: PropTypes.any.isRequired,

	geometry: PropTypes.object.isRequired,
	updateGeometry: PropTypes.func.isRequired,
	canRemoveThisNode: PropTypes.func.isRequired,

	colors: PropTypes.any.isRequired,

	theme: PropTypes.string.isRequired,

	animationNextFrameTime: PropTypes.number.isRequired,
};

export default Geometry;
