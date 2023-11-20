import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
const nodes: Node[] = [
    {
      id: '1', // required
      data: { label: 'Node 1' }, 
      position: { x: 100, y: 100 }, // required
    },
  ];
const FlowComponent: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  console.log(`${process.env.REACT_APP_API_URL}/api/hello`);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/hello`) // Assuming your Flask server is running locally
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);
  return (
    <div>
        <div style={{height: '100vh', width: '100vw'}}>
            <ReactFlow nodes={nodes}>
                <Background />
            </ReactFlow>
        </div>
    </div>
    );
};

export default FlowComponent;