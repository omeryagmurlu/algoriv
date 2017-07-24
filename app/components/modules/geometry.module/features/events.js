import Hammer from 'hammerjs';
import { graphologyImportFix as gimport } from 'app/utils';
import drawer from './draw';
import { nodeSize } from '../variables';

export default (instance, Clas) => {
	let ctx;
	let hammer;

	const thereNodeHa = (x, y) => instance.graph.nodes().find(node => {
		const centerX = instance.graph.getNodeAttribute(node, 'x');
		const centerY = instance.graph.getNodeAttribute(node, 'y');
		return ((x - centerX) ** 2) + ((y - centerY) ** 2) < nodeSize ** 2;
	});

	const transformDB = {
		translation: [0, 0],
		scale: 1,
	};

	let tempTran = [0, 0];
	const swipe = (ev) => {
		const trans = [ev.deltaX - tempTran[0], ev.deltaY - tempTran[1]];
		if (!ev.isFinal) {
			tempTran = [ev.deltaX, ev.deltaY];
		} else {
			tempTran = [0, 0];
		}
		transformDB.translation[0] += trans[0];
		transformDB.translation[1] += trans[1];

		ctx.translate(trans[0], trans[1]);
		drawer(instance, Clas);
	};

	const tap = (ev) => {
		const dGraph = gimport(instance.graph.export());
		const tapX = ev.srcEvent.offsetX - (instance.state.width / 2) - transformDB.translation[0];
		const tapY = ev.srcEvent.offsetY - (instance.state.height / 2) - transformDB.translation[1];
		if (ev.srcEvent.ctrlKey) {
			if (ev.srcEvent.altKey) {
				const n = thereNodeHa(tapX, tapY);
				if (n) {
					if (!instance.props.canRemoveThisNode(n)) {
						instance.props.app.alert(1, 'Cannot remove this node');
						return;
					}

					dGraph.dropNode(n);
					instance.props.updateGeometry(dGraph.export());
				}
				return;
			}

			let predOrder = dGraph.order;
			while (dGraph.hasNode(predOrder)) {
				predOrder++;
				if (predOrder > 1000) {
					throw new Error('Sictin');
				}
			}
			dGraph.addNode(predOrder, {
				x: tapX,
				y: tapY,
			});

			instance.props.updateGeometry(dGraph.export());
		}
	};

	const dimensions = () => instance.updateDimensions(() => {
		ctx.translate(transformDB.translation[0], transformDB.translation[1]);
	});

	const attach = () => {
		ctx = instance.ctx;
		hammer = new Hammer(instance.canvas);
		hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

		window.addEventListener('resize', dimensions);
		hammer.on('pan', swipe);
		hammer.on('tap', tap);
	};
	const detach = () => {
		window.removeEventListener('resize', dimensions);
		hammer.off('pan', swipe);
		hammer.off('tap', tap);
	};

	return {
		attach,
		detach
	};
};
