// const [message, setMessage] = useState<string>('');
// console.log(`${process.env.REACT_APP_API_URL}/api/hello`);
// useEffect(() => {
//   fetch(`${process.env.REACT_APP_API_URL}/api/hello`) // Assuming your Flask server is running locally
//     .then((response) => response.json())
//     .then((data) => setMessage(data.message));
// }, []);
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  Edge,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './../../css/main.css';
import Sidebar from './Sidebar';
import { Button } from '@chakra-ui/react';
import ChainNode from './../nodes/ChainNode'
import ContextMenu from './ContextMenu';

const nodeTypes = { chain_node: ChainNode };
let id = 0;
const getId = () => `dndnode_${id++}`;

const FlowComponent = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const handleRunClick = () => {
    console.log('Running...');
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );
  
  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );
  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
  
  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.preventDefault();
      setEdges((eds) => eds.filter(ed => ed.id !== edge.id));
    },
  [setEdges])
  
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <Sidebar />
        <Button colorScheme="blue" onClick={handleRunClick}>
              Run
        </Button>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{height: '100vh', width: '100vw'}}>
          <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={onPaneClick}
            onEdgeDoubleClick={onEdgeDoubleClick}
            nodeTypes={nodeTypes}
            fitView
            
          >
            <Background/>
            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
            <Controls />
          </ReactFlow>
        </div>
        
      </ReactFlowProvider>
    </div>
  );
};

export default FlowComponent;
