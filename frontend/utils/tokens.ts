import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import jwt_decode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { withDecay } from "react-native-reanimated";
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

        console.log("fetching new tokens --- -")

        // console.log(response)
        const tokens = await response.json();
        console.log(tokens)
        const a = tokens.accessToken;
        await setAccessToken(a);
        await setRefreshToken(tokens.refreshToken);

        return a;
    } catch (err) {
        console.log(err);
        console.log("BOMBA");
    }
}

type payload = { exp: number, role: "ADMIN" | "MODERATOR" | "DEFAULT" }
export function useAuth() {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [payload, setPayload] = useState<payload | null>(null);
    const [ac, setAc] = useState<string | null>(null);
    const [rf, setRf] = useState<string | null>(null);
    useEffect(() => {
        (async () => {
            const t = await getAccessToken();
            const tt = await getRefreshToken();
            try {
                const decodedTT: payload = jwt_decode(tt ?? "");

                const isExpired = decodedTT.exp < new Date().getTime() / 1000;

                if (isExpired) {
                    setAuth(false);
                } else {
                    setAuth(true);
                    setAc(t);
                    setRf(tt);
                    setPayload(decodedTT);
                }
            } catch {
                setAuth(false);
            }

            setLoading(false);
        })();
    }, []);

    return { auth, loading, ac, rf, payload };
}
