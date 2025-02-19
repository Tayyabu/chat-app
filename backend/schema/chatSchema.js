const { z } = require("zod");

const chatSchema = z.object({
  title: z.string().min(2),
  users: z.array(z.object({ id: z.string(), email: z.string().email() })),
});

const chatUpdateSchema = chatSchema.extend({ id: z.string() });

module.exports = { chatSchema,chatUpdateSchema };
