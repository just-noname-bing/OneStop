import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";

export enum TOKENS {
    access = "jiaz",
    refresh = "zzjiaz",
}

export async function getAccessToken() {
    return await getItemAsync(TOKENS.access);
}

export async function getRefreshToken() {
    return await getItemAsync(TOKENS.refresh);
}

export async function setAccessToken(accessToken: string) {
    return await setItemAsync(TOKENS.access, accessToken);
}

export async function setRefreshToken(refreshToken: string) {
    return await setItemAsync(TOKENS.refresh, refreshToken);
}

export async function TokensLogout(){ 
    await deleteItemAsync(TOKENS.access)
    await deleteItemAsync(TOKENS.refresh)
}
