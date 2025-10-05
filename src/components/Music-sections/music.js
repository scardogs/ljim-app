import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    "Song Name": "",
    Artist: "",
    Album: "",
    Genre: "",
    "Lyrics & Chords": "",
    URL: "",
    Notes: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bg = useColorModeValue(
    "linear(to-b, white, gray.100)",
    "linear(to-b, gray.900, black)"
  );
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );

  // Fetch songs from Google Sheets API
  const fetchMusic = async () => {
    try {
      const res = await fetch("/api/music");
      const data = await res.json();

      // Transform Google Sheets data (array of arrays) to objects
      if (Array.isArray(data) && data.length > 0) {
        // Skip the header row (first row) and transform each row to an object
        const transformedSongs = data.slice(1).map((row) => ({
          "Song Name": row[0] || "",
          Artist: row[1] || "",
          Album: row[2] || "",
          Genre: row[3] || "",
          "Lyrics & Chords": row[4] || "",
          URL: row[5] || "",
          Notes: row[6] || "",
        }));
        setSongs(transformedSongs);
      } else {
        setSongs([]);
      }
    } catch (err) {
      console.error("Failed to fetch music:", err);
      setSongs([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchMusic();
  }, []);

  // CRUD Functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      "Song Name": "",
      Artist: "",
      Album: "",
      Genre: "",
      "Lyrics & Chords": "",
      URL: "",
      Notes: "",
    });
    setEditingSong(null);
    setIsEditing(false);
  };

  const handleAddSong = async () => {
    try {
      const row = [
        formData["Song Name"],
        formData.Artist,
        formData.Album,
        formData.Genre,
        formData["Lyrics & Chords"],
        formData.URL,
        formData.Notes,
      ];

      const response = await fetch("/api/music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Song added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchMusic(); // Refresh the list
        resetForm();
        onClose();
      } else {
        throw new Error("Failed to add song");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add song. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSong = (song, index) => {
    setFormData(song);
    setEditingSong({ ...song, index });
    setIsEditing(true);
    onOpen();
  };

  const handleUpdateSong = async () => {
    try {
      const row = [
        formData["Song Name"],
        formData.Artist,
        formData.Album,
        formData.Genre,
        formData["Lyrics & Chords"],
        formData.URL,
        formData.Notes,
      ];

      const response = await fetch("/api/music", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rowIndex: editingSong.index,
          rowData: row,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Song updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchMusic(); // Refresh the list
        resetForm();
        onClose();
      } else {
        throw new Error("Failed to update song");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update song. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSong = async (index) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        const response = await fetch("/api/music", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rowIndex: index }),
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Song deleted successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchMusic(); // Refresh the list
        } else {
          throw new Error("Failed to delete song");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete song. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsEditing(false);
    onOpen();
  };

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      textAlign="center"
      py={{ base: 16, md: 24 }}
    >
      <VStack spacing={8} maxW="4xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%">
          <Heading color={textColor}>Music</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Explore our music collection and enjoy inspiring songs and
            performances.
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color={textColor}>
              Our Worship Music
            </Heading>
            <Button colorScheme="blue" onClick={handleOpenAddModal}>
              Add New Song
            </Button>
          </HStack>

          <VStack spacing={4}>
            {songs.length === 0 && (
              <Text color={subTextColor}>No songs found.</Text>
            )}
            {songs.map((song, i) => (
              <Box key={i} p={4} borderWidth={1} borderRadius="md" w="100%">
                <HStack justify="space-between" align="flex-start" mb={2}>
                  <Box flex={1}>
                    <Heading size="sm" color={textColor}>
                      {song["Song Name"]}
                    </Heading>
                    <Text color={subTextColor}>Artist: {song["Artist"]}</Text>
                    <Text color={subTextColor}>Album: {song["Album"]}</Text>
                    <Text color={subTextColor}>Genre: {song["Genre"]}</Text>
                    {song["Lyrics & Chords"] && (
                      <Text color={subTextColor} fontSize="sm" mt={1}>
                        Lyrics & Chords: {song["Lyrics & Chords"]}
                      </Text>
                    )}
                    {song["Notes"] && (
                      <Text color={subTextColor} fontSize="sm" mt={1}>
                        Notes: {song["Notes"]}
                      </Text>
                    )}
                    {song["URL"] && (
                      <Text color="blue.500" mt={2}>
                        <a
                          href={song["URL"]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Listen
                        </a>
                      </Text>
                    )}
                  </Box>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleEditSong(song, i)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDeleteSong(i)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>

      {/* Add/Edit Song Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Song" : "Add New Song"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Song Name</FormLabel>
                <Input
                  name="Song Name"
                  value={formData["Song Name"]}
                  onChange={handleInputChange}
                  placeholder="Enter song name"
                />
              </FormControl>

              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Artist</FormLabel>
                  <Input
                    name="Artist"
                    value={formData.Artist}
                    onChange={handleInputChange}
                    placeholder="Enter artist name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Album</FormLabel>
                  <Input
                    name="Album"
                    value={formData.Album}
                    onChange={handleInputChange}
                    placeholder="Enter album name"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Genre</FormLabel>
                  <Input
                    name="Genre"
                    value={formData.Genre}
                    onChange={handleInputChange}
                    placeholder="Enter genre"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>URL</FormLabel>
                  <Input
                    name="URL"
                    value={formData.URL}
                    onChange={handleInputChange}
                    placeholder="Enter song URL"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Lyrics & Chords</FormLabel>
                <Textarea
                  name="Lyrics & Chords"
                  value={formData["Lyrics & Chords"]}
                  onChange={handleInputChange}
                  placeholder="Enter lyrics and chords"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  name="Notes"
                  value={formData.Notes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes"
                  rows={2}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={isEditing ? handleUpdateSong : handleAddSong}
            >
              {isEditing ? "Update Song" : "Add Song"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
