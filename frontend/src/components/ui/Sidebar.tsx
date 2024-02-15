import React, { useCallback, useState } from "react"
import {
  Box,
  Text,
  VStack,
  IconButton,
  Tooltip,
  Divider,
} from "@chakra-ui/react"
import { MdFullscreen, MdFullscreenExit } from "react-icons/md"
import { SidebarState } from "./../../states/SidebarState"
import "./../../css/sidebarscrollbar.css"
const Sidebar = () => {
  const [open, setOpen] = useState(true)
  const [options, setOptions] = useState(SidebarState)

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleDrop = useCallback((event) => {
    event.preventDefault()
    const file = event.dataTransfer.files
    const updatedOptions = [...options]
    // Add uploaded file to custom templates options group
    updatedOptions[1].options.push(file.name)
    updatedOptions[1].options_type.push("chain_node")
    setOptions(updatedOptions)
  }, [])

  const toggleSidebar = () => {
    setOpen(!open)
  }

  return (
    <Box
      pos="fixed"
      left={open ? 0 : "-200px"}
      top={0}
      h="100vh"
      w="200px"
      bg="gray.800"
      color="white"
      p={5}
      overflowY="scroll"
      onDrop={handleDrop}
    >
      <VStack align="start" spacing={4} paddingBottom={10}>
        {options.map((optionGroup) => (
          <VStack key={optionGroup.heading} align="start" spacing={2}>
            <Text fontWeight="bold">{optionGroup.heading}</Text>
            <Divider />
            {optionGroup.options.map((option, index) => (
              <Box
                key={option}
                onDragStart={(event) =>
                  onDragStart(event, optionGroup.options_type[index])
                }
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
      <Tooltip label="Open/Close Sidebar">
        <IconButton
          icon={open ? <MdFullscreenExit /> : <MdFullscreen />}
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
  )
}
export default Sidebar
