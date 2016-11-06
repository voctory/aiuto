const fs = require("fs");

var commandsList = [];
var activeCommands = JSON.parse(fs.readFileSync('./cmds.json', 'utf8'));
for (var i = 0; i < activeCommands.commands.length; i++) {
	commandsList.push(`${activeCommands.commands[i].name} (${activeCommands.commands[i].description})`);
	if (i + 1 == activeCommands.commands.length) {
		console.log(`Aiuto's Commands:\n\n- ${commandsList.toString().replace(/,/gi, "\n- ")}`);
	}
}