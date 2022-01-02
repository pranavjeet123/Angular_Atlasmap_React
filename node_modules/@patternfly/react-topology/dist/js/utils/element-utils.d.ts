import { GraphElement, Node } from '../types';
declare const groupNodeElements: (nodes: GraphElement[]) => Node[];
declare const leafNodeElements: (nodeElements: Node | Node[] | null) => Node[];
declare const getTopCollapsedParent: (node: Node) => Node;
declare const getClosestVisibleParent: (node: Node) => Node | null;
declare const getElementPadding: (element: GraphElement) => number;
declare const getGroupPadding: (element: GraphElement, padding?: number) => number;
export { groupNodeElements, leafNodeElements, getTopCollapsedParent, getClosestVisibleParent, getElementPadding, getGroupPadding };
//# sourceMappingURL=element-utils.d.ts.map