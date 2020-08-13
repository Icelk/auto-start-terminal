import * as vscode from 'vscode';

export function activate (/* context: vscode.ExtensionContext */)
{
	const settings = vscode.workspace.getConfiguration();

	const startCommands = settings.get("auto-start-terminal.commands") as string[];

	if (startCommands === undefined || startCommands.length === 0)
	{
		return;
	}

	let terminals = Array<vscode.Terminal>();

	for (let i = 0; i < startCommands.length; i++)
	{
		if (i === 0 && vscode.window.activeTerminal !== undefined)
		{
			let terminal = vscode.window.activeTerminal;
			terminal.sendText(startCommands[i], true);
			terminals.push(terminal);
		}
		else
		{
			let terminal = vscode.window.createTerminal();
			terminal.sendText(startCommands[i], true);
			terminals.push(terminal);
		}
	}

	const showOnLaunch = settings.get("auto-start-terminal.showTerminal") as string;
	if (showOnLaunch === "show")
	{
		terminals[0].show();
	}
	if (showOnLaunch === "hide")
	{
		terminals[0].hide();
	}
}

// this method is called when your extension is deactivated
export function deactivate () { }
