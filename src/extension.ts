// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands';
import { ContextServiceManager } from "./contextServices/contextServiceManager";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "markdowntable" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    // custom context key services
    const contextServiceManager = new ContextServiceManager();
    // subscribe custom context key services
    context.subscriptions.push(
        contextServiceManager
    );
    // start custom context key services
    contextServiceManager.activate(context);
    
    // subscribe command handlers
    context.subscriptions.push(
        vscode.commands.registerCommand('markdowntable.nextCell', () => commands.navigateNextCell(true)),
        vscode.commands.registerCommand('markdowntable.prevCell', () => commands.navigatePrevCell(true)),
        vscode.commands.registerCommand('markdowntable.nextCellWithoutFormat', () => commands.navigateNextCell(false)),
        vscode.commands.registerCommand('markdowntable.prevCellWithoutFormat', () => commands.navigatePrevCell(false)),
        vscode.commands.registerCommand('markdowntable.tsvToTable', () => commands.tsvToTable()),
        vscode.commands.registerCommand('markdowntable.csvToTable', () => commands.csvToTable()),
        vscode.commands.registerCommand('markdowntable.format', () => commands.formatAll()),
        vscode.commands.registerCommand('markdowntable.insertRight', () => commands.insertColumn(false)),
        vscode.commands.registerCommand('markdowntable.insertLeft', () => commands.insertColumn(true)),
        vscode.commands.registerCommand('markdowntable.alignLeft', () => commands.alignColumns([':', '-'])),
        vscode.commands.registerCommand('markdowntable.alignCenter', () => commands.alignColumns([':', ':'])),
        vscode.commands.registerCommand('markdowntable.alignRight', () => commands.alignColumns(['-', ':'])),
        vscode.commands.registerCommand('markdowntable.moveLeft', () => commands.moveColumns(true)),
        vscode.commands.registerCommand('markdowntable.moveRight', () => commands.moveColumns(false))
    );
}


// this method is called when your extension is deactivated
export function deactivate() { }
