import * as vscode from 'vscode';
import * as text from './textUtility';


const isDebugMode = () => process.env.VSCODE_DEBUG_MODE === "true";

export function updateContextKey(statusBar: vscode.StatusBarItem) {
    if(vscode.window.activeTextEditor === undefined) {
        vscode.commands.executeCommand('setContext', 'markdowntable.contextkey.selection.InMarkdownTable', false);
        return;
    }
    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    if(doc === null) {
        vscode.commands.executeCommand('setContext', 'markdowntable.contextkey.selection.InMarkdownTable', false);
        return;
    }
    if(doc.languageId === null) {
        vscode.commands.executeCommand('setContext', 'markdowntable.contextkey.selection.InMarkdownTable', false);
        return;
    }
    if(doc.languageId !== 'markdown' && doc.languageId !== 'mdx') {
        vscode.commands.executeCommand('setContext', 'markdowntable.contextkey.selection.InMarkdownTable', false);
        return;
    }

    // 選択範囲取得
    const cur_selection = editor.selection;
    let inTable: boolean = true;
    for (let linenum = cur_selection.start.line; linenum <= cur_selection.end.line; linenum++) {
        const line_text = doc.lineAt(linenum).text;
        if (!text.isInTable(line_text)) {
            inTable = false;
            break;
        }
    }

    if (inTable) {
        vscode.commands.executeCommand('setContext', 'markdowntable.contextkey.selection.InMarkdownTable', true);

        if (isDebugMode()) {
            statusBar.text = `$(circle-large-filled) in the table`;
            statusBar.tooltip = `cursor is in the table`;
            statusBar.show();
        }
    } else {
        vscode.commands.executeCommand('setContext', 'markdowntable.contextkey.selection.InMarkdownTable', false);

        if (isDebugMode()) {
            statusBar.text = `$(circle-slash) out of table`;
            statusBar.tooltip = `cursor is out of table`;
            statusBar.show();
        }
    }
}

