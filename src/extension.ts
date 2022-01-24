// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "markdowntable" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    function registerCommandNice(commandId: string, run: (...args: any[]) => void): void {
        let command = vscode.commands.registerCommand(commandId, run);
        context.subscriptions.push(command);
    }

    registerCommandNice('markdowntable.nextCell', () => {
        commands.navigateNextCell(true);
    });

    registerCommandNice('markdowntable.prevCell', () => {
        commands.navigatePrevCell(true);
    });

    registerCommandNice('markdowntable.nextCellWithoutFormat', () => {
        commands.navigateNextCell(false);
    });

    registerCommandNice('markdowntable.prevCellWithoutFormat', () => {
        commands.navigatePrevCell(false);
    });

    registerCommandNice('markdowntable.tsvToTable', () => {
        commands.tsvToTable();
    });

    registerCommandNice('markdowntable.format', () => {
        commands.formatAll();
    });

    registerCommandNice('markdowntable.insertRight', () => {
        commands.insertColumn(false);
    });

    registerCommandNice('markdowntable.insertLeft', () => {
        commands.insertColumn(true);
    });

    registerCommandNice('markdowntable.alignLeft', () => {
        commands.alignColumns([':', '-']);
    });

    registerCommandNice('markdowntable.alignCenter', () => {
        commands.alignColumns([':', ':']);
    });

    registerCommandNice('markdowntable.alignRight', () => {
        commands.alignColumns(['-', ':']);
    });
}

// this method is called when your extension is deactivated
export function deactivate() { }
