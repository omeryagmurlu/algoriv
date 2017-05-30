import chroma from 'chroma-js';
import _mapValues from 'lodash.mapvalues';
import { ColorList, themeVars } from 'app/utils';

const grayScale = chroma.scale();

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

	const purgeStack = [];
	const flashStack = () => {
		while (purgeStack.length !== 0) {
			purgeStack.pop()();
		}
	};

	let timeoutsToBeCleared = {};

	const postProcessColors = v => {
		if (instance.props.app.settings('options')('grayscale-visualizations').get()) {
			return grayScale(1 - chroma(v).luminance()).hex();
		}

		return v;
	};

	const theme = (key) => themeVars(instance.props.theme)(key);

	const mainColorsRaw = {
		default: theme('primary1Color'),
		text: theme('textColor'),
	};

	const backgroundColor = theme('backgroundColor');
	const saturatedDefaultColor = chroma(mainColorsRaw.default).saturate(2);

	const colorsDP = {};
	const sideColorsRaw = (count) => {
		if (colorsDP[count]) {
			return colorsDP[count];
		}
		return (colorsDP[count] = Array(count).fill(1).map((_, i) =>
			saturatedDefaultColor.set('hsl.h', `+${(360 / (count + 1)) * (i + 1)}`).hex(),
		));
	};

	const mainColors = _mapValues(mainColorsRaw, postProcessColors);
	const sideColors = (...p) => sideColorsRaw(...p).map(postProcessColors);

	const colorizeThing = (thing, color, type) => {
		setTemp(type, thing, 'col', color);
		purgeStack.push(() => setTemp(type, thing, 'col', mainColors.default));
	};

	const labelizeThing = (thing, label, type) => {
		setTemp(type, thing, 'lab', label);
		purgeStack.push(() => setTemp(type, thing, 'lab', -1));
	};

	const processTemp = () => {
		const scaleCache = {};
		const eachTimeCache = {};

		Object.keys(temp).forEach(type =>
			Object.keys(temp[type]).forEach(id => {
				if (!instance.sigma.graph[type](id)) {
					return;
				}

				if (temp[type][id].col) {
					if (instance.props.app.animationsEnabled) {
						animateColor({
							scaleCache,
							eachTimeCache,
							firstCol: instance.sigma.graph[type](id).color,
							secCol: temp[type][id].col,
							callback: col => {
								instance.sigma.graph[type](id).color = col;
								instance.sigma.refresh({ skipIndexation: true });
							}
						});
					} else {
						instance.sigma.graph[type](id).color = temp[type][id].col;
						instance.sigma.refresh({ skipIndexation: true });
					}
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

		resetTemp();
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

		const timeout = fn => {
			const timeoutId = setTimeout(() => {
				timeoutsToBeCleared[timeoutId] = null;
				fn();
			}, eachTime(steps()));
			timeoutsToBeCleared[timeoutId] = {
				clear: () => clearTimeout(timeoutId),
				fastforward: () => callback(secCol)
			};
		};
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
			colorizeThing(edge, sideColors(clist.neededColorVariety())[idx], 'edges');
		});

		clist.forEachNode((node, idx) => {
			colorizeThing(node, sideColors(clist.neededColorVariety())[idx], 'nodes');
		});

		processTemp();
	};

	const killAppearenceAnimations = () => {
		Object.keys(timeoutsToBeCleared).forEach(id => {
			if (timeoutsToBeCleared[id]) {
				timeoutsToBeCleared[id].clear();
				timeoutsToBeCleared[id].fastforward();
			}
		});
		timeoutsToBeCleared = {};
	};

	const resetAppearence = () => {
		flashStack();
		processTemp();
	};

	return {
		updateAppearence,
		resetAppearence,
		killAppearenceAnimations,
		defaultColor: mainColors.default,
		textColor: mainColors.text,
		backgroundColor
	};
};

export default appearanceStuff;
