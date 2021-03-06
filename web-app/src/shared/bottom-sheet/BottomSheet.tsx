import { FunctionComponent, ReactElement } from 'react';

import {
    useColorModeValue,
    Container,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
} from '@chakra-ui/react';

const BottomSheetHeader: FunctionComponent = ({ children }) => {
    return (
        <DrawerHeader px="4" pb="2">
            {children}
        </DrawerHeader>
    );
};

const BottomSheetBody: FunctionComponent = ({ children }) => {
    return (
        <DrawerBody px="0" pt="0">
            {children}
        </DrawerBody>
    );
};

const BottomSheetFooter: FunctionComponent = ({ children }) => {
    return <DrawerFooter px="4">{children}</DrawerFooter>;
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    zIndex: number;
    children?:
        | ReactElement<typeof BottomSheetHeader | typeof BottomSheetBody | typeof BottomSheetFooter>
        | Array<ReactElement<typeof BottomSheetHeader | typeof BottomSheetBody | typeof BottomSheetFooter>>;
}

const BottomSheetWrapper: FunctionComponent<Props> = ({ isOpen, onClose, children }) => {
    const bg = useColorModeValue('white', 'gray.700');

    return (
        <Drawer isOpen={isOpen} placement="bottom" size="sm" onClose={onClose} autoFocus={false} closeOnOverlayClick>
            <DrawerOverlay onClick={onClose} />
            <DrawerContent bg="transparent">
                <Container
                    bg={bg}
                    borderTopRightRadius="2xl"
                    borderTopLeftRadius="2xl"
                    boxShadow="2xl"
                    maxW="container.sm"
                    px={{ base: '0', md: '2' }}
                >
                    {children}
                </Container>
            </DrawerContent>
        </Drawer>
    );
};

export const BottomSheet = {
    Wrapper: BottomSheetWrapper,
    Header: BottomSheetHeader,
    Body: BottomSheetBody,
    Footer: BottomSheetFooter,
};
