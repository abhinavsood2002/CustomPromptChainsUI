import { Box, Center, Textarea, StackDivider, VStack, Button, HStack } from '@chakra-ui/react'
import React from 'react';
import { Handle, Position } from 'reactflow';


function ChainNode({ data, isConnectable }) {
  const [prompt, setPrompt] = React.useState('')
  const [input, setInput] = React.useState('')
  const [output, setOutput] = React.useState('')

  const handleInputChange = (e) => {
    let inputValue = e.target.value
    setPrompt(inputValue)
  }
  const run = () => {
    const promptToPass = encodeURIComponent(prompt);
    const inputToPass = encodeURIComponent(input);
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/run/chain_node?prompt=${promptToPass}&input=${inputToPass}`
    fetch(apiUrl)
      .then((response) => response.json())
      .then((result) => setOutput(result.output))
  };

  return (
    <div className="text-updater-node">
        <Handle type="source" 
                            position={Position.Right}  
                            isConnectable={isConnectable} 
                            style={{top: 180}}/>
        <Handle type="target" 
        position={Position.Left} 
        isConnectable={isConnectable} 
        style={{top: 145}}/>
        <Box  maxW='sm' border='1px' borderColor='gray.200' borderRadius='10px' shadow='lg' bg='white'>
            <Center>
                <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={2}
                >
                    <Box >
                      <HStack spacing={10} margin={1} marginLeft={10} >
                        <Box>
                          Prompt
                        </Box>
                        <Box>
                          <Button colorScheme="blue" onClick={run} h='20px' w='20px'>
                            Run
                          </Button>
                        </Box>
                      </HStack>
                      <Textarea 
                        value={prompt}
                        onChange={handleInputChange}
                        placeholder='Enter a prompt to Transform your input' />
                     
                    </Box>
                    <Box>
                    Input: {input}
                    </Box>
                    <Box>
                    Output: {output}
                    </Box>
                </VStack>
            </Center>
        </Box>
    </div>
  );
}

export default ChainNode;
