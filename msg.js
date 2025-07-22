const venom = require("venom-bot");
const config = require("./config.json");

const mensagens = [
  "87349015",
  "87349016",
  "87349018",
];

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
    console.log("❌ Grupo não encontrado: ", config.chatName);
    return;
  }

  const groupId = group.id._serialized;

  for (const msg of mensagens) {
    try {
      await client.sendText(groupId, msg);
      console.log(`✅ Enviado: "${msg}"`);
    } catch (err) {
      console.error(`❌ Erro ao enviar mensagem: "${msg}"`, err);
    }
  }

  console.log("✅ Todas as mensagens foram enviadas.");
}
