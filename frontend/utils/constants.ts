// const BACKEND_GRAPHQL_API = "https://a630-188-92-16-24.ngrok-free.app";
const BACKEND_GRAPHQL_API = "http://167.99.251.219";
const __isProd__ = true;
export const GRAPHQL_API_URL = __isProd__
    ? BACKEND_GRAPHQL_API
    : "http://192.168.118.132:4000";
