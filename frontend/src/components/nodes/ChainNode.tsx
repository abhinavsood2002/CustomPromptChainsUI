import {
  Box,
  Center,
  Textarea,
  StackDivider,
  VStack,
  Button,
  HStack,
  Spinner,
} from "@chakra-ui/react"
import React, { useEffect } from "react"
import { Node, Handle, Position } from "reactflow"
import useStore from "../../store"
import { runNode } from "../../library/runNodes"

function ChainNode({ id, data, isConnectable }) {
  const reactFlowState = useStore()
  const [prompt, setPrompt] = React.useState("")
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)

  useEffect(() => {
    const currentNode = reactFlowState.getNode(id)

    if (currentNode && currentNode.data) {
      setInput(currentNode.data.input)
      setOutput(currentNode.data.output)
      setIsRunning(currentNode.data.running)
    }
  }, [reactFlowState, id])

  const handleInputChange = (e) => {
    let inputValue = e.target.value
    setPrompt(inputValue)
    console.log(id)
  }

  const handleUpdateState = () => {
    reactFlowState.updateNodeData(id, { prompt: prompt })
  }

  return (
    <div className="text-updater-node">
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ top: 180 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ top: 145 }}
      />
      <Box
        maxW="sm"
        border="1px"
        borderColor="gray.400"
        borderRadius="10px"
        shadow="lg"
        bg="white"
      >
        <Center>
          <VStack divider={<StackDivider borderColor="gray.400" />} spacing={2}>
            <Box>
              <HStack spacing={10} margin={1} marginLeft={10}>
                <Box>Prompt</Box>
                <Box>
                  <Button
                    colorScheme="blue"
                    onClick={() => runNode(id)}
                    h="20px"
                    w="20px"
                  >
                    Run
                  </Button>
                </Box>
                <Box>{isRunning && <Spinner />}</Box>
              </HStack>
              <Textarea
                value={prompt}
                onChange={handleInputChange}
                onBlur={handleUpdateState}
                placeholder="Enter a prompt to Transform your input"
              />
            </Box>
            <Box>Input: {input}</Box>
            <Box>Output: {output}</Box>
          </VStack>
        </Center>
      </Box>
    </div>
  )
}

export default ChainNode
