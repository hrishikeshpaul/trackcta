import { FunctionComponent, useEffect } from 'react';

import { useToast } from 'native-base';
import { useTranslation } from 'react-i18next';

import { useDataStore } from '../store/data/DataStore';
import { socket } from './Socket';

export const SocketProvider: FunctionComponent = () => {
    const { t } = useTranslation();
    const [, { setVehicles, removeAllRoutes }] = useDataStore();
    const toast = useToast();

    useEffect(() => {
        if (socket) {
            socket.on('error', () => {
                toast.closeAll();
                toast.show({
                    description: t('GENERIC_ERROR'),
                    status: 'error',
                });
            });

            socket.on('disconnect', () => {
                toast.closeAll();
                toast.show({
                    description: t('SERVER_DISCONNECT'),
                    status: 'error',
                });
                removeAllRoutes();
            });

            socket.on('connect', () => {
                toast.closeAll();
                console.log('connected');
                toast.show({
                    description: t('SERVER_CONNECT'),
                    status: 'success',
                });
            });

            socket.on('update-vehicles', setVehicles);

            socket.on('server-error', () => {
                toast.closeAll();
                toast.show({
                    description: t('SERVER_ERROR'),
                    status: 'error',
                });
                removeAllRoutes();
            });
        }
    }, [socket]); // eslint-disable-line

    return <></>;
};
