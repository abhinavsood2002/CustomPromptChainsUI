import { Box, Center, Textarea, StackDivider, VStack, Button, HStack, Spinner } from "@chakra-ui/react"
import React, { useEffect } from "react"
import { Handle, Position } from "reactflow"
import useStore from "../../store"
import { runTextToImage } from "../../library/runNodes"
import "../../css/handle.css"

function PromptNode({ id, data, isConnectable }) {
  const reactFlowState = useStore()
  const [prompt, setPrompt] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)

  useEffect(() => {
    const currentNode = reactFlowState.getNode(id)

    if (currentNode && currentNode.data) {
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
      <Handle
        className="handle"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ top: 70 }}
      />
      <Box maxW="sm" border="1px" borderColor="gray.400" borderRadius="10px" shadow="lg" bg="white">
        <Center>
          <VStack divider={<StackDivider borderColor="gray.400" />} spacing={2} style={{ whiteSpace: "pre-wrap" }}>
            <Box w="100%">
              <HStack spacing={10} margin={1} marginLeft={10}>
                <Box>Prompt</Box>
                <Box>
                  <Button colorScheme="blue" onClick={() => runTextToImage(id)} h="20px" w="20px">
                    Run
                  </Button>
                </Box>
                <Box>{isRunning && <Spinner />}</Box>
              </HStack>
              <Box>
                <Textarea
                  value={prompt}
                  onChange={handleInputChange}
                  onBlur={handleUpdateState}
                  placeholder="Enter a prompt to generate output:"
                />
              </Box>
            </Box>
            <Box>Image: {"\n" + output}</Box>
          </VStack>
        </Center>
      </Box>
    </div>
  )
}

export default PromptNode
