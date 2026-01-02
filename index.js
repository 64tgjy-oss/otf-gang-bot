// ===== Discord Attendance Bot =====

const { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require("discord.js");

const express = require("express");
const app = express();

// ===== Express (Render) =====
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => {
  res.send("🤖 Bot is running!");
});
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ===== Discord Client =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== Bot Ready =====
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== Command (!attendance) =====
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content !== "!attendance") return;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("check_in")
      .setLabel("تسجيل الدخول")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("check_out")
      .setLabel("تسجيل الخروج")
      .setStyle(ButtonStyle.Danger)
  );

  await message.channel.send({
    content: "🕘 **نظام الحضور والانصراف**\nاضغط الزر لتسجيل دخولك أو خروجك",
    components: [row],
  });
});

// ===== Button Interaction =====
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const user = interaction.user;
  const time = new Date().toLocaleString("ar-LY");

  if (interaction.customId === "check_in") {
    await interaction.reply({
      content: `✅ **${user.username}** سجّل دخولك\n🕒 ${time}`,
      ephemeral: false,
    });
  }

  if (interaction.customId === "check_out") {
    await interaction.reply({
      content: `🚪 **${user.username}** سجّل خروجك\n🕒 ${time}`,
      ephemeral: false,
    });
  }
});

// ===== Login =====
client.login(process.env.TOKEN);
