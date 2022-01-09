import { FunctionComponent } from 'react';

import { Text, Center, Flex, IconButton } from '@chakra-ui/react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';

import { BottomSheet } from 'shared/bottom-sheet/BottomSheet';
import { useSystemStore } from 'store/system/SystemStore';
import { Route } from 'store/data/DataStore.Types';

interface Props {
    data: Route;
}

export const Inspector: FunctionComponent<Props> = ({ data: { route, name, color } }) => {
    const [{ inspectorOpen }, { closeInspector }] = useSystemStore();

    return (
        <BottomSheet.Wrapper isOpen={inspectorOpen} onClose={closeInspector} zIndex={1600}>
            <BottomSheet.Body />
            <BottomSheet.Footer>
                <Flex alignItems="center" overflow="hidden" w="100%">
                    <Center h="40px" w="40px" bg={color} borderRadius="md">
                        <Text color="white" fontWeight="bold">
                            {route}
                        </Text>
                    </Center>
                    <Text px="4" isTruncated fontWeight={500}>
                        {name}
                    </Text>
                </Flex>
                <Flex>
                    <IconButton aria-label="favorite" icon={<BsHeartFill />} />
                    <IconButton aria-label="close" ml="4" icon={<FiChevronDown />} onClick={closeInspector} />
                </Flex>
            </BottomSheet.Footer>
        </BottomSheet.Wrapper>
    );
};
