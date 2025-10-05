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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
} from "@chakra-ui/react";

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    songName: "",
    artist: "",
    album: "",
    genre: "",
    lyricsAndChords: "",
    url: "",
    notes: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Monochrome colors
  const bg = useColorModeValue(
    "linear(to-b, white, gray.300)",
    "linear(to-b, gray.900, gray.700)"
  );
  const textColor = useColorModeValue("black", "white");
  const subTextColor = useColorModeValue("gray.700", "gray.300");
  const sectionBg = useColorModeValue("gray.100", "gray.800");

  // Fetch songs from API
  const fetchMusic = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
      setFilteredSongs(data);
    } catch (err) {
      console.error("Failed to fetch music:", err);
      setSongs([]);
      setFilteredSongs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMusic();
  }, []);

  // Filter songs based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredSongs(songs);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = songs.filter(
        (song) =>
          song.songName.toLowerCase().includes(lowerQuery) ||
          song.artist.toLowerCase().includes(lowerQuery) ||
          song.album.toLowerCase().includes(lowerQuery) ||
          song.genre.toLowerCase().includes(lowerQuery)
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      songName: "",
      artist: "",
      album: "",
      genre: "",
      lyricsAndChords: "",
      url: "",
      notes: "",
    });
    setEditingSong(null);
    setIsEditing(false);
  };

  const handleAddSong = async () => {
    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Song added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchMusic();
        resetForm();
        onClose();
      } else throw new Error("Failed to add song");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add song.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSong = (song) => {
    setFormData(song);
    setEditingSong(song);
    setIsEditing(true);
    onOpen();
  };

  const handleUpdateSong = async () => {
    try {
      const response = await fetch(`/api/songs/${editingSong._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Song updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchMusic();
        resetForm();
        onClose();
      } else throw new Error("Failed to update song");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update song.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSong = async (id) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        const response = await fetch(`/api/songs/${id}`, { method: "DELETE" });

        if (response.ok) {
          toast({
            title: "Deleted",
            description: "Song deleted successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchMusic();
        } else throw new Error("Failed to delete song");
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete song.",
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
          <Heading color={textColor}>Song Line Up</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Song Line Ups Database
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color={textColor}>
              Our Song Line Ups
            </Heading>
            <Button
              bg="white"
              color="black"
              border="1px solid black"
              _hover={{ bg: "black", color: "white" }}
              onClick={handleOpenAddModal}
            >
              Add New Song
            </Button>
          </HStack>

          {/* Search Input */}
          <Input
            placeholder="Search by song, artist, album, or genre..."
            mb={4}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={useColorModeValue("white", "gray.700")}
          />

          {/* Loading state */}
          {loading ? (
            <Spinner size="xl" color="gray.500" mt={8} />
          ) : (
            <Accordion allowToggle>
              {filteredSongs.length === 0 && (
                <Text color={subTextColor}>No songs found.</Text>
              )}
              {filteredSongs.map((song) => (
                <AccordionItem
                  key={song._id}
                  border="1px solid"
                  borderColor={subTextColor}
                  borderRadius="md"
                  mb={2}
                >
                  <h2>
                    <AccordionButton _expanded={{ bg: sectionBg }}>
                      <Box flex="1" textAlign="left" color={textColor}>
                        {song.songName}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    <Text color={subTextColor}>Artist: {song.artist}</Text>
                    <Text color={subTextColor}>Album: {song.album}</Text>
                    <Text color={subTextColor}>Genre: {song.genre}</Text>

                    {song.lyricsAndChords && (
                      <Text color={subTextColor} mt={2} whiteSpace="pre-wrap">
                        Lyrics & Chords: {song.lyricsAndChords}
                      </Text>
                    )}

                    {song.notes && (
                      <Text color={subTextColor} mt={2} whiteSpace="pre-wrap">
                        Notes: {song.notes}
                      </Text>
                    )}

                    {song.url && (
                      <Text color={textColor} mt={2}>
                        <a
                          href={song.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Listen
                        </a>
                      </Text>
                    )}

                    <HStack spacing={2} mt={2}>
                      <Button
                        bg="white"
                        color="black"
                        border="1px solid black"
                        _hover={{ bg: "black", color: "white" }}
                        onClick={() => handleEditSong(song)}
                      >
                        Edit
                      </Button>
                      <Button
                        bg="white"
                        color="black"
                        border="1px solid black"
                        _hover={{ bg: "black", color: "white" }}
                        onClick={() => handleDeleteSong(song._id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Box>
      </VStack>

      {/* Add/Edit Modal */}
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
                  name="songName"
                  value={formData.songName}
                  onChange={handleInputChange}
                  placeholder="Enter song name"
                />
              </FormControl>

              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Artist</FormLabel>
                  <Input
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    placeholder="Enter artist name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Album</FormLabel>
                  <Input
                    name="album"
                    value={formData.album}
                    onChange={handleInputChange}
                    placeholder="Enter album name"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Genre</FormLabel>
                  <Input
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="Enter genre"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>URL</FormLabel>
                  <Input
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="Enter song URL"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Lyrics & Chords</FormLabel>
                <Textarea
                  name="lyricsAndChords"
                  value={formData.lyricsAndChords}
                  onChange={handleInputChange}
                  placeholder="Enter lyrics and chords"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes"
                  rows={2}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="white"
              color="black"
              border="1px solid black"
              _hover={{ bg: "black", color: "white" }}
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              bg="white"
              color="black"
              border="1px solid black"
              _hover={{ bg: "black", color: "white" }}
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
