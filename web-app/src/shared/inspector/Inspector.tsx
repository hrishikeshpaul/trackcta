import { FunctionComponent, useState, useEffect } from 'react';

import { Text, Center, Flex, IconButton } from '@chakra-ui/react';

import { BottomSheet } from 'shared/bottom-sheet/BottomSheet';
import { useSystemStore } from 'store/system/SystemStore';
import { Route } from 'store/data/DataStore.Types';
import { useDataStore } from 'store/data/DataStore';
import { DownIcon, HeartFillIcon, HeartIcon } from 'utils/Icons';

interface Props {
    data: Route;
}

export const Inspector: FunctionComponent<Props> = ({ data: { route, name, color } }) => {
    const [{ favoriteRoutes }, { saveRoute, unSaveRoute }] = useDataStore();
    const [{ inspectorOpen }, { closeInspector }] = useSystemStore();
    const [isFav, setIsFav] = useState<boolean>(false);

    useEffect(() => {
        if (favoriteRoutes[route]) {
            setIsFav(true);
        } else {
            setIsFav(false);
        }
    }, [inspectorOpen, favoriteRoutes]); // eslint-disable-line

    const onFavHandle = () => {
        if (favoriteRoutes[route]) {
            unSaveRoute(route);
        } else {
            saveRoute({ route, name, color });
        }
    };

    return (
        <BottomSheet.Wrapper isOpen={inspectorOpen} onClose={closeInspector} zIndex={1600}>
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
                    <IconButton
                        aria-label="favorite"
                        fontSize="lg"
                        icon={isFav ? <HeartFillIcon /> : <HeartIcon />}
                        onClick={onFavHandle}
                    />
                    <IconButton fontSize="xl" aria-label="close" ml="4" icon={<DownIcon />} onClick={closeInspector} />
                </Flex>
            </BottomSheet.Footer>
        </BottomSheet.Wrapper>
    );
};