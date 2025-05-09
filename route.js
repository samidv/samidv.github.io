async function handler({
  action,
  messageId,
  content,
  channelId,
  recipientId,
  emoji,
  messageType,
}) {
  const session = getSession();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  switch (action) {
    case "send": {
      if (!content) return { error: "Message content required" };

      if (messageType === "direct") {
        if (!recipientId) return { error: "Recipient required for DM" };
        const message = await sql`
          INSERT INTO direct_messages (sender_id, recipient_id, content)
          VALUES (${userId}, ${recipientId}, ${content})
          RETURNING *`;
        return { message: message[0] };
      }

      if (messageType === "channel") {
        if (!channelId) return { error: "Channel required" };
        const message = await sql`
          INSERT INTO channel_messages (channel_id, sender_id, content)
          VALUES (${channelId}, ${userId}, ${content})
          RETURNING *`;
        return { message: message[0] };
      }

      return { error: "Invalid message type" };
    }

    case "edit": {
      if (!messageId || !content)
        return { error: "Message ID and content required" };

      if (messageType === "direct") {
        const message = await sql`
          UPDATE direct_messages 
          SET content = ${content}
          WHERE id = ${messageId} AND sender_id = ${userId}
          RETURNING *`;
        return message[0]
          ? { message: message[0] }
          : { error: "Message not found or unauthorized" };
      }

      if (messageType === "channel") {
        const message = await sql`
          UPDATE channel_messages
          SET content = ${content}
          WHERE id = ${messageId} AND sender_id = ${userId}
          RETURNING *`;
        return message[0]
          ? { message: message[0] }
          : { error: "Message not found or unauthorized" };
      }

      return { error: "Invalid message type" };
    }

    case "delete": {
      if (!messageId) return { error: "Message ID required" };

      if (messageType === "direct") {
        const result = await sql`
          DELETE FROM direct_messages
          WHERE id = ${messageId} AND sender_id = ${userId}
          RETURNING id`;
        return result[0]
          ? { success: true }
          : { error: "Message not found or unauthorized" };
      }

      if (messageType === "channel") {
        const result = await sql`
          DELETE FROM channel_messages
          WHERE id = ${messageId} AND sender_id = ${userId}
          RETURNING id`;
        return result[0]
          ? { success: true }
          : { error: "Message not found or unauthorized" };
      }

      return { error: "Invalid message type" };
    }

    case "react": {
      if (!messageId || !emoji)
        return { error: "Message ID and emoji required" };

      const reaction = await sql`
        INSERT INTO message_reactions 
        (${
          messageType === "direct" ? "direct_message_id" : "channel_message_id"
        }, user_id, emoji)
        VALUES (${messageId}, ${userId}, ${emoji})
        RETURNING *`;
      return { reaction: reaction[0] };
    }

    case "history": {
      if (messageType === "direct" && recipientId) {
        const messages = await sql`
          SELECT * FROM direct_messages
          WHERE (sender_id = ${userId} AND recipient_id = ${recipientId})
          OR (sender_id = ${recipientId} AND recipient_id = ${userId})
          ORDER BY sent_at DESC
          LIMIT 50`;
        return { messages };
      }

      if (messageType === "channel" && channelId) {
        const messages = await sql`
          SELECT * FROM channel_messages
          WHERE channel_id = ${channelId}
          ORDER BY sent_at DESC
          LIMIT 50`;
        return { messages };
      }

      return { error: "Invalid history request" };
    }

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}