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
  Select,
} from "@chakra-ui/react";

import SingerModal from "../Music-sections/Singer-modal"; // ✅ import Singer modal

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [singers, setSingers] = useState([]); // ✅ store all singers
  const [formData, setFormData] = useState({
    songName: "",
    artist: "",
    album: "",
    genre: "",
    lyricsAndChords: "",
    url: "",
    notes: "",
    dateTime: "",
    SingerFname: "", // ✅ added singer field
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isFullScreenOpen,
    onOpen: onFullScreenOpen,
    onClose: onFullScreenClose,
  } = useDisclosure();

  const [isSingerModalOpen, setIsSingerModalOpen] = useState(false);
  const openSingerModal = () => setIsSingerModalOpen(true);
  const closeSingerModal = () => {
    setIsSingerModalOpen(false);
    fetchSingers(); // ✅ refresh singers when modal closes
  };

  const toast = useToast();

  const bg = useColorModeValue(
    "linear(to-b, white, gray.300)",
    "linear(to-b, gray.900, gray.700)"
  );
  const textColor = useColorModeValue("black", "white");
  const subTextColor = useColorModeValue("gray.700", "gray.300");
  const sectionBg = useColorModeValue("gray.100", "gray.800");

  // ✅ Fetch all singers for the dropdown
  const fetchSingers = async () => {
    try {
      const res = await fetch("/api/singers");
      if (!res.ok) throw new Error("Failed to load singers");
      const data = await res.json();
      setSingers(data);
    } catch (err) {
      console.error("Error loading singers:", err);
      toast({
        title: "Error loading singers",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSingers([]);
    }
  };

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
    fetchSingers(); // ✅ load singers at start
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredSongs(songs);
    } else {
      const lowerQuery = searchQuery.toLowerCase();

      const filtered = songs.filter((song) => {
        const dateObj = song.dateTime ? new Date(song.dateTime) : null;

        // Convert date to different readable formats for matching
        const dateStr = dateObj ? dateObj.toLocaleString().toLowerCase() : "";

        // Convert month name (like October) for better matching
        const monthName = dateObj
          ? dateObj.toLocaleString("default", { month: "long" }).toLowerCase()
          : "";

        // Add singer’s first name to searchable fields
        const singerFname = song.SingerFname?.toLowerCase() || "";

        return (
          song.songName.toLowerCase().includes(lowerQuery) ||
          song.artist.toLowerCase().includes(lowerQuery) ||
          song.album?.toLowerCase().includes(lowerQuery) ||
          song.genre?.toLowerCase().includes(lowerQuery) ||
          dateStr.includes(lowerQuery) ||
          monthName.includes(lowerQuery) ||
          singerFname.includes(lowerQuery)
        );
      });

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
      dateTime: "",
      SingerFname: "",
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
        const newSong = await response.json(); // 👈 get the new song data from backend

        toast({
          title: "Success",
          description: "Song added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // ✅ Instantly update state to show new song in the UI
        setSongs((prev) => [newSong, ...prev]);
        setFilteredSongs((prev) => [newSong, ...prev]);

        resetForm();
        onClose();

        // (Optional) Re-fetch in the background to sync DB state
        setTimeout(fetchMusic, 500);
      } else {
        throw new Error("Failed to add song");
      }
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
    const dateTimeValue = song.dateTime
      ? new Date(song.dateTime).toISOString().slice(0, 16)
      : "";
    setFormData({ ...song, dateTime: dateTimeValue });
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

  const handleOpenFullScreenLyrics = () => {
    onFullScreenOpen();
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
          <Text
            fontFamily="monospace"
            color={subTextColor}
            mt={4}
            fontSize="lg"
          >
            Song Line Ups Database
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color={textColor}>
              Our Song Line Ups
            </Heading>
            <HStack spacing={2}>
              <Button
                bg="white"
                color="black"
                border="1px solid black"
                _hover={{ bg: "black", color: "white" }}
                onClick={handleOpenAddModal}
              >
                Add New Song
              </Button>
              <Button
                bg="white"
                color="black"
                border="1px solid black"
                _hover={{ bg: "black", color: "white" }}
                onClick={openSingerModal}
              >
                + Singer
              </Button>
            </HStack>
          </HStack>

          <Input
            placeholder="Search by song, artist, album, genre, or date..."
            mb={4}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={useColorModeValue("white", "gray.700")}
          />

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
                        {song.songName}{" "}
                        <Text
                          as="span"
                          fontSize="sm"
                          color={subTextColor}
                          ml={2}
                        >
                          (
                          {song.dateTime
                            ? new Date(song.dateTime).toLocaleString("en-PH", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                          )
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    <Text fontFamily="monospace" color={subTextColor}>
                      Artist: {song.artist}
                    </Text>
                    <Text fontFamily="monospace" color={subTextColor}>
                      Album: {song.album}
                    </Text>
                    <Text fontFamily="monospace" color={subTextColor}>
                      Genre: {song.genre}
                    </Text>
                    <Text fontFamily="monospace" color={subTextColor}>
                      Singer: {song.SingerFname || "N/A"}
                    </Text>

                    {song.lyricsAndChords && (
                      <Text
                        fontFamily="monospace"
                        color={subTextColor}
                        mt={2}
                        whiteSpace="pre-wrap"
                      >
                        Lyrics & Chords: {song.lyricsAndChords}
                      </Text>
                    )}

                    {song.notes && (
                      <Text color={subTextColor} mt={2} whiteSpace="pre-wrap">
                        Notes: {song.notes}
                      </Text>
                    )}

                    {song.url && (
                      <Text fontFamily="monospace" color={textColor} mt={2}>
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

                {/* ✅ SingerFname Combobox */}
                <FormControl>
                  <FormLabel>Singer</FormLabel>
                  <Select
                    name="SingerFname"
                    value={formData.SingerFname}
                    onChange={handleInputChange}
                    placeholder="Select Singer"
                  >
                    {singers.map((singer) => (
                      <option key={singer._id} value={singer.Fname}>
                        {singer.Fname}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="Enter song URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Date & Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Lyrics & Chords</FormLabel>
                <Textarea
                  fontFamily="monospace"
                  name="lyricsAndChords"
                  value={formData.lyricsAndChords}
                  onChange={handleInputChange}
                  placeholder="Enter lyrics and chords"
                  rows={4}
                />
                <Button
                  mt={2}
                  size="sm"
                  onClick={handleOpenFullScreenLyrics}
                  bg="white"
                  color="black"
                  border="1px solid black"
                  _hover={{ bg: "black", color: "white" }}
                >
                  Full Screen
                </Button>
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  fontFamily="monospace"
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

      {/* Full Screen Lyrics Modal */}
      <Modal isOpen={isFullScreenOpen} onClose={onFullScreenClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lyrics & Chords - Full Screen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              fontFamily="monospace"
              value={formData.lyricsAndChords}
              onChange={handleInputChange}
              name="lyricsAndChords"
              rows={20}
              h="80vh"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onFullScreenClose}
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

      {/* Singer Modal */}
      <SingerModal isOpen={isSingerModalOpen} onClose={closeSingerModal} />
    </Box>
  );
}
