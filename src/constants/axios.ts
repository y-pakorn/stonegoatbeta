import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

// @ts-expect-error
export const axios = Axios.defaults.cache ? Axios : setupCache(Axios);
