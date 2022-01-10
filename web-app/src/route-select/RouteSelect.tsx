import { FunctionComponent, useEffect, useState, ChangeEvent, UIEvent } from 'react';

import {
    Box,
    Text,
    IconButton,
    Flex,
    InputGroup,
    Input,
    InputLeftElement,
    InputRightElement,
    Spinner,
    Center,
    Button,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { HiCheck as Check } from 'react-icons/hi';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import { Inspector } from 'inspector/Inspector';
import { RouteOption, RouteExtended } from 'route-select/RouteOption';
import { BottomSheet } from 'shared/bottom-sheet/BottomSheet';
import { useDataStore } from 'store/data/DataStore';
import { Route } from 'store/data/DataStore.Types';
import { useSystemStore } from 'store/system/SystemStore';
import useDebounce from 'utils/Hook';

const LIMIT = 10;

export const RouteSelect: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes: currentRoutes, favoriteRoutes }, { getRoutes, removeAllRoutes }] = useDataStore();
    const [{ routeSelectOpen, routesLoading }, { closeRouteSelect }] = useSystemStore();
    const [mounted, setMounted] = useState<boolean>(false);
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(1);
    const [inspectorData, setInspectorData] = useState<Route>({ name: '', route: '', color: '' });
    const debouncedQuery = useDebounce(query);

    const getFilter = () => {
        return currentRoutes.map((route) => route.route).join(',');
    };

    const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
        const bottom =
            e.currentTarget.scrollHeight - Math.ceil(e.currentTarget.scrollTop) <= e.currentTarget.clientHeight;
        const filter = getFilter();

        if (bottom) {
            setIndex(index + 1);
            const response = await getRoutes(query, filter, LIMIT, index + 1);

            if (response)
                setRoutes((prevRoutes) => [...prevRoutes, ...response.map((r) => ({ ...r, selected: false }))]);
        }
    };

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

    const onOpen = async () => {
        const filter = getFilter();
        const response = await getRoutes(query, filter, LIMIT, index);
        const selectedRoutes: RouteExtended[] = currentRoutes.map((route) => ({ ...route, selected: true }));
        let unselectedRoutes: RouteExtended[] = [];

        if (response) {
            unselectedRoutes = response.map((route) => ({ ...route, selected: false }));
        }

        setRoutes([...selectedRoutes, ...unselectedRoutes]);
    };

    useEffect(() => {
        if (routeSelectOpen) {
            (async () => {
                await onOpen();
            })();
        } else {
            setQuery('');
            setIndex(1);
            closeRouteSelect();
        }
    }, [routeSelectOpen]); // eslint-disable-line

    useEffect(() => {
        if (currentRoutes.length === 0) {
            setRoutes((prevRoutes) => {
                const updatedRoutes: RouteExtended[] = [...prevRoutes];

                prevRoutes.forEach((route, i) => {
                    route.selected = false;
                });

                return updatedRoutes;
            });
        }
    }, [currentRoutes]);

    useEffect(() => {
        (async () => {
            if (debouncedQuery) {
                const filter = currentRoutes.map((route) => route.route).join(',');
                const response = await getRoutes(debouncedQuery, filter, LIMIT, index);

                if (response) {
                    setRoutes(response.map((route) => ({ ...route, selected: false })));
                }
            } else {
                if (mounted) {
                    await onOpen();
                }
            }
        })();
    }, [debouncedQuery]); // eslint-disable-line

    const RenderFavorites: FunctionComponent = () => {
        return Object.values(favoriteRoutes).length ? (
            <>
                <Text px="4" fontSize="sm" fontWeight="600" opacity="0.8" pt="2">
                    {t('FAVORITES')}
                </Text>

                {Object.values(favoriteRoutes).map((route) => (
                    <RouteOption
                        onChange={setRoutes}
                        routes={routes}
                        currentRoute={{
                            ...route,
                            selected: currentRoutes.findIndex((r) => r.route === route.route) !== -1,
                        }}
                        setInspectorData={setInspectorData}
                        key={route.route}
                    />
                ))}
            </>
        ) : (
            <></>
        );
    };

    return (
        <>
            <Inspector data={inspectorData} onGetData={onOpen} />
            <BottomSheet.Wrapper isOpen={routeSelectOpen} zIndex={1500} onClose={closeRouteSelect}>
                <BottomSheet.Header>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontSize="2xl" fontWeight="bold">
                            {t('SELECT_ROUTES')}
                        </Text>
                        <IconButton
                            variant="ghost"
                            fontSize="2xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeRouteSelect}
                            icon={<FiChevronDown />}
                        />
                    </Flex>
                    <InputGroup mt="2">
                        <InputLeftElement pointerEvents="none" children={<FiSearch color="gray.300" />} />
                        {query && (
                            <InputRightElement>
                                <IconButton
                                    variant="ghost"
                                    aria-label="clear"
                                    icon={<IoIosClose />}
                                    size="sm"
                                    fontSize="3xl"
                                    color="gray.500"
                                    onClick={() => setQuery('')}
                                />
                            </InputRightElement>
                        )}
                        <Input
                            name="query"
                            value={query}
                            placeholder={t('ROUTE_SEARCH_PLACEHOLDER')}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setQuery(e.target.value);
                            }}
                        />
                    </InputGroup>
                </BottomSheet.Header>

                <BottomSheet.Body>
                    <Box h="60vh" overflow="auto" onScroll={handleScroll} pb="4">
                        <RenderFavorites />

                        <Text px="4" fontSize="sm" fontWeight="600" opacity="0.8" pt="4">
                            {t('ALL_ROUTES')}
                        </Text>

                        {routes.map(
                            (route) =>
                                !favoriteRoutes[route.route] && (
                                    <RouteOption
                                        onChange={setRoutes}
                                        setInspectorData={setInspectorData}
                                        routes={routes}
                                        currentRoute={route}
                                        key={route.route}
                                    />
                                ),
                        )}

                        {routesLoading ? (
                            <Center>
                                <Spinner color="blue.500" />
                            </Center>
                        ) : null}
                    </Box>
                </BottomSheet.Body>
                <BottomSheet.Footer>
                    <Flex w="100%" justifyContent={currentRoutes.length ? 'space-between' : 'flex-end'}>
                        {currentRoutes.length ? (
                            <Button onClick={removeAllRoutes} variant="link">
                                {t('DESELECT_ALL')}
                            </Button>
                        ) : null}
                        <Button
                            colorScheme="blue"
                            onClick={closeRouteSelect}
                            rightIcon={
                                <Icon fontSize="18pt">
                                    <Check />
                                </Icon>
                            }
                        >
                            {t('DONE')}
                        </Button>
                    </Flex>
                </BottomSheet.Footer>
            </BottomSheet.Wrapper>
        </>
    );
};
