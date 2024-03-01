import { Box, Center, Textarea, StackDivider, VStack, HStack, Spinner, Tooltip } from "@chakra-ui/react"
import React from "react"
import { Handle, Position } from "reactflow"
import useStore from "../../store"
import "../../css/handle.css"

function InputNode({ id, data, isConnectable }) {
  const reactFlowState = useStore()
  const [input, setInput] = React.useState("")

  const handleInputChange = (e) => {
    let inputValue = e.target.value
    setInput(inputValue)
    console.log(id)
  }

  const handleUpdateState = () => {
    reactFlowState.updateNodeData(id, { output: input })
  }

  return (
    <div>
      <Tooltip label="Output">
        <Handle
          className="handle"
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{ position: "absolute", top: "50%", background: "red" }}
        />
      </Tooltip>
      <Box maxW="sm" border="1px" borderColor="gray.700" borderRadius="10px" shadow="lg" bg="white" w="100%">
        <Center>
          <VStack
            divider={<StackDivider w="100%" borderColor="gray.700" />}
            spacing={2}
            style={{ whiteSpace: "pre-wrap" }}
            w="100%"
            margin={1}
          >
            <HStack spacing={10} margin={1}>
              <Box>Input</Box>
            </HStack>
            <Textarea
              value={input}
              onChange={handleInputChange}
              onBlur={handleUpdateState}
              placeholder="Enter some text input"
              w="100%"
            />
          </VStack>
        </Center>
      </Box>
    </div>
  )
}

export default InputNode
