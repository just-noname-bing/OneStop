const BACKEND_GRAPHQL_API = "https://2069-188-92-16-24.ngrok-free.app";
const __isProd__ = false;
export const GRAPHQL_API_URL = __isProd__
    ? BACKEND_GRAPHQL_API
    : "http://192.168.118.132:4000";
