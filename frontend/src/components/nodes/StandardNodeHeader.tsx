import {
  Text,
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
} from "@chakra-ui/react"
import { FaEye, FaPlay } from "react-icons/fa"
import React, { useState } from "react"

export default function StandardNodeHeader({ data, onClick }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  return (
    <HStack spacing={10} margin={2} marginLeft={10}>
      <Box>Prompt</Box>
      <Box>
        <Tooltip label="Expand details" aria-label="Expand details">
          <IconButton colorScheme="blue" onClick={handleOpenModal} h="25px" w="20px" aria-label={""} icon={<FaEye />} />
        </Tooltip>
      </Box>
      <Box>
        <Button colorScheme="blue" onClick={onClick} h="25px" w="70px" leftIcon={<FaPlay />}>
          Run
        </Button>
      </Box>
      <Box>{data.isRunning && <Spinner />}</Box>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xxl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Node Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box overflowY="auto">
              {Object.entries(data)
                .filter(([key]) => key !== "running")
                .map(([key, value]) => (
                  <Box key={key}>
                    <Text as="h4" fontSize="xl" fontWeight="bold" mb="2">
                      {key}
                    </Text>
                    {typeof value === "string" ? (
                      <Text>{value}</Text>
                    ) : (
                      <img src={(value as { src: string }).src} alt={key} />
                    )}
                  </Box>
                ))}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  )
}
