import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
} from "@chakra-ui/react";

export default function AddSongModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  handleInputChange,
  handleAddSong,
  handleUpdateSong,
  handleOpenFullScreenLyrics,
  isSubmitting,
  singers,
  isFullScreenOpen,
  onFullScreenClose,
}) {
  return (
    <>
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
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              bg="white"
              color="black"
              border="1px solid black"
              _hover={{ bg: "black", color: "white" }}
              onClick={isEditing ? handleUpdateSong : handleAddSong}
              isLoading={isSubmitting}
              loadingText={isEditing ? "Updating..." : "Adding..."}
            >
              {isEditing ? "Update Song" : "Add Song"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Full Screen Lyrics Modal (Scrollable Textarea) */}
      <Modal isOpen={isFullScreenOpen} onClose={onFullScreenClose} size="full">
        <ModalOverlay />
        <ModalContent h="100vh">
          <ModalHeader>Lyrics & Chords - Full Screen</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            <Textarea
              fontFamily="monospace"
              value={formData.lyricsAndChords}
              onChange={handleInputChange}
              name="lyricsAndChords"
              height="80vh"
              resize="vertical"
              overflowY="auto"
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
    </>
  );
}
