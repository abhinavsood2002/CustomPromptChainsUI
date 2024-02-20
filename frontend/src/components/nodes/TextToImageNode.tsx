import {
  Box,
  Center,
  Textarea,
  StackDivider,
  VStack,
  Button,
  HStack,
  Spinner,
  Image,
} from "@chakra-ui/react"
import React, { useEffect } from "react"
import { Handle, Position } from "reactflow"
import useStore from "../../store"
import { runChainNode } from "../../library/runNodes"

export default function TextToImageNode({ id, data, isConnectable }) {
  const reactFlowState = useStore()
  const [prompt, setPrompt] = React.useState("")
  const [image, setImage] = React.useState("")
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)

  useEffect(() => {
    const currentNode = reactFlowState.getNode(id)

    if (currentNode && currentNode.data) {
      setInput(currentNode.data.input)
      setOutput(currentNode.data.output)
      setIsRunning(currentNode.data.running)
      setPrompt(currentNode.data.prompt)
      setImage(currentNode.data.image)
    }
  }, [reactFlowState, id])

  const handleInputChange = (e) => {
    let inputValue = e.target.value
    setPrompt(inputValue)
    console.log(id)
  }

  const handleImageChange = (e) => {
    let imageUrl = e.target.value
    setImage(imageUrl)
  }

  const handleUpdateState = () => {
    reactFlowState.updateNodeData(id, { prompt: prompt, image: image })
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
          <VStack
            divider={<StackDivider borderColor="gray.400" />}
            spacing={2}
            style={{ whiteSpace: "pre-wrap" }}
          >
            <Box>
              <HStack spacing={10} margin={1} marginLeft={10}>
                <Box>Prompt</Box>
                <Box>
                  <Button
                    colorScheme="blue"
                    onClick={() => runChainNode(id)}
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
            <Box>
              <HStack spacing={10} margin={1} marginLeft={10}>
                <Box>Image URL</Box>
              </HStack>
              <Textarea
                value={image}
                onChange={handleImageChange}
                onBlur={handleUpdateState}
                placeholder="Enter the URL of the image"
              />
            </Box>
            {image && <Image src={image} alt="Node Image" />}
            <Box>Input: {"\n" + input}</Box>
            <Box>Output: {"\n" + output}</Box>
          </VStack>
        </Center>
      </Box>
    </div>
  )
}
