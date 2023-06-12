const BACKEND_GRAPHQL_API = "http://167.99.251.219:80";
const __isProd__ = false;
export const GRAPHQL_API_URL = __isProd__
    ? BACKEND_GRAPHQL_API
    : "http://192.168.118.132:4000";
