// Hello! This is Aiuto's main code.

// loading up packages
const fs = require("fs");
const prompt = require('./node_modules/prompt');
const childProcess = require('child_process');

// start up stuff
clearScreen()
console.log("Hello! Welcome to Aiuto.\nIf you need assistance, type in 'help' in the next prompt.\n");
askForPrompt()

function clearScreen() {
	console.log("\033c");
	console.log("   ___  _       _        \n  / _ \\(_)     | |       \n / /_\\ \\_ _   _| |_ ___  \n |  _  | | | | | __/ _ \\ \n | | | | | |_| | || (_) |\n \\_| |_/_|\\__,_|\\__\\___/ \n\n=========================\n")
}

// a thing to ask for a command
function askForPrompt() {
	prompt.start();

	prompt.get({"properties":{"name":{"description":"Enter a command", "required": true}}}, function (err, result) { 
		commandFinder(result.name)
	})
}

// a thing to check if the input from askForPrompt is valid
function commandFinder(cmd) {
	var activeCommands = JSON.parse(fs.readFileSync('./cmds.json', 'utf8'));
	var splitInput = cmd.trim().split(" ")
	for (var i = 0; i < activeCommands.commands.length; i++) {
		if (activeCommands.commands[i].name.toLowerCase() == splitInput[0].toLowerCase()) {
			if (activeCommands.commands[i].name.toLowerCase() != "exit") {
				clearScreen();
				runScript(activeCommands.commands[i].file, function (err) {
    				if (err) throw err;
    				//clearScreen();
    				console.log(`\n-----------\nThe ${activeCommands.commands[i].name} command has finished running.`);
    				askForPrompt();
				});
				break;
			}
			else {
				console.log("\nThe script has been terminated.")
				process.exit()
			}
		}
		if (i + 1 == activeCommands.commands.length) {
			clearScreen()
			console.log("You didn't enter a valid command.\nNeed help? Type in 'help' as your input.\n")
			askForPrompt()
		}
	}
}

// some code taken from the generous people at stackoverflow
function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

