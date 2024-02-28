import { Box, Center, Textarea, StackDivider, VStack, Image, Tooltip } from "@chakra-ui/react"
import React, { useEffect } from "react"
import { Handle, Position } from "reactflow"
import useStore from "../../store"
import { runTextToImage } from "../../library/runNodes"
import StandardNodeHeader from "./StandardNodeHeader"
import "../../css/handle.css"

function PromptNode({ id, data, isConnectable }) {
  const reactFlowState = useStore()
  const [prompt, setPrompt] = React.useState("")
  const [promptText, setPromptText] = React.useState("")
  const [image, setImage] = React.useState("")

  useEffect(() => {
    const currentNode = reactFlowState.getNode(id)

    if (currentNode && currentNode.data) {
      setImage(currentNode.data.image)
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
      <Tooltip label="Connect/Enter a prompt to generate an image">
        <Handle
          className="handle"
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{ top: "35%" }}
        />
      </Tooltip>
      <Box maxW="sm" border="1px" borderColor="gray.400" borderRadius="10px" shadow="lg" bg="white" w="100%">
        <Center>
          <VStack divider={<StackDivider borderColor="gray.400" />} spacing={2} style={{ whiteSpace: "pre-wrap" }}>
            <Box w="100%">
              <StandardNodeHeader data={data} onClick={() => runTextToImage(id)} />
            </Box>
            <Box w="95%">
              <Textarea
                value={prompt}
                onChange={handleInputChange}
                onBlur={handleUpdateState}
                placeholder="Enter a prompt to generate output:"
              />
            </Box>
            <Box margin={2}>
              Image:
              <Image src={image} alt="" w="100%" />
            </Box>
          </VStack>
        </Center>
      </Box>
    </div>
  )
}

export default PromptNode
