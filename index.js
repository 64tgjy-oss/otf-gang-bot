// ===== Express (ضروري لـ Render) =====
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ===== Discord Bot =====
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const attendance = new Map();

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!attendance") {
    const embed = new EmbedBuilder()
      .setTitle("📋 تسجيل الحضور")
      .setDescription("اضغط الزر لتسجيل حضورك")
      .setColor("#5865F2");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("attend")
        .setLabel("✅ تسجيل حضور")
        .setStyle(ButtonStyle.Success)
    );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "attend") {
    attendance.set(interaction.user.id, true);

    await interaction.reply({
      content: "✅ تم تسجيل حضورك بنجاح",
      ephemeral: true
    });
  }
});

// ===== Login =====
client.login(process.env.TOKEN);
