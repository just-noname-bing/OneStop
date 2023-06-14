import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { GRAPHQL_API_URL } from "./constants";

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

export async function TokensLogout() {
    try {
        await deleteItemAsync(TOKENS.access);
        await deleteItemAsync(TOKENS.refresh);
    } catch (err) {
        console.log(err);
    }
}

export async function fetchNewTokens() {
    // const a = await getAccessToken();
    try {
        const r = await getRefreshToken();
        const response = await fetch(GRAPHQL_API_URL + "/refresh_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: r }),
        });

        if (!response.ok) {
            await TokensLogout();
            console.log("DELETE TOKENS");
            return null;
        }

        const tokens = await response.json();
        // console.log(tokens)
        const a = await setAccessToken(tokens.accessToken);
        await setRefreshToken(tokens.refreshToken);

        return a;
    } catch (err) {
        console.log(err);
    }
}

export function useAuth() {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [ac, setAc] = useState<string | null>(null);
    const [rf, setRf] = useState<string | null>(null);
    useEffect(() => {
        (async () => {
            const t = await getAccessToken()
            const tt = await getAccessToken()
            setAuth(!!t);
            setAc(t);
            setRf(tt);
            setLoading(false);
        })()
    }, []);

    return { auth, loading, ac, rf };
}

