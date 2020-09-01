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

    function registerCommandNice(commandId: string, run: (...args: any[]) => void): void {
        let command = vscode.commands.registerCommand(commandId, run);
        context.subscriptions.push(command);
    }

    registerCommandNice('markdowntable.nextCell', (args) => {
        // エディタ取得
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;
        // ドキュメント取得
        const doc = editor.document;
        // 選択範囲取得
        const cur_selection = editor.selection;
        // カーソル行
        const currentLine = doc.getText(new vscode.Selection(
            new vscode.Position(cur_selection.active.line, 0),
            new vscode.Position(cur_selection.active.line, 10000)));
        // テーブル内ではなかったら終了
        if (!currentLine.trim().startsWith('|')) {
            // 通常のVSCodeの入力処理
            vscode.commands.executeCommand('default:type', {
                text: ' '.repeat(editor.options.tabSize as number)
            });
            return;
        }

        // 表を探す
        let startLine = cur_selection.anchor.line;
        let endLine = cur_selection.anchor.line;
        while (startLine - 1 >= 0) {
            const line_selection = new vscode.Selection(
                new vscode.Position(startLine - 1, 0),
                new vscode.Position(startLine - 1, 10000));

            const line_text = doc.getText(line_selection);
            if (!line_text.trim().startsWith('|')) {
                break;
            }
            startLine--;
        }
        while (endLine + 1 < doc.lineCount) {
            const line_selection = new vscode.Selection(
                new vscode.Position(endLine + 1, 0),
                new vscode.Position(endLine + 1, 10000));

            const line_text = doc.getText(line_selection);
            if (!line_text.trim().startsWith('|')) {
                break;
            }
            endLine++;
        }
        const table_selection = new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, 10000));
        const table_text = doc.getText(table_selection);



        // テーブルの変形処理クラス
        const mdt = new markdowntable.MarkdownTable();

        // 元のカーソル位置を取得
        const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];
        const [prevRow, prevColumn] = mdt.getCellAtPosition(table_text, prevline, prevcharacter);

        // テーブルをTableDataにシリアライズ
        let tableData = mdt.stringToTableData(table_text);
        if (tableData.aligns[0][0] === undefined) {
            return;
        }

        // 次のセルが新しい行になるかどうか
        const isNextRow = (prevColumn + 1 >= tableData.columns.length);
        const isInsertNewRow = (
            // カラム行、または寄せ記号行の場合は3行目を作成する
            (prevRow <= 1 && tableData.cells.length === 0) ||
            // 現在の行が最終行で、かつ次の行に進む場合は末尾に1行追加する
            (isNextRow && prevRow >= tableData.cells.length + 1)
        );

        // 次の行が必要なら追加する
        if (isInsertNewRow === true) {
            tableData = mdt.insertRow(tableData, tableData.cells.length);
        }

        // テーブルをフォーマット
        const newTableText = mdt.tableDataToFormatTableStr(tableData);

        //エディタ選択範囲にテキストを反映
        editor.edit(edit => {
            edit.replace(table_selection, newTableText);
        });

        // 新しいカーソル位置を計算
        // character の +1 は表セル内の|とデータの間の半角スペース分
        const newColumn = (isNextRow === true) ? 0 : prevColumn + 1;
        const newRow = (isNextRow === true) ? prevRow + 1 : prevRow;
        const [newline, newcharacter] = mdt.getPositionOfCell(newTableText, newRow, newColumn);
        const newPosition = new vscode.Position(
            table_selection.start.line + newline,
            table_selection.start.character + newcharacter + 1);
        const newSelection = new vscode.Selection(newPosition, newPosition);

        // カーソル位置を移動
        editor.selection = newSelection;
    });

    registerCommandNice('markdowntable.prevCell', (args) => {
        // エディタ取得
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;
        // ドキュメント取得
        const doc = editor.document;
        // 選択範囲取得
        const cur_selection = editor.selection;
        // カーソル行
        const currentLine = doc.getText(new vscode.Selection(
            new vscode.Position(cur_selection.active.line, 0),
            new vscode.Position(cur_selection.active.line, 10000)));
        // テーブル内ではなかったら終了
        if (!currentLine.trim().startsWith('|')) {
            // 通常のVSCodeの入力処理
            vscode.commands.executeCommand('default:type', {
                text: ' '.repeat(editor.options.tabSize as number)
            });
            return;
        }

        // 表を探す
        let startLine = cur_selection.anchor.line;
        let endLine = cur_selection.anchor.line;
        while (startLine - 1 >= 0) {
            const line_selection = new vscode.Selection(
                new vscode.Position(startLine - 1, 0),
                new vscode.Position(startLine - 1, 10000));

            const line_text = doc.getText(line_selection);
            if (!line_text.trim().startsWith('|')) {
                break;
            }
            startLine--;
        }
        while (endLine + 1 < doc.lineCount) {
            const line_selection = new vscode.Selection(
                new vscode.Position(endLine + 1, 0),
                new vscode.Position(endLine + 1, 10000));

            const line_text = doc.getText(line_selection);
            if (!line_text.trim().startsWith('|')) {
                break;
            }
            endLine++;
        }
        const table_selection = new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, 10000));
        const table_text = doc.getText(table_selection);



        // テーブルの変形処理クラス
        const mdt = new markdowntable.MarkdownTable();

        // 元のカーソル位置を取得
        const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];
        const [prevRow, prevColumn] = mdt.getCellAtPosition(table_text, prevline, prevcharacter);

        // 先頭セルだったら何もしない
        if (prevColumn <= 0 && prevRow <= 0) {
            return;
        }

        // テーブルをTableDataにシリアライズ
        let tableData = mdt.stringToTableData(table_text);
        if (tableData.aligns[0][0] === undefined) {
            return;
        }

        // テーブルをフォーマット
        const newTableText = mdt.tableDataToFormatTableStr(tableData);

        //エディタ選択範囲にテキストを反映
        editor.edit(edit => {
            edit.replace(table_selection, newTableText);
        });

        // 新しいカーソル位置を計算
        // character の +1 は表セル内の|とデータの間の半角スペース分
        const newColumn = (prevColumn > 0) ? prevColumn - 1 : tableData.columns.length - 1;
        const newRow = (prevColumn > 0) ? prevRow : prevRow -1;
        const [newline, newcharacter] = mdt.getPositionOfCell(newTableText, newRow, newColumn);
        const newPosition = new vscode.Position(
            table_selection.start.line + newline,
            table_selection.start.character + newcharacter + 1);
        const newSelection = new vscode.Selection(newPosition, newPosition);

        // カーソル位置を移動
        editor.selection = newSelection;
    });

    registerCommandNice('markdowntable.tsvToTable', () => {
        // The code you place here will be executed every time your command is executed

        // エディタ取得
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;
        // ドキュメント取得
        const doc = editor.document;
        // 選択範囲取得
        const cur_selection = editor.selection;
        if (editor.selection.isEmpty) {
            return;
        }

        const text = doc.getText(cur_selection); //取得されたテキスト

        const mdt = new markdowntable.MarkdownTable();
        const tableData = mdt.tsvToTableData(text);
        //const tableStr = mdt.tableDataToTableStr(tableData);
        const newTableStr = mdt.tableDataToFormatTableStr(tableData);

        //エディタ選択範囲にテキストを反映
        editor.edit(edit => {
            edit.replace(cur_selection, newTableStr);
        });
    });

    registerCommandNice('markdowntable.format', () => {
        // The code you place here will be executed every time your command is executed

        // エディタ取得
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;
        // ドキュメント取得
        const doc = editor.document;
        // ドキュメント全てを取得する
        const all_selection = new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(doc.lineCount - 1, 10000));

        const text = doc.getText(all_selection); //取得されたテキスト
        const lines = text.split(/\r\n|\n|\r/);

        // 変換のリスト
        let format_list = [] as [vscode.Selection, string][];

        // テーブルの変形処理クラス
        const mdt = new markdowntable.MarkdownTable();


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
            while (endLine + 1 < lines.length && lines[endLine + 1].trim().startsWith('|')) {
                endLine++;
                if (endLine >= lines.length) {
                    break;
                }
            }
            // 表のテキストを取得
            const table_selection = new vscode.Selection(
                new vscode.Position(startLine, 0),
                new vscode.Position(endLine, lines[endLine].length));
            const table_text = doc.getText(table_selection);

            // 表をフォーマットする
            const tableData = mdt.stringToTableData(table_text);
            const tableStrFormatted = mdt.tableDataToFormatTableStr(tableData);

            // 変換内容をリストに保持する
            format_list.push([table_selection, tableStrFormatted]);

            preSearchedLine = endLine;
        }

        // 新しいカーソル位置（editor.editでの処理が完了してから動かさないとずれるため外に置く）
        let newSelection = new vscode.Selection(editor.selection.active, editor.selection.active);

        //エディタ選択範囲にテキストを反映
        editor.edit(edit => {
            for (let i = 0; i < format_list.length; i++) {
                const [selection, text] = format_list[i] as [vscode.Selection, string];

                // カーソルを元のセルと同じ位置にするためにカーソル位置を特定しておく
                if (selection.contains(editor.selection.active)) {
                    // テーブルの変形処理クラス
                    const mdt = new markdowntable.MarkdownTable();
                    const prevText = doc.getText(selection);
                    const [prevline, prevcharacter] = [editor.selection.active.line - selection.start.line, editor.selection.active.character];
                    const [prevRow, prevColumn] = mdt.getCellAtPosition(prevText, prevline, prevcharacter);

                    // テキストを置換
                    edit.replace(selection, text);

                    // 新しいカーソル位置を計算
                    // character の +1 は表セル内の|とデータの間の半角スペース分
                    const [newline, newcharacter] = mdt.getPositionOfCell(text, prevRow, prevColumn);
                    const newPosition = new vscode.Position(
                        selection.start.line + newline,
                        selection.start.character + newcharacter + 1);
                    newSelection = new vscode.Selection(newPosition, newPosition);
                }
                else {
                    // テキストを置換
                    edit.replace(selection, text);
                }
            }
        });

        // カーソル位置を移動
        editor.selection = newSelection;

    });

    let insertColumn = (isLeft: boolean) => {
        // エディタ取得
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;
        // ドキュメント取得
        const doc = editor.document;
        // 選択範囲取得
        const cur_selection = editor.selection;
        if (!editor.selection.isEmpty) {
            vscode.window.showErrorMessage('Markdown Table : Insert command doesn\'t allowed range selection.');
            return;
        }

        // 表を探す
        let startLine = cur_selection.anchor.line;
        let endLine = cur_selection.anchor.line;
        while (startLine - 1 >= 0) {
            const line_selection = new vscode.Selection(
                new vscode.Position(startLine - 1, 0),
                new vscode.Position(startLine - 1, 10000));

            const line_text = doc.getText(line_selection);
            if (!line_text.trim().startsWith('|')) {
                break;
            }
            startLine--;
        }
        while (endLine + 1 < doc.lineCount) {
            const line_selection = new vscode.Selection(
                new vscode.Position(endLine + 1, 0),
                new vscode.Position(endLine + 1, 10000));

            const line_text = doc.getText(line_selection);
            if (!line_text.trim().startsWith('|')) {
                break;
            }
            endLine++;
        }
        const table_selection = new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, 10000));
        const table_text = doc.getText(table_selection);


        // テーブルの変形処理クラス
        const mdt = new markdowntable.MarkdownTable();

        // 元のカーソル位置を取得
        const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];
        const [prevRow, prevColumn] = mdt.getCellAtPosition(table_text, prevline, prevcharacter);

        // 挿入位置
        const insertPosition = isLeft ? prevColumn : prevColumn + 1;

        // テーブルをフォーマット
        const tableData = mdt.stringToTableData(table_text);
        const newTableData = mdt.insertColumn(tableData, insertPosition);
        const newTableText = mdt.tableDataToFormatTableStr(newTableData);

        //エディタ選択範囲にテキストを反映
        editor.edit(edit => {
            edit.replace(table_selection, newTableText);
        });

        // 新しいカーソル位置を計算
        // character の +1 は表セル内の|とデータの間の半角スペース分
        const newColumn = insertPosition;
        const [newline, newcharacter] = mdt.getPositionOfCell(newTableText, prevRow, newColumn);
        const newPosition = new vscode.Position(
            table_selection.start.line + newline,
            table_selection.start.character + newcharacter + 1);
        const newSelection = new vscode.Selection(newPosition, newPosition);

        // カーソル位置を移動
        editor.selection = newSelection;
    };

    registerCommandNice('markdowntable.insertRight', () => {
        // The code you place here will be executed every time your command is executed
        insertColumn(false);
    });

    registerCommandNice('markdowntable.insertLeft', () => {
        // The code you place here will be executed every time your command is executed
        insertColumn(true);
    });
}

// this method is called when your extension is deactivated
export function deactivate() { }
