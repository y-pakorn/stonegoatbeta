import { BetaInfo } from "@/interfaces/beta";
import {
  AspectRatio,
  HStack,
  Icon,
  IconButton,
  Link,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { FaArrowUpRightFromSquare, FaXmark } from "react-icons/fa6";
import ReactPlayer from "react-player";

export const PlayerModal = ({
  isOpen,
  onClose,
  beta,
}: {
  isOpen: boolean;
  onClose: () => void;
  beta: BetaInfo | null;
}) => {
  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="transparent" m={4}>
        <HStack pos="absolute" top={4} right={4} zIndex={1}>
          <IconButton
            icon={<Icon as={FaArrowUpRightFromSquare} />}
            aria-label="Open Instagram"
            rounded="xl"
            colorScheme="whiteAlpha"
            as={Link}
            href={beta?.permalink}
            isExternal
          />
          <IconButton
            icon={<Icon as={FaXmark} />}
            aria-label="Close"
            rounded="xl"
            colorScheme="whiteAlpha"
            onClick={onClose}
          />
        </HStack>
        <AspectRatio ratio={9 / 16}>
          <ReactPlayer
            style={{
              borderRadius: "24px",
            }}
            controls
            muted
            playing
            loop
            url={beta?.media_url}
            width="100%"
            height="100%"
          />
        </AspectRatio>
      </ModalContent>
    </Modal>
  );
};
