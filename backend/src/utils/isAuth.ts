import { Roles } from "@prisma/client"
import { verify } from "jsonwebtoken"
import { accessToken_secret, prisma } from "./constants"
import { TokenPayload } from "./TokenService"

const IsAuth = (r: any, roles: Roles[]) => {
    return async (p: any, arg: any, ctx: any, i: any) => {
        //verify role and tokens
        //if not valid throw 401
        let tokenPayload;
        try {
            tokenPayload = verify(ctx.auth.split(" ")[1], accessToken_secret) as TokenPayload
        } catch (error) {
            // invalid signature
            throw new Error("not authenticated");
        }

        // if authorized
        if (roles.length && !roles.includes(tokenPayload.role)) {
            throw new Error("not authorized");
        }

        const user = await prisma.user.findFirst({
            where: {
                id: tokenPayload.userId,
                role: tokenPayload.role,
            }
        })

        if (!user) {
            throw new Error("not authorized");
        }

        const { password, ...ctxUser } = user

        ctx.user = ctxUser

        // role match and user exist and also accessToken is valid
        return r(p, arg, ctx, i)
    }
}

export default IsAuth
