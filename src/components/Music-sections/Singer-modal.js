import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  HStack,
  VStack,
  Spinner,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

export default function SingerModal({ isOpen, onClose }) {
  const [singers, setSingers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Fname: "",
    Mname: "",
    Lname: "",
  });
  const [editingSinger, setEditingSinger] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const bg = useColorModeValue("white", "gray.800");

  const fetchSingers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/singers");
      const data = await res.json();
      setSingers(data);
    } catch (err) {
      console.error(err);
      setSingers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchSingers();
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ Fname: "", Mname: "", Lname: "" });
    setEditingSinger(null);
    setIsEditing(false);
  };

  const handleAddSinger = async () => {
    try {
      const res = await fetch("/api/singers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({
          title: "Added",
          description: "Singer added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSingers();
        resetForm();
      } else throw new Error("Failed to add singer");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add singer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSinger = (singer) => {
    setFormData({
      Fname: singer.Fname,
      Mname: singer.Mname,
      Lname: singer.Lname,
    });
    setEditingSinger(singer);
    setIsEditing(true);
  };

  const handleUpdateSinger = async () => {
    try {
      const res = await fetch(`/api/singers/${editingSinger._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({
          title: "Updated",
          description: "Singer updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSingers();
        resetForm();
      } else throw new Error("Failed to update singer");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update singer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSinger = async (id) => {
    if (window.confirm("Are you sure you want to delete this singer?")) {
      try {
        const res = await fetch(`/api/singers/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast({
            title: "Deleted",
            description: "Singer deleted successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchSingers();
        } else throw new Error("Failed to delete singer");
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete singer.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={bg} maxH="90vh">
        <ModalHeader fontSize="2xl" fontWeight="bold">
          {isEditing ? "Edit Singer" : "Singers List"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Form Section */}
            <HStack w="100%" spacing={4}>
              <Input
                placeholder="First Name"
                name="Fname"
                value={formData.Fname}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Middle Name"
                name="Mname"
                value={formData.Mname}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Last Name"
                name="Lname"
                value={formData.Lname}
                onChange={handleInputChange}
              />
              <Button
                onClick={isEditing ? handleUpdateSinger : handleAddSinger}
                bg="white"
                color="black"
                border="1px solid black"
                _hover={{ bg: "black", color: "white" }}
                px={6}
              >
                {isEditing ? "Update" : "Add"}
              </Button>
            </HStack>

            {/* Table Section */}
            <Box
              overflowY="auto"
              maxH="55vh"
              borderRadius="md"
              borderWidth="1px"
            >
              {loading ? (
                <Spinner mt={4} />
              ) : (
                <Table variant="simple" size="md">
                  <Thead bg={useColorModeValue("gray.200", "gray.700")}>
                    <Tr>
                      <Th>First Name</Th>
                      <Th>Middle Name</Th>
                      <Th>Last Name</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {singers.map((singer) => (
                      <Tr key={singer._id}>
                        <Td>{singer.Fname}</Td>
                        <Td>{singer.Mname}</Td>
                        <Td>{singer.Lname}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditSinger(singer)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDeleteSinger(singer._id)}
                            >
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={onClose}
            bg="white"
            color="black"
            border="1px solid black"
            _hover={{ bg: "black", color: "white" }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
