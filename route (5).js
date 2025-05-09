async function handler({ name }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  const [server] = await sql.transaction(async (sql) => {
    const [newServer] = await sql`
      INSERT INTO servers (name, owner_id, is_owner_created)
      VALUES (${name}, ${userId}, true)
      RETURNING *
    `;

    const [channel] = await sql`
      INSERT INTO channels (server_id, name, type)
      VALUES (${newServer.id}, 'general', 'text')
      RETURNING *
    `;

    await sql`
      INSERT INTO server_members (server_id, user_id, roles)
      VALUES (${newServer.id}, ${userId}, '["owner"]')
    `;

    return [newServer];
  });

  return { server };
}
export async function POST(request) {
  return handler(await request.json());
}