import { and, eq } from "drizzle-orm";
import { db } from "."
import { followers, users } from "./schema"

export type Profile = {
    username: string,
    bio: string | null,
    image: string | null,
    following: boolean
}

export async function getProfile(searcherUsername: string, targetUsername: string): Promise<Profile | null> {
    let userRows = await db.select({
        username: users.username,
        bio: users.bio,
        image: users.image,
    })
        .from(users)
        .where(eq(users.username, targetUsername));

    if (userRows.length === 0) {
        return null;
    }
    let user = userRows[0];

    let followingRows = await db.select({
    })
        .from(followers)
        .where(and(
            eq(followers.followerUsername, searcherUsername),
            eq(followers.followedUsername, targetUsername)
        ));
    let following = followingRows.length > 0;

    return { following: following, ...user }
}

export async function followUser(username: string, targetUsername: string) {
    await db
        .insert(followers)
        .values({ followerUsername: username, followedUsername: targetUsername })
        .onConflictDoNothing();

    return getProfile(username, targetUsername);
}

export async function unfollowUser(username: string, targetUsername: string): Promise<Profile | null> {
    await db
        .delete(followers)
        .where(and(
            eq(followers.followerUsername, username),
            eq(followers.followedUsername, targetUsername)
        ));

    return getProfile(username, targetUsername);
}
