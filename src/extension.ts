import * as vscode from 'vscode';

export function activate(/* context: vscode.ExtensionContext */) {
	const settings = vscode.workspace.getConfiguration();

	const startCommands = settings.get("auto-start-terminal.commands") as string[];
	const startHelps = settings.get("auto-start-terminal.preparedCommands") as string[];


	if ((startCommands === undefined || startHelps === undefined) || (startCommands.length === 0 && startHelps.length === 0)) {
		return;
	}

	const commands = startCommands.map((value) => { return { command: value, start: true }; }).concat(...startHelps.map((value) => { return { command: value, start: false }; }));

	let terminals = Array<vscode.Terminal>();

	const overrideActive = settings.get("auto-start-terminal.overrideActive") as boolean;

	for (let i = 0; i < commands.length; i++) {
		if (i === 0 && vscode.window.activeTerminal !== undefined && overrideActive) {
			let terminal = vscode.window.activeTerminal;
			terminal.sendText(commands[i].command, commands[i].start);
			terminals.push(terminal);
		}
		else {
			let terminal = vscode.window.createTerminal();
			terminal.sendText(commands[i].command, commands[i].start);
			terminals.push(terminal);
		}
	}

	const showOnLaunch = settings.get("auto-start-terminal.showTerminal") as string;
	if (showOnLaunch === "show" && overrideActive) {
		terminals[0].show();
	}
	if (showOnLaunch === "hide") {
		terminals[0].hide();
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }
