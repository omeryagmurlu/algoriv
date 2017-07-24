import chroma from 'chroma-js';

import { uiFont } from 'app/styles/variables';
import { themeVars, ColorList, generateColorWheel } from 'app/utils';
import { nodeSize, lineWidth, labelSize } from '../variables';

export default (instance, Clas, propsOverride) => {
	const props = propsOverride || instance.props;
	const clist = ColorList.revive(props.colors);
	const theme = (key) => themeVars(props.theme)(key);
	const defaultColor = theme('primary1Color');
	const textColor = theme('textColor');
	const saturatedDefaultColor = chroma(defaultColor).saturate(2);
	const sideColors = generateColorWheel(props.app, saturatedDefaultColor);

	const ctx = instance.ctx;
	const graph = instance.graph;

	ctx.textAlign = 'center';

	const nodeCols = {};
	clist.forEachNode((n, i) => (nodeCols[n] = i));

	const getExtremityXYs = (edge) => graph.extremities(edge).map(node => [
		graph.getNodeAttribute(node, 'x'),
		graph.getNodeAttribute(node, 'y'),
	]);

	const drawEdge = (edge, col) => {
		const [[x1, y1], [x2, y2]] = getExtremityXYs(edge);

		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = col;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	};

	const actually = () => {
		graph.edges().forEach(edge => drawEdge(edge, defaultColor));
		clist.forEachEdge((edge, ix) => drawEdge(edge, sideColors(clist.neededColorVariety())[ix]));

		graph.edges().forEach(edge => {
			const [[x1, y1], [x2, y2]] = getExtremityXYs(edge);

			const weg = graph.getEdgeAttribute(edge, 'weight');
			if (weg) {
				ctx.font = `${labelSize / 2}px ${uiFont}`;
				ctx.save();
				ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
				ctx.rotate(Math.atan((y1 - y2) / (x1 - x2)));
				ctx.translate(0, -lineWidth);
				ctx.fillText(weg, 0, 0);
				ctx.restore();
			}
		});

		graph.nodes().forEach(node => {
			const x = graph.getNodeAttribute(node, 'x');
			const y = graph.getNodeAttribute(node, 'y');
			ctx.fillStyle = sideColors(clist.neededColorVariety())[nodeCols[node]] || defaultColor;
			ctx.beginPath();
			ctx.arc(x, y, nodeSize, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.fillStyle = textColor;
			ctx.font = `${labelSize}px ${uiFont}`;
			ctx.fillText(node, x + nodeSize + 5, -3 + y + (nodeSize / 2));
		});
	};

	ctx.save();

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
	ctx.restore();

	ctx.translate(instance.state.width / 2, instance.state.height / 2);

	actually();
	ctx.restore();
};
