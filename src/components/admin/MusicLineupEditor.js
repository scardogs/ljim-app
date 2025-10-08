import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Center,
  Text,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Icon,
  IconButton,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Collapse,
  Divider,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import { FiMusic, FiUsers, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";
import { generateSongPDF } from "../../utils/pdfGenerator";

export default function MusicLineupEditor() {
  const [songs, setSongs] = useState([]);
  const [singers, setSingers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedSinger, setSelectedSinger] = useState(null);
  const [isEditingSong, setIsEditingSong] = useState(false);
  const [isEditingSinger, setIsEditingSinger] = useState(false);
  const [expandedSongs, setExpandedSongs] = useState({});
  const {
    isOpen: isSongModalOpen,
    onOpen: onSongOpen,
    onClose: onSongClose,
  } = useDisclosure();
  const {
    isOpen: isSingerModalOpen,
    onOpen: onSingerOpen,
    onClose: onSingerClose,
  } = useDisclosure();
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
  const toast = useToast();

  const toggleSongExpansion = (songId) => {
    setExpandedSongs((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");

  const fetchSongs = React.useCallback(async () => {
    try {
      const response = await fetch("/api/songs");
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast({
        title: "Error",
        description: "Failed to load songs",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const fetchSingers = React.useCallback(async () => {
    try {
      const response = await fetch("/api/singers");
      const data = await response.json();
      setSingers(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching singers:", error);
      toast({
        title: "Error",
        description: "Failed to load singers",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSongs();
    fetchSingers();
  }, [fetchSongs, fetchSingers]);

  // Song Functions
  const openCreateSongModal = () => {
    setSelectedSong({
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
    setIsEditingSong(false);
    onSongOpen();
  };

  const openEditSongModal = (song) => {
    setSelectedSong({
      ...song,
      dateTime: song.dateTime
        ? new Date(song.dateTime).toISOString().slice(0, 16)
        : "",
    });
    setIsEditingSong(true);
    onSongOpen();
  };

  const handleSaveSong = async () => {
    if (
      !selectedSong.songName ||
      !selectedSong.artist ||
      !selectedSong.dateTime
    ) {
      toast({
        title: "Validation Error",
        description: "Song name, artist, and date/time are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const method = isEditingSong ? "PUT" : "POST";
      const url = isEditingSong
        ? `/api/songs/${selectedSong._id}`
        : "/api/songs";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedSong),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Song ${
            isEditingSong ? "updated" : "created"
          } successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSongs();
        onSongClose();
      } else {
        throw new Error("Failed to save song");
      }
    } catch (error) {
      console.error("Error saving song:", error);
      toast({
        title: "Error",
        description: "Failed to save song",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/songs/${songId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Song deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSongs();
      } else {
        throw new Error("Failed to delete song");
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      toast({
        title: "Error",
        description: "Failed to delete song",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Singer Functions
  const openCreateSingerModal = () => {
    setSelectedSinger({
      Fname: "",
      Mname: "",
      Lname: "",
    });
    setIsEditingSinger(false);
    onSingerOpen();
  };

  const openEditSingerModal = (singer) => {
    setSelectedSinger({ ...singer });
    setIsEditingSinger(true);
    onSingerOpen();
  };

  const handleSaveSinger = async () => {
    if (!selectedSinger.Fname || !selectedSinger.Lname) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const method = isEditingSinger ? "PUT" : "POST";
      const url = isEditingSinger
        ? `/api/singers/${selectedSinger._id}`
        : "/api/singers";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedSinger),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Singer ${
            isEditingSinger ? "updated" : "added"
          } successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSingers();
        onSingerClose();
      } else {
        throw new Error("Failed to save singer");
      }
    } catch (error) {
      console.error("Error saving singer:", error);
      toast({
        title: "Error",
        description: "Failed to save singer",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSinger = async (singerId) => {
    if (!confirm("Are you sure you want to delete this singer?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/singers/${singerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Singer deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSingers();
      } else {
        throw new Error("Failed to delete singer");
      }
    } catch (error) {
      console.error("Error deleting singer:", error);
      toast({
        title: "Error",
        description: "Failed to delete singer",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateSongField = (field, value) => {
    setSelectedSong((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSingerField = (field, value) => {
    setSelectedSinger((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="gray.600" thickness="4px" />
          <Text color="gray.500">Loading content...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box maxW="1400px" mx="auto" pb={{ base: 20, md: 6 }}>
      <Tabs variant="soft-rounded" colorScheme="gray">
        <TabList
          mb={6}
          p={{ base: 4, md: 6 }}
          bg={headerBg}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiMusic} mr={2} />
            Songs ({songs.length})
          </Tab>
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiUsers} mr={2} />
            Singers ({singers.length})
          </Tab>
        </TabList>

        <TabPanels px={{ base: 2, md: 6 }}>
          {/* Songs Tab */}
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="lg">Song Lineup</Heading>
                <Button
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{ bg: buttonHoverBg }}
                  onClick={openCreateSongModal}
                  leftIcon={<Icon as={AddIcon} />}
                >
                  Add Song
                </Button>
              </Flex>

              {songs.length === 0 ? (
                <Card bg={cardBg} shadow="lg">
                  <CardBody p={10}>
                    <VStack spacing={4}>
                      <Icon as={FiMusic} boxSize={16} color="gray.400" />
                      <Heading size="md" color="gray.500">
                        No songs yet
                      </Heading>
                      <Text color="gray.400">
                        Click &quot;Add Song&quot; to create your first song
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {songs.map((song) => (
                    <Card
                      key={song._id}
                      bg={cardBg}
                      shadow="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <CardBody p={4}>
                        <VStack align="stretch" spacing={3}>
                          <Flex justify="space-between" align="start">
                            <VStack align="start" spacing={1} flex={1}>
                              <Heading size="sm" noOfLines={2}>
                                {song.songName}
                              </Heading>
                              <Text fontSize="xs" color="gray.500">
                                {song.artist}
                              </Text>
                            </VStack>
                            <HStack spacing={1}>
                              <IconButton
                                icon={<DownloadIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => generateSongPDF(song)}
                                aria-label="Download PDF"
                                title="Download as PDF"
                              />
                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditSongModal(song)}
                                aria-label="Edit song"
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDeleteSong(song._id)}
                                aria-label="Delete song"
                              />
                            </HStack>
                          </Flex>

                          {song.dateTime && (
                            <Badge colorScheme="teal" fontSize="xs">
                              {new Date(song.dateTime).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </Badge>
                          )}

                          {song.album && (
                            <Text fontSize="sm" color="gray.600">
                              Album: {song.album}
                            </Text>
                          )}

                          {song.genre && (
                            <Badge
                              colorScheme="purple"
                              fontSize="xs"
                              alignSelf="flex-start"
                            >
                              {song.genre}
                            </Badge>
                          )}

                          {song.SingerFname && (
                            <Text fontSize="sm" color="gray.500">
                              Singer: {song.SingerFname}
                            </Text>
                          )}

                          {song.url && (
                            <Text fontSize="xs" color="blue.500">
                              <a
                                href={song.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "underline" }}
                              >
                                🎵 Listen
                              </a>
                            </Text>
                          )}

                          {(song.lyricsAndChords || song.notes) && (
                            <>
                              <Divider />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleSongExpansion(song._id)}
                                rightIcon={
                                  expandedSongs[song._id] ? (
                                    <ChevronUpIcon />
                                  ) : (
                                    <ChevronDownIcon />
                                  )
                                }
                                width="full"
                              >
                                {expandedSongs[song._id]
                                  ? "Hide Details"
                                  : "View Lyrics & Notes"}
                              </Button>

                              <Collapse
                                in={expandedSongs[song._id]}
                                animateOpacity
                              >
                                <VStack
                                  align="stretch"
                                  spacing={3}
                                  pt={2}
                                  maxH="300px"
                                  overflowY="auto"
                                >
                                  {song.lyricsAndChords && (
                                    <Box>
                                      <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.600"
                                        mb={1}
                                      >
                                        Lyrics & Chords:
                                      </Text>
                                      <Text
                                        fontSize="xs"
                                        whiteSpace="pre-wrap"
                                        fontFamily="monospace"
                                        bg={sectionBg}
                                        p={2}
                                        borderRadius="md"
                                        color="gray.700"
                                      >
                                        {song.lyricsAndChords}
                                      </Text>
                                    </Box>
                                  )}

                                  {song.notes && (
                                    <Box>
                                      <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.600"
                                        mb={1}
                                      >
                                        Notes:
                                      </Text>
                                      <Text
                                        fontSize="xs"
                                        whiteSpace="pre-wrap"
                                        bg={sectionBg}
                                        p={2}
                                        borderRadius="md"
                                        color="gray.700"
                                      >
                                        {song.notes}
                                      </Text>
                                    </Box>
                                  )}
                                </VStack>
                              </Collapse>
                            </>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </TabPanel>

          {/* Singers Tab */}
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="lg">Singers</Heading>
                <Button
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{ bg: buttonHoverBg }}
                  onClick={openCreateSingerModal}
                  leftIcon={<Icon as={AddIcon} />}
                >
                  Add Singer
                </Button>
              </Flex>

              {singers.length === 0 ? (
                <Card bg={cardBg} shadow="lg">
                  <CardBody p={10}>
                    <VStack spacing={4}>
                      <Icon as={FiUsers} boxSize={16} color="gray.400" />
                      <Heading size="md" color="gray.500">
                        No singers yet
                      </Heading>
                      <Text color="gray.400">
                        Click &quot;Add Singer&quot; to add your first singer
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ) : (
                <Card bg={cardBg} shadow="lg">
                  <CardBody p={6}>
                    <Table variant="simple">
                      <Thead>
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
                            <Td>{singer.Mname || "-"}</Td>
                            <Td>{singer.Lname}</Td>
                            <Td>
                              <HStack spacing={2}>
                                <IconButton
                                  icon={<EditIcon />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEditSingerModal(singer)}
                                  aria-label="Edit singer"
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => handleDeleteSinger(singer._id)}
                                  aria-label="Delete singer"
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Song Modal */}
      <Modal isOpen={isSongModalOpen} onClose={onSongClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditingSong ? "Edit Song" : "Add New Song"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Song Name</FormLabel>
                <DebouncedInput
                  value={selectedSong?.songName || ""}
                  onChange={(value) => updateSongField("songName", value)}
                  placeholder="Amazing Grace"
                  size="lg"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Artist</FormLabel>
                  <DebouncedInput
                    value={selectedSong?.artist || ""}
                    onChange={(value) => updateSongField("artist", value)}
                    placeholder="Hillsong"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date & Time</FormLabel>
                  <DebouncedInput
                    type="datetime-local"
                    value={selectedSong?.dateTime || ""}
                    onChange={(value) => updateSongField("dateTime", value)}
                    size="lg"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl>
                  <FormLabel>Album</FormLabel>
                  <DebouncedInput
                    value={selectedSong?.album || ""}
                    onChange={(value) => updateSongField("album", value)}
                    placeholder="Worship Album"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Genre</FormLabel>
                  <DebouncedInput
                    value={selectedSong?.genre || ""}
                    onChange={(value) => updateSongField("genre", value)}
                    placeholder="Worship"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Singer</FormLabel>
                <Select
                  value={selectedSong?.SingerFname || ""}
                  onChange={(e) =>
                    updateSongField("SingerFname", e.target.value)
                  }
                  placeholder="Select singer"
                  size="lg"
                >
                  {singers.map((singer) => (
                    <option key={singer._id} value={singer.Fname}>
                      {singer.Fname} {singer.Mname} {singer.Lname}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>URL</FormLabel>
                <DebouncedInput
                  value={selectedSong?.url || ""}
                  onChange={(value) => updateSongField("url", value)}
                  placeholder="https://youtube.com/..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>
                  Lyrics & Chords
                  <IconButton
                    icon={
                      <Icon as={isLyricsExpanded ? FiMinimize2 : FiMaximize2} />
                    }
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
                    aria-label={isLyricsExpanded ? "Minimize" : "Expand"}
                    title={isLyricsExpanded ? "Minimize" : "Expand"}
                  />
                </FormLabel>
                <DebouncedTextarea
                  value={selectedSong?.lyricsAndChords || ""}
                  onChange={(value) =>
                    updateSongField("lyricsAndChords", value)
                  }
                  placeholder="Enter lyrics and chords..."
                  rows={isLyricsExpanded ? 30 : 6}
                  fontFamily="monospace"
                  resize="vertical"
                  overflowY="scroll"
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "gray.100",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "gray.400",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "gray.500",
                    },
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <DebouncedTextarea
                  value={selectedSong?.notes || ""}
                  onChange={(value) => updateSongField("notes", value)}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSongClose}>
              Cancel
            </Button>
            <Button
              bg={buttonBg}
              color={buttonColor}
              _hover={{ bg: buttonHoverBg }}
              onClick={handleSaveSong}
            >
              {isEditingSong ? "Update Song" : "Add Song"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Singer Modal */}
      <Modal isOpen={isSingerModalOpen} onClose={onSingerClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditingSinger ? "Edit Singer" : "Add New Singer"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <DebouncedInput
                    value={selectedSinger?.Fname || ""}
                    onChange={(value) => updateSingerField("Fname", value)}
                    placeholder="John"
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Middle Name</FormLabel>
                  <DebouncedInput
                    value={selectedSinger?.Mname || ""}
                    onChange={(value) => updateSingerField("Mname", value)}
                    placeholder="Michael"
                    size="lg"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <DebouncedInput
                  value={selectedSinger?.Lname || ""}
                  onChange={(value) => updateSingerField("Lname", value)}
                  placeholder="Doe"
                  size="lg"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSingerClose}>
              Cancel
            </Button>
            <Button
              bg={buttonBg}
              color={buttonColor}
              _hover={{ bg: buttonHoverBg }}
              onClick={handleSaveSinger}
            >
              {isEditingSinger ? "Update Singer" : "Add Singer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
