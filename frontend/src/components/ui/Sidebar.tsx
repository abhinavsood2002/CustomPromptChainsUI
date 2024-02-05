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
import { Box, Text, Input, Button, VStack, IconButton } from '@chakra-ui/react';
import { MdAdd, MdChevronLeft, MdExpand, MdFullscreen, MdFullscreenExit } from 'react-icons/md';
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [options, setOptions] = useState([
    {
      heading: 'Group 1',
      options: ['Option 1.1', 'Option 1.2'],
    },
    {
      heading: 'Group 2',
      options: ['Option 2.1', 'Option 2.2'],
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
      left={open ? 0 : '-220px'}
      top={0}
      h="100vh"
      w="250px"
      bg="gray.800"
      color="white"
      p={4}
      overflowY="auto"
    >
      <Input
        placeholder="New Option"
        value={newOption}
        onChange={(e) => setNewOption(e.target.value)}
        mb={2}
      />
      <Button
        leftIcon={<MdAdd />}
        onClick={addOption}
        mb={4}
        aria-label="Add Option"
      >
        Add Option
      </Button>

      <VStack align="start" spacing={4}>
        {options.map((optionGroup) => (
          <VStack key={optionGroup.heading} align="start" spacing={2}>
            <Text fontWeight="bold">{optionGroup.heading}</Text>
            {optionGroup.options.map((option) => (
              <Text key={option}>{option}</Text>
            ))}
          </VStack>
        ))}
      </VStack>

      <IconButton
        icon={open ? <MdFullscreenExit/> : <MdFullscreen/> }
        onClick={toggleSidebar}
        pos="absolute"
        bottom={4}
        left="210px"
        aria-label="Collapse Sidebar"
      />
    </Box>
  );
};
export default Sidebar;