import { FunctionComponent, useEffect } from 'react';

import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { getLocaleJson } from '../store/Service';
import { useStore } from '../store/Store';

export enum Locale {
    EN = 'en',
    ES = 'es',
    ZH = 'zh',
}

export const LocaleLabels = {
    [Locale.EN]: 'ENGLISH',
    [Locale.ES]: 'ESPANOL',
    [Locale.ZH]: 'CHINESE',
};

export const LocaleProvider: FunctionComponent = () => {
    const [] = useStore();
    
    useEffect(() => {
        i18n.languages = [Locale.EN, Locale.EN, Locale.ZH];

        i18n.use(initReactI18next)
            .use(HttpApi)
            .init({
                fallbackLng: Locale.EN,
                lng: Locale.EN,
                ns: ['translations'],
                defaultNS: 'translations',
                react: {
                    useSuspense: false,
                },
                backend: {
                    allowMultiLoading: true,
                    loadPath: '/locale/{{lng}}',
                    request: async (_, url, __, callback) => {
                        try {
                            const { data, status } = await getLocaleJson(url);
                            callback(null, { data, status });
                        } catch (err: any) {
                            console.log(err.response);
                        }
                    },
                    requestOptions: {
                        cache: 'default',
                    },
                },
            });
    }, []);
    return <></>;
};
