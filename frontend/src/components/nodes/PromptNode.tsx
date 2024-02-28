import { Box, Center, Textarea, StackDivider, VStack, Button, HStack, Spinner, Tooltip } from "@chakra-ui/react"
import React, { useEffect } from "react"
import { Handle, Position } from "reactflow"
import useStore from "../../store"
import { runChainNode } from "../../library/runNodes"
import "../../css/handle.css"

function PromptNode({ id, data, isConnectable }) {
  const reactFlowState = useStore()
  const [prompt, setPrompt] = React.useState("")
  const [promptText, setPromptText] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)

  useEffect(() => {
    const currentNode = reactFlowState.getNode(id)

    if (currentNode && currentNode.data) {
      setPromptText(currentNode.data.promptInput)
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
    <div>
      <Tooltip label="Connect to pass Prompt">
        <Handle
          className="handle"
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{ position: "absolute", top: "50%", background: "orange" }}
        />
      </Tooltip>
      <Tooltip label="Output">
        <Handle
          className="handle"
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{ position: "absolute", top: "80%", background: "red" }}
        />
      </Tooltip>
      <Box maxW="sm" border="1px" borderColor="gray.400" borderRadius="10px" shadow="lg" bg="white" w="100%">
        <Center>
          <VStack
            divider={<StackDivider w="100%" borderColor="gray.400" />}
            spacing={2}
            style={{ whiteSpace: "pre-wrap" }}
            w="100%"
          >
            <HStack spacing={10} margin={1} marginLeft={10}>
              <Box>Prompt</Box>
              <Box>
                <Button colorScheme="blue" onClick={() => runChainNode(id)} h="20px" w="20px">
                  Run
                </Button>
              </Box>
              <Box>{isRunning && <Spinner />}</Box>
            </HStack>
            <VStack spacing={0} w="100">
              <Textarea
                value={prompt}
                onChange={handleInputChange}
                onBlur={handleUpdateState}
                placeholder="Enter a prompt to generate output:"
                w="100%"
              />
              <Box w="100%">Additional text added to prompt: {promptText && "\n" + promptText}</Box>
            </VStack>

            <Box w="100%">Output: {"\n" + output}</Box>
          </VStack>
        </Center>
      </Box>
    </div>
  )
}

export default PromptNode
