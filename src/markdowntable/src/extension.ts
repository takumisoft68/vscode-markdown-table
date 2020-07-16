// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdowntable" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let helloWorld = vscode.commands.registerCommand('markdowntable.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from MarkdownTable!');
	});

	let tsvToTable = vscode.commands.registerCommand('markdowntable.tsvToTable', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('TSV to Table from MarkdownTable!');

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

	let format = vscode.commands.registerCommand('markdowntable.format', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Format all tables from MarkdownTable!');

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

		/**
		* ここでテキストを加工します。
		**/
		text += "test"


		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			edit.replace(cur_selection, text);
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

	context.subscriptions.push(helloWorld);
	context.subscriptions.push(tsvToTable);
	context.subscriptions.push(format);
	context.subscriptions.push(insertRight);
	context.subscriptions.push(insertLeft);
}

// this method is called when your extension is deactivated
export function deactivate() {}
