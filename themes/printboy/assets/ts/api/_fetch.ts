import { logger } from "@gauntface/logger";
import {apiDomain} from '../config';

async function _fetch(path, opts) {
  const resp = await fetch(`${apiDomain}${path}`, opts);
  if (resp.status !== 200) {
    logger.error(`API call was unccessful`, resp);
    throw new Error(`API call was unsuccessful: ${resp.statusText}`);
  }
  return resp.json();
}

export {_fetch as fetch};
