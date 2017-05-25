import chroma from 'chroma-js';
import { ColorList } from 'app/utils';

const colorStuff = (instance) => {
	let temp = {
		edges: {},
		nodes: {}
	};
	const setTemp = (type, thing, key, value) => {
		temp[type][thing] = temp[type][thing] || {};
		temp[type][thing][key] = value;
	};
	const resetTemp = () => {
		temp = {
			edges: {},
			nodes: {}
		};
	};

	let purgeStack = [];
	const flashStack = () => {
		resetTemp();
		while (purgeStack.length !== 0) {
			purgeStack.pop()();
		}
	};

	const defaultColor = instance.theme('primary1Color');

	const saturatedDefaultColor = chroma(defaultColor).saturate(2);
	const colors = Array(instance.props.options.colorCount).fill(1).map((_, i) =>
		saturatedDefaultColor.set('hsl.h', `+${(360 / (instance.props.options.colorCount + 1)) * (i + 1)}`).hex(),
	);

	const colorizeThing = (thing, color, type) => {
		setTemp(type, thing, 'col', color);
		purgeStack.push(() => setTemp(type, thing, 'col', defaultColor));
	};

	const labelizeThing = (thing, label, type) => {
		setTemp(type, thing, 'lab', `${thing} - ${label}`);
		purgeStack.push(() => setTemp(type, thing, 'lab', thing));
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

	const updateAppearence = (deadClist, customLabels) => {
		const clist = ColorList.revive(deadClist);
		flashStack();

		customLabels.forEach((mLab, i) => {
			labelizeThing(i, mLab, 'nodes');
		});

		clist.forEachEdge((edge, idx) => {
			colorizeThing(edge, colors[idx], 'edges');
		});

		clist.forEachNode((node, idx) => {
			colorizeThing(node, colors[idx], 'nodes');
		});

		const scaleCache = {};
		const eachTimeCache = {};

		Object.keys(temp).forEach(type =>
			Object.keys(temp[type]).forEach(id => {
				if (temp[type][id].col) {
					animateColor({
						scaleCache,
						eachTimeCache,
						firstCol: instance.sigma.graph[type](id).color,
						secCol: temp[type][id].col,
						callback: col => {
							instance.sigma.graph[type](id).color = col;
							instance.sigma.refresh();
						}
					});
				}

				if (temp[type][id].lab) {
					instance.sigma.graph[type](id).label = temp[type][id].lab;
				}
			})
		);
	};

	const resetAppearence = () => {
		flashStack();
		purgeStack = [];
	};

	return {
		updateAppearence,
		defaultColor,
		saturatedDefaultColor,
		resetAppearence
	};
};

export default colorStuff;
