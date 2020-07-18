// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class MDT {
	public tsvToTable(srcText :string) : string {
		// 入力データを行ごとに分割する
		let lines = srcText.split('\r\n');
		// カラム数
		let columnCount = lines[0].split('\t').length;
		// 入力データから改行とタブで分割した2次元配列を生成する
		var cells: string [][] = new Array();
		// カラム数よりもはみ出たデータ
		var leftover : string[] = new Array();
		for (var row = 0; row < lines.length; row++) {
			// 各セルの値
			cells[row] = new Array();
			// 行内のデータが足りない場合に備えて空白文字で埋める
			for (var column = 0; column < columnCount; column++) {
				cells[row][column] = ' ';
			}

			// 余りデータを初期化
			leftover[row] = '';

			// 行データをタブで分割
			let lineValues = lines[row].split('\t');

			// 実際の値に置き換える
			for (var column = 0; column < lineValues.length; column++) {
				if(column >= columnCount){
					// カラムヘッダーよりも多い場合ははみ出しデータ配列に保存
					leftover[row] += '\t' + lineValues[column];
					break;
				}
				cells[row][column] = lineValues[column];
			}
		}
		
		var tableString = "";

		// カラムヘッダー行の作成
		for (var i = 0; i < cells[0].length; i++) {
			tableString += '| ' + cells[0][i] + ' ';
		}
		tableString += '|\r\n';
		// テーブル記号
		for (var i = 0; i < cells[0].length; i++) {
			tableString += '| --- ';
		}
		tableString += '|\r\n';
		// テーブル内の各行
		for (var row = 1; row < cells.length; row++) {
			for (var i = 0; i < cells[row].length; i++) {
				tableString += '| ' + cells[row][i] + ' ';
			}
			tableString += '|'

			// 余りデータがある場合はつなげる
			if (leftover[row] != '') {
				tableString += leftover[row];
			}

			// 次の行がある場合は改行を付ける
			if (row < cells.length) {
				tableString += '\r\n';
			}
		}

		return tableString;
	}


	public formatTable(tableText :string) :string {

		return tableText;
	}
}

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
		let mdt = new MDT();
		let tableStr = mdt.tsvToTable(text);
		let tableStrFormatted = mdt.formatTable(tableStr);


		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			edit.replace(cur_selection, tableStrFormatted);
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
