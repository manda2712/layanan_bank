const prisma = require("../db");

async function createUser(user) {
    try {
        const newUser = await prisma.user.create({ data: user });
        return newUser;
    } catch (error) {
        console.error("Error saat membuat user:", error);
        throw new Error("Failed to Create User");
    }
}

async function findUserAuth(email) {
    return await prisma.user.findFirst({
        where: { email }
    });
}
module.exports = { createUser, findUserAuth };
