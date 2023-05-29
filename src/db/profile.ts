import { and, eq } from "drizzle-orm";
import { db } from "."
import { followers, users } from "./schema"
import { getUserIdFromUsername } from "./user";

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

    let searcherUserId: string = (await getUserIdFromUsername(searcherUsername))!;
    let targetUserId: string = (await getUserIdFromUsername(targetUsername))!;

    let followingRows = await db.select({
    })
        .from(followers)
        .where(and(
            eq(followers.follower_id, searcherUserId),
            eq(followers.followed_id, targetUserId)
        ));
    let following = followingRows.length > 0;

    return { following: following, ...user }
}

export async function followUser(username: string, targetUsername: string) {
    let searcherUserId: string | null = (await getUserIdFromUsername(username));
    if (searcherUserId === null) {
        return null;
    }
    let targetUserId: string | null = (await getUserIdFromUsername(targetUsername))!;
    if (targetUserId === null) {
        return null;
    }

    await db
        .insert(followers)
        .values({
            follower_id: searcherUserId!,
            followed_id: targetUserId!
        })
        .onConflictDoNothing();

    return getProfile(username, targetUsername);
}

export async function unfollowUser(username: string, targetUsername: string): Promise<Profile | null> {
    let searcherUserId: string | null = (await getUserIdFromUsername(username));
    if (searcherUserId === null) {
        return null;
    }
    let targetUserId: string | null = (await getUserIdFromUsername(targetUsername))!;
    if (targetUserId === null) {
        return null;
    }

    await db
        .delete(followers)
        .where(and(
            eq(followers.follower_id, searcherUserId),
            eq(followers.followed_id, targetUserId)
        ));

    return getProfile(username, targetUsername);
}
