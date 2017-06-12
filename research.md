      Understanding the working process of algorithms is a necessity to build up our project. Therefore we as developers must be able to dominate the most commonly used algorithms that are complicated to learn for the beginners. In the following the key parts of how certain algorithms work will be pointed out.
Breadth First Search
It is designed for all trees and graphs. It traverses from a root and explores all adjacent nodes.
Depth First Search
It is designed for all trees and graphs. It traverses from a root and explores as far as possible along each branch*.
Djikstra
It is designed for weighted directed graphs. It finds the single-source shortest path. The only condition to use this algorithm is the weight of every edge must be equal or bigger than null.
Kosaraju Sharir Algorithm
It is designed for directed graphs and finds the strongly connected components. It makes use of the fact that the transpose graph (the same graph with the direction of every edge reversed) has exactly the same strongly connected components as the original graph.*
Kruskal's Algorithm
It is designed for a connected weighted graph. It finds the minimum spanning tree but some auxiliary functions will be needed to realize its behaviourally basic algorithmic expression.
Prim's Algorithm
It is designed for weighted undirected graphs. It finds the minimum spanning tree. It starts from an arbitrary starting vertex, at each step adding the cheapest possible connection from the tree to another vertex.*
Topological Sorting
It is designed for directed acyclic graphs. If the algorithm is based on DFS, then it loops through each node of the graph, terminates when it hits any visited node.