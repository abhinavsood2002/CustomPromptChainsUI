// @ts-nocheck
import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import {Menu, MenuList, MenuItem} from '@chakra-ui/react'
import './../css/contextMenu.css'

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <Menu isOpen>
        <MenuList>
            <MenuItem onClick={duplicateNode}>Duplicate</MenuItem>
            <MenuItem onClick={deleteNode}>Delete</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}