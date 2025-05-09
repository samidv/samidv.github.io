async function handler({ action, data }) {
  const session = getSession();
  if (!session?.user?.id) return { error: "Unauthorized" };

  switch (action) {
    case "updateProfile": {
      const { bio, status, theme, customStatus } = data;
      const result = await sql`
        UPDATE users 
        SET bio = ${bio}, 
            status = ${status}, 
            custom_status = ${customStatus},
            theme_preference = ${theme}
        WHERE id = ${session.user.id}
        RETURNING *`;
      return { user: result[0] };
    }

    case "uploadImage": {
      const { type, base64 } = data;
      const { url, error } = await upload({ base64 });
      if (error) return { error };

      const field = type === "profile" ? "profile_picture_url" : "banner_url";
      const query = `UPDATE users SET ${field} = $1 WHERE id = $2 RETURNING *`;
      const result = await sql(query, [url, session.user.id]);
      return { user: result[0] };
    }

    case "generateApiKey": {
      const user = await sql`
        SELECT * FROM users WHERE id = ${session.user.id}`;

      if (
        user[0].api_key_count >=
        (user[0].is_owner ? 20 : user[0].is_first_ten ? 5 : 3)
      ) {
        return { error: "API key limit reached" };
      }

      const keyHash = crypto.randomUUID();
      await sql.transaction([
        sql`INSERT INTO api_keys (user_id, key_hash) VALUES (${session.user.id}, ${keyHash})`,
        sql`UPDATE users SET api_key_count = api_key_count + 1 WHERE id = ${session.user.id}`,
      ]);
      return { key: keyHash };
    }

    case "deleteApiKey": {
      const { keyHash } = data;
      await sql.transaction([
        sql`DELETE FROM api_keys WHERE key_hash = ${keyHash} AND user_id = ${session.user.id}`,
        sql`UPDATE users SET api_key_count = api_key_count - 1 WHERE id = ${session.user.id}`,
      ]);
      return { success: true };
    }

    case "disableAccount": {
      await sql`
        UPDATE users 
        SET is_disabled = true,
            status = 'offline'
        WHERE id = ${session.user.id}`;
      return { success: true };
    }

    case "deleteAccount": {
      await sql`DELETE FROM users WHERE id = ${session.user.id}`;
      return { success: true };
    }

    case "checkUserStatus": {
      const result = await sql`
        SELECT is_owner, is_first_ten, birth_date 
        FROM users 
        WHERE id = ${session.user.id}`;
      return {
        isOwner: result[0].is_owner,
        isFirstTen: result[0].is_first_ten,
        birthDate: result[0].birth_date,
      };
    }

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}