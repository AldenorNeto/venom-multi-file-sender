const venom = require("venom-bot");
const fs = require("fs");
const path = require("path");

const config = require("./config.json");

venom
  .create({
    session: config.sessionName,
    headless: true,
    browserArgs: ["--headless=new", "--no-sandbox"],
  })
  .then((client) => start(client))
  .catch((error) => console.error("Erro ao iniciar cliente:", error));

async function start(client) {
  const chats = await client.getAllChats();
  const group = chats.find((chat) => chat.name === config.chatName);

  if (!group) {
    console.log("Grupo não encontrado: ", config.chatName);
    return;
  }

  const groupId = group.id._serialized;
  const dir = config.targetDir;
  const ext = config.extension;

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(ext))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.log(`Nenhum arquivo "${ext}" encontrado em ${dir}`);
    return;
  }

  for (const file of files) {
    const filePath = path.resolve(dir, file);
    try {
      await client.sendFile(groupId, filePath, file, file);
      console.log(`✅ Enviado: ${file}`);
    } catch (err) {
      console.error(`❌ Erro ao enviar ${file}:`, err);
    }
  }

  console.log("✅ Todos os arquivos foram enviados.");
}
