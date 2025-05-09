async function handler({ theme }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const [user] = await sql`
    UPDATE users 
    SET theme_preference = ${theme}
    WHERE id = ${session.user.id}
    RETURNING theme_preference
  `;

  return { theme: user.theme_preference };
}
export async function POST(request) {
  return handler(await request.json());
}