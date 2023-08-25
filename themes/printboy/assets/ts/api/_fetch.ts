import { logger } from "@gauntface/logger";
import {apiDomain} from '../config';

async function _fetch(path, opts) {
  const resp = await fetch(`${apiDomain}${path}`, opts);
  if (resp.status !== 200) {
    logger.error(`API call was unccessful`, resp);
    let text;
    let json;
    try {
      text = await resp.text();
      json = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // NOOP - this is just best effort
    }
    throw new Error(`API call was unsuccessful: (${resp.status}) ${resp.statusText} - ${json || text}`);
  }
  return resp.json();
}

export {_fetch as fetch};
