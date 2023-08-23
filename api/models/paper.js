import path from 'path';
import {writeFile, readdir, readFile, mkdir} from 'node:fs/promises';
import {pathForLabelSettings} from './constants.js';

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
	const papers = Array.from(Object.values(PAPER_SIZES));
	const current = await getCurrentPaperSize();
	for (let i = 0; i < papers.length; i++) {
		papers[i].current = (papers[i].id == current.id);
	}
	return papers;
}

export async function setCurrentPaperSize(paperID) {
	if (!PAPER_SIZES[paperID]) {
		throw new Error(`Invalid paper ID '${paperID}'`);
	}

	const addressesPath = await pathForLabelSettings(PAPER_DIR);
	const filepath = path.join(addressesPath, 'current.json');
	await mkdir(path.dirname(filepath), {recursive: true});
	await writeFile(filepath, JSON.stringify({id: paperID}));
}

export async function getCurrentPaperSize() {
	const addressesPath = await pathForLabelSettings(PAPER_DIR);
	try {
		const filepath = path.join(addressesPath, 'current.json');
		const current = JSON.parse((await readFile(filepath)).toString());
		if (PAPER_SIZES[current.id]) {
			return PAPER_SIZES[current.id];
		}
	} catch (err) {
		console.warn('Failed to get current paper size: ', err);
	}
	return PAPER_SIZES[30252];
}
