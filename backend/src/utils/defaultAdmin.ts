import { hash } from "bcrypt";
import { DEFAULT_ADMIN_CREDS, prisma } from "./constants"
import { PASSWORD_SALT_ROUNDS } from "./constants";

// function will check if is there a admin in database and if not it will create one

async function defaultAdmin() {
    const is_admin_exists = await prisma.user.findFirst({ where: { role: "ADMIN" } })
    if (is_admin_exists) return;

    // set admin createntials to random or add them to .env
    await prisma.user.create({
        data: {
            name: "admin@admin.com",
            surname: "admin@admin.com",
            email: DEFAULT_ADMIN_CREDS.email,
            verified: true,
            password: await hash(DEFAULT_ADMIN_CREDS.password, PASSWORD_SALT_ROUNDS),
            role: "ADMIN"
        }
    })
}

export default defaultAdmin
