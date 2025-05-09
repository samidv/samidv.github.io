async function handler({ targetUsername }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const userId = session.user.id;

  const targetUser = await sql`
    SELECT id FROM users WHERE username = ${targetUsername}
  `;

  if (!targetUser.length) {
    return { error: "User not found" };
  }

  const targetUserId = targetUser[0].id;

  if (targetUserId === userId) {
    return { error: "Cannot send friend request to yourself" };
  }

  const existingFriendship = await sql`
    SELECT status FROM friendships 
    WHERE (user_id1 = ${userId} AND user_id2 = ${targetUserId})
    OR (user_id1 = ${targetUserId} AND user_id2 = ${userId})
  `;

  if (existingFriendship.length) {
    return {
      error: "Friendship already exists",
      status: existingFriendship[0].status,
    };
  }

  await sql`
    INSERT INTO friendships (user_id1, user_id2, status)
    VALUES (${userId}, ${targetUserId}, 'pending')
  `;

  return { status: "pending" };
}
export async function POST(request) {
  return handler(await request.json());
}