import {stat} from 'node:fs/promises';
import crypto from 'crypto';

export async function exists(p) {
	try {
		await stat(p);
		return true;
	} catch (e) {
		return false;
	}
}

export function hashForValue(v) {
	const shasum = crypto.createHash('sha1')
	shasum.update(v)
	return shasum.digest('hex');
}
