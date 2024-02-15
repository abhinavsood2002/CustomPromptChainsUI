// import React, { useCallback } from 'react';

// const Sidebar = () => {
//     const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
//       event.dataTransfer.setData('application/reactflow', nodeType);
//       event.dataTransfer.effectAllowed = 'move';
//     };
    
//     const handleDrop = useCallback((event) => {
//       event.preventDefault();
//       const files = event.dataTransfer.files;
//     }, []);
    
//     return (
//       <aside onDrop={handleDrop}>
//         <div className="description">You can drag these nodes to the pane on the right.</div>
//         <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'chain_node')} draggable>
//           Chain Node
//         </div>
//         <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
//           Default Node
//         </div>
//         <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
//           Output Node
//         </div>
//       </aside>
//     );
//   };
// export default Sidebar;

import React, { useState } from 'react';
import { Box, Text, Input, Button, VStack, IconButton, Tooltip, Divider } from '@chakra-ui/react';
import { MdAdd, MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import './../../css/sidebarscrollbar.css';
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [options, setOptions] = useState([
    {
      heading: 'Predefined Nodes',
      options: ['Prompt', 'Prompt with Context', 'Visualise', 'Describe'],
    },
    {
      heading: 'Drag in Templates',
      options: [],
    },
  ]);

  const [newOption, setNewOption] = useState('');

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const addOption = () => {
    if (newOption.trim() !== '') {
      const updatedOptions = [...options];
      updatedOptions[0].options.push(newOption); // Adding to the first group as an example
      setOptions(updatedOptions);
      setNewOption('');
    }
  };

  return (
      <Box
        pos="fixed"
        left={open ? 0 : '-200px'}
        top={0}
        h="100vh"
        w="200px"
        bg="gray.800"
        color="white"
        p={5}
        overflowY="scroll"
      >
        <VStack align="start" spacing={4} paddingBottom={10} >
          {options.map((optionGroup) => (
            <VStack key={optionGroup.heading} align="start" spacing={2}>
              <Text fontWeight="bold">{optionGroup.heading}</Text>
              <Divider/>
              {optionGroup.options.map((option, index) => (
                <Box
                  key={option}
                  draggable
                  width="100%"
                  cursor="grab"
                  _hover={{
                    background: "blue.300",
                    color: "while",
                  }}
                  >
                    {option}
                  </Box>
              ))}
            </VStack>
          ))}
        </VStack>
        <Tooltip label='Open/Close Sidebar'>
          <IconButton
          icon={open ? <MdFullscreenExit/> : <MdFullscreen/> }
          onClick={toggleSidebar}
          width="100px"
          background="gray.300"
          pos="fixed"
          bottom={4}
          left="40px"
          aria-label="Collapse Sidebar"
          />
        </Tooltip>
      </Box>
  );
};
export default Sidebar;