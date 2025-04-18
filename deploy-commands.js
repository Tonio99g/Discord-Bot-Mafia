require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Variables de entorno desde .env
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // Opcional: si querés registrar solo en 1 servidor

// Leer comandos desde la carpeta ./commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[AVISO] El comando en ${file} está incompleto o mal estructurado.`);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

// Registrar los comandos
(async () => {
  try {
    console.log('🔄 Registrando comandos (slash)...');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId), // Para comandos en 1 servidor
      { body: commands }
    );

    console.log('✅ Comandos registrados correctamente.');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();
