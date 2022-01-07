import { FunctionComponent, useEffect } from 'react';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { LocaleKey } from '../store/system/SystemStore.Types';
import { getLocaleJson } from '../store/system/SystemService';
import { useSystemStore } from '../store/system/SystemStore';
import { localStorage } from '../utils/LocalStorage';
import { Locale } from './Locale';

export const LocaleProvider: FunctionComponent = () => {
    const [, { setSystemLoading }] = useSystemStore();

    useEffect(() => {
        i18n.languages = [Locale.EN, Locale.EN, Locale.ZH];

        i18n.use(initReactI18next)
            .use(HttpApi)
            .init(
                {
                    compatibilityJSON: 'v3',
                    fallbackLng: Locale.EN,
                    lng: Locale.EN,
                    ns: ['common'],
                    defaultNS: 'common',
                    react: {
                        useSuspense: false,
                    },
                    backend: {
                        allowMultiLoading: true,
                        loadPath: '/locale/{{ns}}/{{lng}}',
                        request: async (_, url, __, callback) => {
                            try {
                                const { data, status } = await getLocaleJson(url);

                                callback(null, { data, status });
                                setSystemLoading(false);
                            } catch (err: any) {
                                console.log(err);
                            }
                        },
                        requestOptions: {
                            cache: 'default',
                        },
                    },
                },
                async () => {
                    const value = await localStorage.getItem(LocaleKey);
                    i18n.changeLanguage(value || Locale.EN);
                },
            );
    }, []); // eslint-disable-line

    return <></>;
};
