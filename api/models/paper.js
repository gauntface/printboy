import path from 'path';
import {readFile, writeFile} from 'node:fs/promises';
import {getConfigDir} from './config.js';
import { exists } from '../utils/files.js';

const PAPER_DIR = 'paper-size';

const PAPER_SIZES = {
	30252: {
		id: 30252,
		name: '30252 Address: 1-1/8" x 3"',
		widthInInches: 3,
		heightInInches: 1.125,
	},
	30364: {
		id: 30364,
		name: '30364 Name Badge: 2-1/4" x 4"',
		widthInInches: 4,
		heightInInches: 2.25,
	},
};

export async function getAllPaperSizes() {
	const copy = structuredClone(PAPER_SIZES);
	const current = await getCurrentPaperSize();
	copy[current.id].current = true;
	return Array.from(Object.values(copy));
}

export async function saveCurrentPaperSize(paperID) {
	if (!PAPER_SIZES[paperID]) {
		throw new Error(`Invalid paper ID: '${paperID}'`);
	}

	const addressesPath = await getConfigDir(PAPER_DIR);
	const filepath = path.join(addressesPath, 'current.json');
	await writeFile(filepath, JSON.stringify({id: paperID}));
}

export async function getCurrentPaperSize() {
	const addressesPath = await getConfigDir(PAPER_DIR);
	const filepath = path.join(addressesPath, 'current.json');

	if (await exists(filepath)) {
		const current = JSON.parse((await readFile(filepath)).toString());
		if (PAPER_SIZES[current.id]) {
			return PAPER_SIZES[current.id];
		}
	}

	return PAPER_SIZES[30252];
}
