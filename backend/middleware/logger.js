const fs = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");

async function logEvent(message,fileName) {
  console.log(message);
  try {
    const folderPath = path.join(__dirname,"..", "logs");
    if (!existsSync(folderPath)) {
      await fs.mkdir(folderPath, { recursive: true });
    }

    return await fs.appendFile(
      path.join(folderPath,fileName),
      message
    );
  } catch (error) {
    console.error("error", error);
  }
}

const logger = (req, res, next) => {
  logEvent(
    `${req.method}\t${req.headers.origin}\t${formatDate(
      new Date()
    )}\t${crypto.randomUUID()} \n`,
     "logs.txt"
  );
  next()
};

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

module.exports = { logger ,logEvent};
