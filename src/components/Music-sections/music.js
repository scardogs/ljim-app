import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  useDisclosure,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

import SingerModal from "../Music-sections/Singer-modal";
import AddSongModal from "../Music-sections/addSongModal";

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [singers, setSingers] = useState([]);
  const [formData, setFormData] = useState({
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
    fetchSingers();
  };

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgGradient = useColorModeValue(
    "linear(to-b, gray.100, white)",
    "linear(to-b, gray.900, gray.800)"
  );
  const sectionBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const accent = useColorModeValue("gray.700", "gray.400");

  // Fetch functions
  const fetchSingers = async () => {
    try {
      const res = await fetch("/api/singers");
      if (!res.ok) throw new Error("Failed to load singers");
      const data = await res.json();
      setSingers(data);
    } catch (err) {
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
      setSongs([]);
      setFilteredSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic();
    fetchSingers();
  }, []);

  useEffect(() => {
    if (!searchQuery) return setFilteredSongs(songs);

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = songs.filter((song) => {
      const dateObj = song.dateTime ? new Date(song.dateTime) : null;
      const dateStr = dateObj ? dateObj.toLocaleString().toLowerCase() : "";
      const monthName = dateObj
        ? dateObj.toLocaleString("default", { month: "long" }).toLowerCase()
        : "";
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
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add song");
      const newSong = await res.json();
      setSongs((prev) => [newSong, ...prev]);
      setFilteredSongs((prev) => [newSong, ...prev]);
      resetForm();
      onClose();
      toast({ title: "Song added!", status: "success", duration: 2000 });
    } catch {
      toast({ title: "Failed to add song", status: "error", duration: 3000 });
    } finally {
      setIsSubmitting(false);
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
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/songs/${editingSong._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update song");
      toast({ title: "Song updated!", status: "success", duration: 2000 });
      fetchMusic();
      resetForm();
      onClose();
    } catch {
      toast({
        title: "Failed to update song",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete song");
      toast({ title: "Song deleted!", status: "success", duration: 2000 });
      fetchMusic();
    } catch {
      toast({
        title: "Failed to delete song",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={16}>
      <VStack spacing={10} maxW="5xl" mx="auto" px={4}>
        {/* Header */}
        <Box
          bg={sectionBg}
          p={10}
          borderRadius="2xl"
          shadow="xl"
          textAlign="center"
        >
          <Heading color={textColor} fontFamily="monospace">
            Song Line Up
          </Heading>
          <Text color={subTextColor} mt={3} fontFamily="monospace">
            Manage all your song line-ups elegantly
          </Text>
        </Box>

        {/* Controls */}
        <Box bg={sectionBg} p={6} borderRadius="2xl" shadow="md" w="100%">
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color={textColor} fontFamily="monospace">
              Our Song Line Ups
            </Heading>
            <HStack spacing={2}>
              <Button
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                onClick={() => {
                  resetForm();
                  onOpen();
                }}
                fontFamily="monospace"
              >
                + Add New Song
              </Button>
              <Button
                bg="gray.700"
                color="white"
                _hover={{ bg: "gray.500" }}
                onClick={openSingerModal}
                fontFamily="monospace"
              >
                + Singer
              </Button>
            </HStack>
          </HStack>

          <Input
            placeholder="Search by song, artist, album, genre..."
            mb={4}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={useColorModeValue("gray.50", "gray.700")}
            fontFamily="monospace"
          />

          {loading ? (
            <Spinner size="xl" color={accent} mt={8} />
          ) : (
            <Accordion allowToggle>
              {filteredSongs.length === 0 && (
                <Text color={subTextColor} mt={4}>
                  No songs found.
                </Text>
              )}
              {filteredSongs.map((song) => (
                <AccordionItem
                  key={song._id}
                  border="1px solid"
                  borderColor={accent}
                  borderRadius="md"
                  mb={3}
                  shadow="sm"
                  _hover={{ shadow: "md" }}
                >
                  <AccordionButton _expanded={{ bg: sectionBg }}>
                    <Box flex="1" textAlign="left" fontFamily="monospace">
                      {song.songName}{" "}
                      <Text as="span" fontSize="sm" color={subTextColor} ml={2}>
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
                  <AccordionPanel pb={4}>
                    <VStack align="start" spacing={1}>
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
                        <Text fontFamily="monospace" color={textColor}>
                          <a
                            href={song.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Listen
                          </a>
                        </Text>
                      )}
                    </VStack>
                    <HStack spacing={2} mt={3}>
                      <Button
                        bg="black"
                        color="white"
                        _hover={{ bg: "gray.800" }}
                        fontFamily="monospace"
                        onClick={() => handleEditSong(song)}
                      >
                        Edit
                      </Button>
                      <Button
                        bg="gray.700"
                        color="white"
                        _hover={{ bg: "gray.500" }}
                        fontFamily="monospace"
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
      <AddSongModal
        isOpen={isOpen}
        onClose={onClose}
        isEditing={isEditing}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAddSong={handleAddSong}
        handleUpdateSong={handleUpdateSong}
        handleOpenFullScreenLyrics={onFullScreenOpen}
        isSubmitting={isSubmitting}
        singers={singers}
      />

      {/* Full Screen Lyrics Modal */}
      <Modal isOpen={isFullScreenOpen} onClose={onFullScreenClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="monospace">
            Lyrics & Chords - Full Screen
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            <Textarea
              fontFamily="monospace"
              value={formData.lyricsAndChords}
              onChange={handleInputChange}
              name="lyricsAndChords"
              h="80vh"
              resize="vertical"
              overflowY="auto"
              p={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onFullScreenClose}
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              fontFamily="monospace"
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
