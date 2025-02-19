const { z } = require("zod");

const messageSchema = z.object({
  chatId: z.string(),
  content: z.string(),
});

module.exports = { messageSchema };
