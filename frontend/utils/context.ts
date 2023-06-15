import { createContext, Dispatch, SetStateAction } from "react";

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

// export const TokenContext = createContext<
//     [Tokens | null, Dispatch<SetStateAction<Tokens | null>>]
// >([] as any);
//
export const ShowAdminMenuContext = createContext<any>(null);
