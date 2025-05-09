async function handler({
  action,
  serverId,
  name,
  ownerId,
  members,
  channels,
  banUserId,
  kickUserId,
  roles,
  icon,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  switch (action) {
    case "create": {
      if (!name) return { error: "Server name is required" };

      const isOwner = await sql`
        SELECT is_owner FROM users WHERE id = ${session.user.id}
      `;

      const server = await sql`
        INSERT INTO servers (name, owner_id, is_owner_created)
        VALUES (${name}, ${session.user.id}, ${isOwner[0]?.is_owner})
        RETURNING id
      `;

      await sql`
        INSERT INTO server_members (server_id, user_id, roles)
        VALUES (${server[0].id}, ${session.user.id}, '["admin"]')
      `;

      await sql`
        INSERT INTO channels (server_id, name, type)
        VALUES (${server[0].id}, 'general', 'text')
      `;

      return { serverId: server[0].id };
    }

    case "update": {
      const server = await sql`
        SELECT owner_id FROM servers WHERE id = ${serverId}
      `;

      if (!server[0] || server[0].owner_id !== session.user.id) {
        return { error: "Unauthorized" };
      }

      if (icon) {
        const { url, error } = await upload({ base64: icon });
        if (error) return { error };

        await sql`
          UPDATE servers 
          SET banner_url = ${url}
          WHERE id = ${serverId}
        `;
      }

      if (name) {
        await sql`
          UPDATE servers 
          SET name = ${name}
          WHERE id = ${serverId}
        `;
      }

      return { success: true };
    }

    case "delete": {
      const result = await sql`
        DELETE FROM servers 
        WHERE id = ${serverId} 
        AND owner_id = ${session.user.id}
        RETURNING id
      `;

      return { success: !!result[0] };
    }

    case "kick": {
      const server = await sql`
        SELECT owner_id FROM servers WHERE id = ${serverId}
      `;

      if (!server[0] || server[0].owner_id !== session.user.id) {
        return { error: "Unauthorized" };
      }

      await sql`
        DELETE FROM server_members
        WHERE server_id = ${serverId} AND user_id = ${kickUserId}
      `;

      return { success: true };
    }

    case "ban": {
      const server = await sql`
        SELECT owner_id FROM servers WHERE id = ${serverId}
      `;

      if (!server[0] || server[0].owner_id !== session.user.id) {
        return { error: "Unauthorized" };
      }

      await sql.transaction([
        sql`DELETE FROM server_members 
            WHERE server_id = ${serverId} AND user_id = ${banUserId}`,
        sql`INSERT INTO banned_members (server_id, user_id)
            VALUES (${serverId}, ${banUserId})`,
      ]);

      return { success: true };
    }

    case "createChannel": {
      if (!channels?.name || !channels?.type) {
        return { error: "Channel name and type required" };
      }

      const server = await sql`
        SELECT owner_id FROM servers WHERE id = ${serverId}
      `;

      if (!server[0] || server[0].owner_id !== session.user.id) {
        return { error: "Unauthorized" };
      }

      const channel = await sql`
        INSERT INTO channels (server_id, name, type)
        VALUES (${serverId}, ${channels.name}, ${channels.type})
        RETURNING id
      `;

      return { channelId: channel[0].id };
    }

    case "deleteChannel": {
      const server = await sql`
        SELECT owner_id FROM servers WHERE id = ${serverId}
      `;

      if (!server[0] || server[0].owner_id !== session.user.id) {
        return { error: "Unauthorized" };
      }

      await sql`
        DELETE FROM channels 
        WHERE id = ${channels.id} AND server_id = ${serverId}
      `;

      return { success: true };
    }

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}