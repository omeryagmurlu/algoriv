import chroma from 'chroma-js';
import { ColorList } from 'app/utils';

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

	const animateColor = ({
		firstCol,
		secCol,
		eachTimeCache = {},
		scaleCache = {},
		callback
	}) => {
		if (chroma(secCol).hex() === chroma(firstCol).hex()) {
			return;
		}

		const remainingTime = () => instance.props.animationNextFrameTime;

		const aimedEachTime = 50;
		const steps = () => Math.floor((remainingTime() * (1.5 / 3)) / aimedEachTime);
		const eachTime = sps => eachTimeCache[sps * remainingTime()]
			|| (eachTimeCache[sps * remainingTime()] = Math.floor((remainingTime() * (1.5 / 3)) / sps));

		const scale = sps => scaleCache[`${sps}..${firstCol}.${secCol}`] || (scaleCache[`${sps}..${firstCol}.${secCol}`] = chroma.scale([
			firstCol,
			secCol
		]).mode('lch').domain([0, sps - 1]));

		const timeout = fn => setTimeout(fn, eachTime(steps()));
		const fn = i => () => {
			if (i >= steps()) {
				// console.log('done', eachTime(steps()), steps())
				return;
			}
			// console.log('working', eachTime(steps()), steps(), scale(steps())(i).hex())
			callback(scale(steps())(i).hex());
			timeout(fn(i + 1));
		};
		timeout(fn(0));
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
