// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class TableData {
	public aligns : [string, string][] ;
	public columns : string[];
	public cells: string [][];
	public leftovers : string[];

	constructor(_aligns: [string, string][], _columns : string[], _cells: string [][], _leftovers : string[]){
		this.aligns = _aligns;
		this.columns = _columns;
		this.cells = _cells;
		this.leftovers = _leftovers;
	}
};

class MDT {


	public tsvToTableData(srcText :string) : TableData {
		// 入力データを行ごとに分割する
		let lines = srcText.split(/\r\n|\n|\r/);
		// カラムデータ
		let columns : string[] = new Array();
		let columntexts = lines[0].split('\t');
		// カラム数
		let columnCount = columntexts.length;

		for (let i = 0; i < columnCount; i++) {
			columns[i] = columntexts[i].trim();
		}


		// 入力データから改行とタブで分割した2次元配列を生成する
		let cells: string [][] = new Array();
		// カラム数よりもはみ出たデータ
		let leftover : string[] = new Array();
		for (let row = 1; row < lines.length; row++) {
			// 各セルの値
			cells[row - 1] = new Array();
			// 行内のデータが足りない場合に備えて空白文字で埋める
			for (let column = 0; column < columnCount; column++) {
				cells[row - 1][column] = ' ';
			}

			// 余りデータを初期化
			leftover[row - 1] = '';

			// 行データをタブで分割
			let lineValues = lines[row].split('\t');

			// 実際の値に置き換える
			for (let column = 0; column < lineValues.length; column++) {
				if(column >= columnCount){
					// カラムヘッダーよりも多い場合ははみ出しデータ配列に保存
					leftover[row - 1] += '\t' + lineValues[column];
					continue;
				}
				cells[row - 1][column] = lineValues[column].trim();
			}
		}

		// 表の寄せ記号
		let aligns : [string, string][] = new Array();
		for (let column = 0; column < columnCount; column++) {
			// 全部左寄せ
			aligns[column] = [':', '-'];
		}

		return new TableData(aligns, columns, cells, leftover);
	}

	public tableDataToTable(data :TableData) : string {
		let tableString = "";

		// カラムヘッダー行の作成
		for (let i = 0; i < data.columns.length; i++) {
			tableString += '| ' + data.columns[i] + ' ';
		}
		tableString += '|\r\n';
		// テーブル記号
		for (let i = 0; i < data.columns.length; i++) {
			let [front, end] = data.aligns[i];
			tableString += '| ' + front + '-' + end + ' ';
		}
		tableString += '|\r\n';
		// テーブル内の各行
		for (let row = 0; row < data.cells.length; row++) {
			for (let i = 0; i < data.cells[row].length; i++) {
				tableString += '| ' + data.cells[row][i] + ' ';
			}
			tableString += '|';

			// 余りデータがある場合はつなげる
			if (data.leftovers[row] !== '') {
				tableString += data.leftovers[row];
			}

			// 次の行がある場合は改行を付ける
			if (row+1 < data.cells.length) {
				tableString += '\r\n';
			}
		}

		return tableString;
	}

	// 半角文字は1文字、全角文字は2文字として文字数をカウントする
	public getLen(str :string) :number {
		let length = 0;
		for(let i=0; i<str.length; i++) {
			let chr = str.charCodeAt(i);
			if((chr >= 0x00 && chr < 0x81) ||
				(chr === 0xf8f0) ||
				(chr >= 0xff61 && chr < 0xffa0) ||
				(chr >= 0xf8f1 && chr < 0xf8f4)){
				//半角文字の場合は1を加算
				length += 1;
			}else{
				//それ以外の文字の場合は2を加算
				length += 2;
			}
		}
		//結果を返す
		return length;
	};

	

	public formatStrFromTableData(tableData :TableData) :string {
		let columnNum = tableData.columns.length;

		// 各列の最大文字数を調べる
		let maxWidths : number[] = new Array();
		// コラムヘッダーの各項目の文字数
		for (let i = 0; i < tableData.columns.length; i++) {
			let cellLength = this.getLen(tableData.columns[i].trim());
			// 表の寄せ記号行は最短で半角3文字なので、各セル最低でも半角3文字
			maxWidths[i] = (3 > cellLength) ? 3 : cellLength;
		}

		for (let row = 0; row < tableData.cells.length; row++) {
			let cells = tableData.cells[row];
			for (let i = 0; i < cells.length; i++) {
				if (i > columnNum) { break; }
				let cellLength = this.getLen(cells[i].trim());
				maxWidths[i] = (maxWidths[i] > cellLength) ? maxWidths[i] : cellLength;
			}
		}

		let formatted : string[] = new Array();

		// 列幅をそろえていく
		for (let row = 0; row < tableData.cells.length; row++) {
			formatted[row] = '';
			let cells = tableData.cells[row];
			for (let i = 0; i <= columnNum; i++) {
				let celldata = '';
				if (i < cells.length) {
					celldata = cells[i].trim();
				}
				let celldata_length = this.getLen(celldata);

				// | の後にスペースを入れてデータ
				formatted[row] += '| ' + celldata;
				// 余白を半角スペースで埋める
				for(let n = celldata_length; n < maxWidths[i]; n++) {
					formatted[row] += ' ';
				}
				// | の前にスペースを入れる
				formatted[row] += ' ';
			}
			formatted[row] += '|';

			// あまりデータを末尾に着ける
			for(let n = columnNum + 1; n < cells.length; n++) {
				formatted[row] += cells[n];
				if (n+1 < cells.length) {
					formatted[row] += '|';
				}
			}
		}

		// 1行目を成形する
		let columnHeader = '';
		for (let i = 0; i < columnNum; i++) {
			columnHeader += '| ' + tableData.columns[i];

			// 余白を-で埋める
			for(let n = 0; n < maxWidths[i]; n++) {
				columnHeader += ' ';
			}
			columnHeader += ' ';
		}
		columnHeader += '|';


		// 2行目を成形する
		let tablemark = '';
		for (let i = 0; i < columnNum; i++) {
			let [front, end] = tableData.aligns[i];
			tablemark += '| ' + front;

			// 余白を-で埋める
			for(let n = 1; n < maxWidths[i] - 1; n++) {
				tablemark += '-';
			}
			tablemark += end + ' ';
		}
		tablemark += '|';

		formatted.splice(0, 0, columnHeader);
		formatted.splice(1, 0, tablemark);

		return formatted.join('\r\n');
	}

	public formatTable(tableText :string) :string {
		let formatted : string[] = new Array();
		let lines = tableText.split(/\r\n|\n|\r/);

		let columnNum = lines[0].split('|').length - 2;

		// 各列の最大文字数を調べる
		let maxWidths : number[] = new Array();
		for (let row = 0; row < lines.length; row++) {
			let cells = lines[row].split('|');
			for (let i = 1; i < cells.length; i++) {
				if (i > columnNum) { break; }
				let cellLength = this.getLen(cells[i].trim());
				if(row === 1) { cellLength = 3;}
				maxWidths[i] = (maxWidths[i] > cellLength) ? maxWidths[i] : cellLength;
			}
		}

		// 2行目の寄せ記号
		let aligns : [string, string][] = new Array();
		for (let row = 1; row <= 1; row++) {
			let cells = lines[row].split('|');
			for (let i = 1; i < cells.length; i++) {
				let celldata = cells[i].trim();
				aligns[i] = [celldata[0], celldata.slice(-1)];
			}
		}

		// 列幅をそろえていく
		for (let row = 0; row < lines.length; row++) {
			// 2行目はいったん無視する
			if (row === 1) { continue; }

			formatted[row] = '';
			let cells = lines[row].split('|');
			for (let i = 1; i <= columnNum; i++) {
				let celldata = '';
				if (i < cells.length) {
					celldata = cells[i].trim();
				}
				let celldata_length = this.getLen(celldata);

				// | の後にスペースを入れてデータ
				formatted[row] += '| ' + celldata;
				// 余白を半角スペースで埋める
				for(let n = celldata_length; n < maxWidths[i]; n++) {
					formatted[row] += ' ';
				}
				// | の前にスペースを入れる
				formatted[row] += ' ';
			}
			formatted[row] += '|';

			// あまりデータを末尾に着ける
			for(let n = columnNum + 1; n < cells.length; n++) {
				formatted[row] += cells[n];
				if (n+1 < cells.length) {
					formatted[row] += '|';
				}
			}
		}

		// 2行目を成形する
		let tablemark = '';
		for (let i = 1; i <= columnNum; i++) {
			let [front, end] = aligns[i];
			tablemark += '| ' + front;

			// 余白を-で埋める
			for(let n = 1; n < maxWidths[i] - 1; n++) {
				tablemark += '-';
			}
			tablemark += end + ' ';
		}
		tablemark += '|';
		formatted[1] = tablemark;

		return formatted.join('\r\n');
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
		let tableData = mdt.tsvToTableData(text);
		let tableStr = mdt.tableDataToTable(tableData);
		tableStr = mdt.formatStrFromTableData(tableData);
		//let tableStr = mdt.tsvToTable(text);
		//tableStr = mdt.formatTable(tableStr);


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
		let table_selection_list : vscode.Selection[] = new Array();
		let table_formatted_str : string[] = new Array();

		// テーブルの変形処理クラス
		let mdt = new MDT();


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
			let tableStrFormatted = mdt.formatTable(table_text);

			// 変換内容をリストに保持する
			table_selection_list.push(table_selection);
			table_formatted_str.push(tableStrFormatted);

			preSearchedLine = endLine;
		}

		//エディタ選択範囲にテキストを反映
		editor.edit(edit => {
			while (table_selection_list.length > 0) {
				let selection = table_selection_list.pop() as vscode.Selection;
				let text = table_formatted_str.pop() as string;
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
