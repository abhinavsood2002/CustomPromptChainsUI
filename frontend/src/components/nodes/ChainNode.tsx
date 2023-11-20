import { Box, Center, Textarea, StackDivider, VStack } from '@chakra-ui/react'
import React from 'react';
import { Handle, Position } from 'reactflow';


function ChainNode({ data, isConnectable }) {
  return (
    <div className="text-updater-node">
        <Handle type="source" 
                            position={Position.Right}  
                            isConnectable={isConnectable} 
                            style={{top: 225}}/>
        <Handle type="target" 
        position={Position.Left} 
        isConnectable={isConnectable} 
        style={{top: 150}}/>
        <Box  maxW='sm' border='1px' borderColor='gray.200' borderRadius='10px' shadow='lg' bg='white'>
            <Center>
                <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={2}
                >
                    <Box >
                    Prompt <Textarea placeholder='Enter a prompt to Transform your input' />
                    </Box>
                    <Box h='60px'>
                    Input 
                    </Box>
                    <Box h='60px'>
                    Output
                    </Box>
                </VStack>
            </Center>
        </Box>
    </div>
  );
}

export default ChainNode;
