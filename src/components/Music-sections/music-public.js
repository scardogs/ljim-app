import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { generateSongPDF } from "../../utils/pdfGenerator";

export default function MusicPublic() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const bgGradient = useColorModeValue(
    "linear(to-b, gray.100, white)",
    "linear(to-b, gray.900, gray.800)"
  );
  const sectionBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const accent = useColorModeValue("gray.700", "gray.400");
  const lyricsBg = useColorModeValue("gray.50", "gray.700");

  const fetchMusic = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
      setFilteredSongs(data);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setSongs([]);
      setFilteredSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic();
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

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={16} position="relative">
      {/* Decorative lines in background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        backgroundSize="40px 40px"
        backgroundImage="
          linear-gradient(to right, gray 1px, transparent 1px),
          linear-gradient(to bottom, gray 1px, transparent 1px)"
        opacity={0.2}
        zIndex={0}
      />

      <VStack
        spacing={10}
        maxW="5xl"
        mx="auto"
        px={4}
        position="relative"
        zIndex={1}
      >
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
            Browse our song collection
          </Text>
        </Box>

        {/* Search and Songs */}
        <Box bg={sectionBg} p={6} borderRadius="2xl" shadow="md" w="100%">
          <Heading size="md" color={textColor} fontFamily="monospace" mb={4}>
            Our Songs
          </Heading>

          <Input
            placeholder="Search by song, artist, album, genre, singer, or date..."
            mb={4}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={useColorModeValue("gray.50", "gray.700")}
            fontFamily="monospace"
            size="lg"
          />

          {loading ? (
            <VStack spacing={4} py={10}>
              <Spinner size="xl" color={accent} />
              <Text color={subTextColor}>Loading songs...</Text>
            </VStack>
          ) : (
            <Accordion allowToggle>
              {filteredSongs.length === 0 && (
                <Text color={subTextColor} mt={4} textAlign="center">
                  {searchQuery
                    ? "No songs found matching your search."
                    : "No songs available yet."}
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
                          ? new Date(song.dateTime).toLocaleString("en-US", {
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
                    <HStack spacing={2} mr={2}>
                      <IconButton
                        icon={<DownloadIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          generateSongPDF(song);
                        }}
                        aria-label="Download PDF"
                        title="Download as PDF"
                      />
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontFamily="monospace" color={subTextColor}>
                        <strong>Artist:</strong> {song.artist}
                      </Text>
                      {song.album && (
                        <Text fontFamily="monospace" color={subTextColor}>
                          <strong>Album:</strong> {song.album}
                        </Text>
                      )}
                      {song.genre && (
                        <Text fontFamily="monospace" color={subTextColor}>
                          <strong>Genre:</strong> {song.genre}
                        </Text>
                      )}
                      {song.SingerFname && (
                        <Text fontFamily="monospace" color={subTextColor}>
                          <strong>Singer:</strong> {song.SingerFname}
                        </Text>
                      )}
                      {song.lyricsAndChords && (
                        <Box mt={3} w="full">
                          <Text
                            fontFamily="monospace"
                            color={textColor}
                            fontWeight="bold"
                            mb={2}
                          >
                            Lyrics & Chords:
                          </Text>
                          <Text
                            fontFamily="monospace"
                            color={subTextColor}
                            whiteSpace="pre-wrap"
                            fontSize="sm"
                            bg={lyricsBg}
                            p={3}
                            borderRadius="md"
                          >
                            {song.lyricsAndChords}
                          </Text>
                        </Box>
                      )}
                      {song.notes && (
                        <Box mt={2} w="full">
                          <Text
                            fontFamily="monospace"
                            color={textColor}
                            fontWeight="bold"
                            mb={1}
                          >
                            Notes:
                          </Text>
                          <Text
                            color={subTextColor}
                            whiteSpace="pre-wrap"
                            fontSize="sm"
                          >
                            {song.notes}
                          </Text>
                        </Box>
                      )}
                      {song.url && (
                        <Text fontFamily="monospace" color={textColor} mt={2}>
                          <a
                            href={song.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "underline" }}
                          >
                            🎵 Listen to this song
                          </a>
                        </Text>
                      )}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
