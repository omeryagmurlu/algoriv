import chroma from 'chroma-js';
import { ColorList, animateColor } from 'app/utils';

const colorStuff = (instance) => {
	let colorTemp = {
		edges: {},
		nodes: {}
	};

	const colorPurgeStack = [];

	const defaultColor = instance.theme('primary1Color');

	const saturatedDefaultColor = chroma(defaultColor).saturate(2);
	const colors = [
		saturatedDefaultColor.set('hsl.h', '+90').hex(), // past
		saturatedDefaultColor.set('hsl.h', '+180').hex(), // future
		saturatedDefaultColor.set('hsl.h', '+270').hex(), // current
	];

	const colorizeThing = (thing, color, type) => {
		colorTemp[type][thing] = color;
		colorPurgeStack.push(() => (colorTemp[type][thing] = defaultColor));
	};

	const updateColors = (deadClist) => {
		const clist = ColorList.revive(deadClist);
		while (colorPurgeStack.length !== 0) {
			colorPurgeStack.pop()();
		}

		clist.forEachEdge((edge, idx) => {
			colorizeThing(edge, colors[idx], 'edges');
		});

		clist.forEachNode((node, idx) => {
			colorizeThing(node, colors[idx], 'nodes');
		});

		const scaleCache = {};
		const eachTimeCache = {};

		Object.keys(colorTemp).forEach(type =>
			Object.keys(colorTemp[type]).forEach(id => animateColor({
				remainingTime: () => instance.props.animationNextFrameTime,
				scaleCache,
				eachTimeCache,
				firstCol: instance.sigma.graph[type](id).color,
				secCol: colorTemp[type][id],
				callback: col => {
					instance.sigma.graph[type](id).color = col;
					instance.sigma.refresh();
				}
			}))
		);

		colorTemp = {
			edges: {},
			nodes: {}
		};
	};

	return {
		updateColors,
		defaultColor
	};
};

export default colorStuff;
