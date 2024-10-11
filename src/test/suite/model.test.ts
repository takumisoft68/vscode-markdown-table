import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

suite('Format Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', async () => {
        var setting: vscode.Uri = vscode.Uri.parse("file:" + path.resolve(__dirname, '../../../src/test/testData/1.md'));
        await vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
            vscode.window.showTextDocument(a, vscode.ViewColumn.Active, false).then(e => {
                e.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), "Your advertisement here");
                });
                
            });
        }, (error: any) => {
            console.error(error);
            debugger;
        });

        // エディタ取得
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;

        // カーソル位置を移動
        const newSelection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        editor.selection = newSelection;
        // コマンド実行
        await vscode.commands.executeCommand('markdowntable.format').then(async () =>
        {
            await sleep(10000).then(() => {
                // ドキュメント取得
                const doc = editor.document;
                const actual = doc.getText();
                const expected = "";

                assert.notEqual(actual, expected);
            });
        });

	});

});
