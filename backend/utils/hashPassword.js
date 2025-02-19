const hashPassword = async (password) => {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );

  return Buffer.from(arrayBuffer).toString("base64");
};


module.exports = hashPassword