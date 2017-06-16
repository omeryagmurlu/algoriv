// Delay this till we have an interface for controlling which side nodes are rendered

// import Algorithm from 'app/features/algorithm-helpers';
// import { graphologyImportFix as gimport } from 'app/utils';
//
// const BST = Algorithm('BST', 'graph');
// BST.selectRenderLayout('dagre');
//
// BST.addDescription(`
// **Binary Search Tree** is a node-based **binary** tree **data structure**
//  which has the following properties:
//
// * The left subtree of a node contains only nodes with keys less than the node’s key.
// * The right subtree of a node contains only nodes with keys greater than the node’s key.
// * The left and right subtree each must also be a binary search tree.
// * There must be no duplicate nodes.
// `);
//
// // http://www.geeksforgeeks.org/binary-search-tree-set-1-search-and-insertion/
//
// BST.addCode([
// 	'BST(s):',
// 	'    Q = {s}; // FIFO',
// 	'    while Q is not empty',
// 	'        v = Q.front(); Q.pop();',
// 	'        if v is visited already, continue;',
// 	'        mark v visited',
// 	'        for each neighbour u of v:',
// 	'            if u is visited already, continue;',
// 	'            else, Q.push(u);'
// ]);
//
// BST.addInput('insert', '15', {
// 	description: 'Value to insert',
// 	invalid: () => false,
// 	group: 'Insertion'
// });
//
// const node = (value, left, right) => ({
// 	value,
// 	left,
// 	right
// });
//
// BST.logic = ({ graph: gNonParse, insert }, snipe) => {
// 	const graph = gimport(gNonParse);
// 	const alg = BST.algorithm;
//
// 	const snap = (a, b, c, d) => {
// 		alg.code(a);
// 		alg.explanation(b);
// 		alg.graph.setColor(2, c, d);
// 		snipe();
// 	};
//
// 	graph.addNode(parseInt(insert, 10));
//
// 	snap([], 'insertion');
// 	snap([], insert);
//
// 	return {
// 		graph: graph.export()
// 	};
// };
//
// export default BST.create();
