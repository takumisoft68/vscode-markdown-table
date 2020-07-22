// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as markdowntable from './markdowntable';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "markdowntable" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let tsvToTable = vscode.commands.registerCommand('markdowntable.tsvToTable', () => {
		// The code you place here will be executed every time your command is executed

		// エディタ取得
		let editor = vscode.window.activeTextEditor as vscode.TextEditor;
		// ドキュメント取得
		let doc = editor.document;
		// 選択範囲取得
		let cur_selection = editor.selection;
		if(editor.selection.isEmpty){         
			return;
		}

		let text = doc.getText(cur_selection); //取得されたテキスト

		let mdt = new markdowntable.MarkdownTable();
		let tableData = mdt.tsvToTableData(text);
		let tableStr = mdt.tableDataToTableStr(tableData);
		tableStr = mdt.tableDataToFormatTableStr(tableData);

		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			edit.replace(cur_selection, tableStr);
		});
	});

	let format = vscode.commands.registerCommand('markdowntable.format', () => {
		// The code you place here will be executed every time your command is executed

		// エディタ取得
		let editor = vscode.window.activeTextEditor as vscode.TextEditor;
		// ドキュメント取得
		let doc = editor.document;
		// ドキュメント全てを取得する
		let all_selection = new vscode.Selection(
								new vscode.Position(0, 0), 
								new vscode.Position(doc.lineCount - 1, 10000));

		let text = doc.getText(all_selection); //取得されたテキスト
		let lines = text.split(/\r\n|\n|\r/);

		// 変換のリスト
		let format_list = [] as [vscode.Selection, string][];

		// テーブルの変形処理クラス
		let mdt = new markdowntable.MarkdownTable();


		// 表を探す
		let preSearchedLine = -1;
		for (let line = 0; line < lines.length; line++) {
			if (line <= preSearchedLine) {
				continue;
			}
			if (!lines[line].trim().startsWith('|')) {
				continue;
			}
			let startLine = line;
			let endLine = line;

			// 表の終わり行を探す
			while (endLine+1 < lines.length && lines[endLine+1].trim().startsWith('|')) {
				endLine++;
				if(endLine >= lines.length) {
					break;
				}
			}
			// 表のテキストを取得
			let table_selection = new vscode.Selection(
								new vscode.Position(startLine, 0), 
								new vscode.Position(endLine, lines[endLine].length));
			let table_text = doc.getText(table_selection);

			// 表をフォーマットする
			let tableData = mdt.stringToTableData(table_text);
			let tableStrFormatted = mdt.tableDataToFormatTableStr(tableData);

			// 変換内容をリストに保持する
			format_list.push([table_selection, tableStrFormatted]);

			preSearchedLine = endLine;
		}

		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			while (format_list.length > 0) {
				let [selection, text] = format_list.pop() as [vscode.Selection, string];
				edit.replace(selection, text);
			}
		});
	});

	let insertRight = vscode.commands.registerCommand('markdowntable.insertRight', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Insert row in the right from MarkdownTable!');

		// エディタ取得
		let editor = vscode.window.activeTextEditor as vscode.TextEditor;
		// ドキュメント取得
		let doc = editor.document;
		// 選択範囲取得
		let cur_selection = editor.selection;
		if(editor.selection.isEmpty){         
			// 選択範囲が空であれば全てを選択範囲にする
			let startPos = new vscode.Position(0, 0);
			let endPos = new vscode.Position(doc.lineCount - 1, 10000);
			cur_selection = new vscode.Selection(startPos, endPos);
		}

		let text = doc.getText(cur_selection); //取得されたテキスト

		/**
		* ここでテキストを加工します。
		**/
		text += "test"


		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			edit.replace(cur_selection, text);
		});
	});

	let insertLeft = vscode.commands.registerCommand('markdowntable.insertLeft', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Insert row in the left from MarkdownTable!');

		// エディタ取得
		let editor = vscode.window.activeTextEditor as vscode.TextEditor;
		// ドキュメント取得
		let doc = editor.document;
		// 選択範囲取得
		let cur_selection = editor.selection;
		if(editor.selection.isEmpty){         
			// 選択範囲が空であれば全てを選択範囲にする
			let startPos = new vscode.Position(0, 0);
			let endPos = new vscode.Position(doc.lineCount - 1, 10000);
			cur_selection = new vscode.Selection(startPos, endPos);
		}

		let text = doc.getText(cur_selection); //取得されたテキスト

		/**
		* ここでテキストを加工します。
		**/
		text += "test"


		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			edit.replace(cur_selection, text);
		});
	});

	context.subscriptions.push(tsvToTable);
	context.subscriptions.push(format);
	context.subscriptions.push(insertRight);
	context.subscriptions.push(insertLeft);
}

// this method is called when your extension is deactivated
export function deactivate() {}
