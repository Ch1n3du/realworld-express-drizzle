
// import { PrismaClient } from "@prisma/client";
// export interface User {
//     username: string,
//     email: string,
//     token: string,
//     bio: string
//     image: string | null,
// }

// type UserResponse = { user: User };

// export function createUserResponse(args: User): UserResponse {
//     return { user: args }
// }

// export const SelectUser = {
//     username: true,
//     email: true,
//     bio: true,
//     image: true
// }

// export const SelectUserWithPassword = { password: true, ...SelectUser }

// export async function createUser(
//     prisma: PrismaClient,
//     username: string,
//     email: string,
//     password: Buffer,
//     token: string
// ): Promise<User> {
//     const user = await prisma.user
//         .create({ data: { username, email, password }, select: SelectUser })

//     let userResponse: User = {
//         username: user.username,
//         email: user.email,
//         token: token,
//         bio: user.bio || "",
//         image: user.image
//     }

//     return userResponse
// }

