// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands';


let myStatusBarItem: vscode.StatusBarItem;


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "markdowntable" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    vscode.commands.executeCommand('setContext', 'selectionInMarkdownTable', false);

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

    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        10000
    );
    context.subscriptions.push(myStatusBarItem);

    // register some listener that make sure the status bar
    // item always up-to-date
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => commands.updateContextKey(myStatusBarItem))
    );
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(() => commands.updateContextKey(myStatusBarItem))
    );
}


// this method is called when your extension is deactivated
export function deactivate() { }
