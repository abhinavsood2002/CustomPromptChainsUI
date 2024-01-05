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

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
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
    set({
      nodes: nodes,
    });
  },

  setEdges: (edges: Edge[]) => {
    set({
      edges: edges,
    });
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
    const node: Node = get().nodes.filter((node) => node.id === node_id)[0];
    const new_position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    }
    const newNode = {
      id: `${node.id}-copy`,
      data: node.data,
      position: new_position, 
    };

    set({
      nodes: [...get().nodes, newNode],
    })
  },

  
}));

export default useStore;