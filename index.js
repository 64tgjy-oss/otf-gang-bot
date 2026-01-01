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
      .setTitle("نظام الحضور والانصراف")
      .setDescription("اضغط الزر لتسجيل دخولك أو خروجك")
      .setColor("#5865F2");

    const button = new ButtonBuilder()
      .setCustomId("attendance_button")
      .setLabel("تسجيل الدخول / الخروج")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "attendance_button") return;

  const userId = interaction.user.id;
  const now = new Date().toLocaleString("ar-DZ", {
    timeZone: "Africa/Algiers"
  });

  if (!attendance.has(userId)) {
    attendance.set(userId, now);
    await interaction.reply({
      content: `🟢 تم تسجيل الدخول\n🕒 ${now}`,
      ephemeral: true
    });
  } else {
    const entryTime = attendance.get(userId);
    attendance.delete(userId);
    await interaction.reply({
      content: `🔴 تم تسجيل الخروج\n🟢 دخول: ${entryTime}\n🔴 خروج: ${now}`,
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
