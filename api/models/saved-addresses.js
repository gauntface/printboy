import path from 'path';
import {writeFile, readdir, readFile, rm} from 'node:fs/promises';
import {pathForLabelSettings} from './constants.js';
import {hashForValue} from '../utils/files.js';

const ADDRESS_DIR = 'addresses';

export async function getPresetAddresses() {
	const addressesPath = await pathForLabelSettings(ADDRESS_DIR);
	const values = [];
	const files = await readdir(addressesPath);
	for (const filename of files) {
		const filepath = path.join(addressesPath, filename);
		values.push({
			filename,
			text: (await readFile(filepath)).toString(),
		});
	}
	return values
}

export async function addAddress(newAddr) {
    const p = await pathForLabelSettings(ADDRESS_DIR);
    const filename = `${hashForValue(newAddr)}.txt`;
    await writeFile(path.join(p, filename), newAddr);
}

export async function deletePresetAddress(filename) {
	const p = await pathForLabelSettings(ADDRESS_DIR);
	await rm(path.join(p, filename));
}