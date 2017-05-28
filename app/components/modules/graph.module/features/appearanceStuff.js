import chroma from 'chroma-js';
import { ColorList, themeVars } from 'app/utils';

const appearanceStuff = (instance) => {
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

	const theme = (key) => themeVars(instance.props.theme)(key);

	const defaultColor = theme('primary1Color');
	const backgroundColor = theme('backgroundColor');
	const saturatedDefaultColor = chroma(defaultColor).saturate(2);

	const colorsDP = {};
	const colors = (count) => {
		console.log(count);
		if (colorsDP[count]) {
			return colorsDP[count];
		}
		return (colorsDP[count] = Array(count).fill(1).map((_, i) =>
			saturatedDefaultColor.set('hsl.h', `+${(360 / (count + 1)) * (i + 1)}`).hex(),
		));
	};

	const colorizeThing = (thing, color, type) => {
		setTemp(type, thing, 'col', color);
		purgeStack.push(() => setTemp(type, thing, 'col', defaultColor));
	};

	const labelizeThing = (thing, label, type) => {
		setTemp(type, thing, 'lab', label);
		purgeStack.push(() => setTemp(type, thing, 'lab', -1));
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

		Object.keys(customLabels).forEach(key => {
			labelizeThing(key, customLabels[key], 'nodes');
		});

		clist.forEachEdge((edge, idx) => {
			colorizeThing(edge, colors(clist.neededColorVariety())[idx], 'edges');
		});

		clist.forEachNode((node, idx) => {
			colorizeThing(node, colors(clist.neededColorVariety())[idx], 'nodes');
		});

		const scaleCache = {};
		const eachTimeCache = {};

		Object.keys(temp).forEach(type =>
			Object.keys(temp[type]).forEach(id => {
				if (!instance.sigma.graph[type](id)) {
					return;
				}

				if (temp[type][id].col) {
					animateColor({
						scaleCache,
						eachTimeCache,
						firstCol: instance.sigma.graph[type](id).color,
						secCol: temp[type][id].col,
						callback: col => {
							if (!instance.sigma.graph[type](id)) {
								return;
							}
							instance.sigma.graph[type](id).color = col;
							instance.sigma.refresh({ skipIndexation: true });
						}
					});
				}

				if (temp[type][id].lab) {
					const thing = instance.sigma.graph[type](id);
					thing.glyphs[0].content = temp[type][id].lab;
					if (temp[type][id].lab === -1) {
						thing.glyphs[0].draw = false;
					} else {
						thing.glyphs[0].draw = true;
					}
					instance.sigma.refresh({ skipIndexation: true });
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
		resetAppearence,
		defaultColor,
		textColor: saturatedDefaultColor,
		backgroundColor
	};
};

export default appearanceStuff;
