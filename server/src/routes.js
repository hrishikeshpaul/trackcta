'use strict';

import express from 'express';
import fs from 'fs';
import Fuse from 'fuse.js';

import { getPatterns, getRoutes, getPredictions, getGitHubWorkflow, getLocaleJson, getLatestVersion } from './util.js';

const convertTimestamp = (timestamp) => {
    const [date, time] = timestamp.split(' ');
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${time}`;
};

const checkStatus = (status) => {
    if (status.conclusion && status.status === 'completed') {
        if (status.conclusion === 'failure') {
            return 'failure';
        } else if (status.conclusion === 'success') {
            return 'success';
        }
    }
    return 'in_progress';
};

const paginate = (array, limit, index) => {
    return array.slice((index - 1) * limit, index * limit);
};

const router = express.Router();

router.get('/routes', async (req, res) => {
    try {
        const { search, filter, limit, index } = req.query;

        let data = await getRoutes();

        data = data.map((item) => ({
            route: item.rt,
            name: item.rtnm,
            color: item.rtclr,
        }));

        if (filter) {
            const filterRoutes = filter.split(',');

            filterRoutes.forEach((route) => {
                data = data.filter((d) => d.route !== route);
            });
        }

        if (search) {
            const fuse = new Fuse(data, { keys: ['route', 'name'] });
            const searchedRoutes = fuse.search(search);

            data = searchedRoutes.map((f) => f.item);
        }

        const paginatedResponses = paginate(data, limit || 10, index || 1);

        res.send(paginatedResponses);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/patterns', async (req, res) => {
    const { route, color } = req.query;
    try {
        const patterns = [];

        const data = await getPatterns(route);

        data.forEach((item) => {
            const paths = [];
            const stops = [];

            item.pt.forEach((p) => {
                if (p.typ === 'W') {
                    paths.push({ lat: p.lat, lng: p.lon });
                } else if (p.typ === 'S') {
                    stops.push({
                        lat: p.lat,
                        lng: p.lon,
                        name: p.stpnm,
                        id: p.stpid,
                        route,
                    });
                }
            });

            patterns.push({
                fillColor: color,
                strokeColor: color,
                dir: item.dir,
                pid: item.pid,
                route,
                paths,
                stops,
            });
        });

        res.send(patterns);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/predictions', async (req, res) => {
    try {
        let data = await getPredictions(req.query.stop);

        data = data.map((item) => {
            const predTime = convertTimestamp(item.prdtm);
            const reqTime = convertTimestamp(item.tmstmp);
            const diff = Math.round((new Date(predTime) - new Date(reqTime)) / 60000);

            return {
                type: item.typ,
                name: item.stpnm,
                stopId: item.stpid,
                id: item.vid,
                route: item.rt,
                direction: item.rtdir,
                time: diff,
                timestamp: new Date(predTime).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }),
                delayed: item.dly,
            };
        });

        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/app-status', async (_, res) => {
    try {
        const data = await getGitHubWorkflow();

        const response = {
            web: checkStatus(data.web.workflow_runs[0]),
            server: checkStatus(data.server.workflow_runs[0]),
        };
        res.send(response);
    } catch (err) {
        res.status(400).send('Failed to update app status');
    }
});

router.get('/version', async (_, res) => {
    try {
        const data = await getLatestVersion();

        res.send(data);
    } catch (err) {
        res.status(400).send('Failed to get version');
    }
});

router.get('/locale/:ns/:lng', async (req, res) => {
    const { ns, lng } = req.params;

    try {
        const { data } = await getLocaleJson(lng);

        res.send(data).status(200);
    } catch (err) {
        res.send(fs.readFileSync('src/res/en.json')).status(200);
    }
});

export default router;
