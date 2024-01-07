import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from 'reactflow';
import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

type DeleteNode = (node_id: string) => void;
type DuplicateNode = (node_id: string) => void;
type DeleteEdge = (edge_id: string) => void;
type SetNodes = (nodes: Node[]) => void;
type SetEdges = (edges: Edge[]) => void;
type UpdateNodeData = (node_id: string, newData:Object) => void;

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: SetNodes;
  setEdges: SetEdges;
  updateNodeData: UpdateNodeData;
  deleteNode: DeleteNode;
  deleteEdge: DeleteEdge;
  duplicateNode: DuplicateNode;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  setNodes: (nodes: Node[]) => {
    console.log(nodes);
    set({
      nodes: nodes,
    });
  },

  setEdges: (edges: Edge[]) => {
    set({
      edges: edges,
    });
  },

  updateNodeData: (node_id: string, newData: Object) => {
    set((state) => {
      const updatedData = state.nodes.map((node) => {
        if (node.id === node_id) {
          return {...node, data: {...node.data, ...newData}};
        }
        return node;
      });
      return {nodes: updatedData};
    })
  },

  deleteNode: (node_id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== node_id),
      edges: get().edges.filter((edge) => edge.source !== node_id),
    });
  },
  
  deleteEdge: (edge_id: string) => {
    set({
        edges: get().edges.filter((edge) => edge.id !== edge_id),
    });
  },

  duplicateNode: (node_id: string) => {
    console.log(node_id);
    console.log(get().nodes);

    const [node] = get().nodes.filter((node) => node.id === node_id);
    console.log(node);
    const new_position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    }
    const newNode = {
      id: `${node.id}-copy`,
      type: node.type,
      data: node.data,
      position: new_position, 
    };

    set({
      nodes: [...get().nodes, newNode],
    })
  },

  
}));

export default useStore;