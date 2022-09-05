import * as vscode from 'vscode';
import * as mtdh from './markdownTableDataHelper';
import MarkdownTableData from './markdownTableData';
import * as text from './textUtility';


export function navigateNextCell(withFormat: boolean) {
    console.log('navigateNextCell called!');

    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    // 選択範囲取得
    const cur_selection = editor.selection;

    // 表を探す
    let startLine = cur_selection.anchor.line;
    let endLine = cur_selection.anchor.line;
    while (startLine - 1 >= 0) {
        const line_text = doc.lineAt(startLine - 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        startLine--;
    }
    while (endLine + 1 < doc.lineCount) {
        const line_text = doc.lineAt(endLine + 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        endLine++;
    }
    const table_selection = new vscode.Selection(startLine, 0, endLine, 10000);
    const table_text = doc.getText(table_selection);

    // 元のカーソル位置を取得
    const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];

    // テーブルをTableDataにシリアライズ
    let tableData = mtdh.stringToTableData(table_text);
    if (tableData.aligns[0][0] === undefined) {
        return;
    }

    // 元のカーソル位置のセルを取得
    const [prevRow, prevColumn] = mtdh.getCellAtPosition(tableData, prevline, prevcharacter);

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
        tableData = mtdh.insertRow(tableData, tableData.cells.length);
    }

    // テーブルをフォーマットしたテキストを取得
    const new_text = withFormat ? mtdh.toFormatTableStr(tableData) : tableData.originalText;
    const tableDataFormatted = mtdh.stringToTableData(new_text);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, new_text);
    });

    // 新しいカーソル位置を計算
    // character の +1 は表セル内の|とデータの間の半角スペース分
    const newColumn = (isNextRow === true) ? 0 : prevColumn + 1;
    const newRow = (isNextRow === true) ? prevRow + 1 : prevRow;
    const [newCellLineAt, newCellCharacterAt] = mtdh.getPositionOfCell(tableDataFormatted, newRow, newColumn);
    const nextCellData = mtdh.getCellData(tableDataFormatted, newRow, newColumn);
    if (nextCellData.trim() === '') {
        const newPositionStart = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + 1);
        const newPositionEnd = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + nextCellData.length - 1);
        const newSelection = new vscode.Selection(newPositionEnd, newPositionStart);
    
        // カーソル位置を移動
        editor.selection = newSelection;
    }
    else {
        const leftSpaceNum = nextCellData.length - nextCellData.trimLeft().length;
        const newPositionStart = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + leftSpaceNum);
        const newPositionEnd = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + leftSpaceNum + nextCellData.trim().length);
        const newSelection = new vscode.Selection(newPositionEnd, newPositionStart);
    
        // カーソル位置を移動
        editor.selection = newSelection;
    }
};

export function navigatePrevCell(withFormat: boolean) {
    console.log('navigatePrevCell called!');

    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    // 選択範囲取得
    const cur_selection = editor.selection;

    // 表を探す
    let startLine = cur_selection.anchor.line;
    let endLine = cur_selection.anchor.line;
    while (startLine - 1 >= 0) {
        const line_text = doc.lineAt(startLine - 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        startLine--;
    }
    while (endLine + 1 < doc.lineCount) {
        const line_text = doc.lineAt(endLine + 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        endLine++;
    }
    const table_selection = new vscode.Selection(startLine, 0, endLine, 10000);
    const table_text = doc.getText(table_selection);

    // 元のカーソル位置を取得
    const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];

    // テーブルをTableDataにシリアライズ
    let tableData = mtdh.stringToTableData(table_text);
    if (tableData.aligns[0][0] === undefined) {
        return;
    }

    // 元のカーソル位置のセルを取得
    const [prevRow, prevColumn] = mtdh.getCellAtPosition(tableData, prevline, prevcharacter);
    // 先頭セルだったら何もしない
    if (prevColumn <= 0 && prevRow <= 0) {
        return;
    }

    // テーブルをフォーマットしたテキストを取得
    const new_text = withFormat ? mtdh.toFormatTableStr(tableData) : tableData.originalText;
    const tableDataFormatted = mtdh.stringToTableData(new_text);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, new_text);
    });

    // 新しいカーソル位置を計算
    // character の +1 は表セル内の|とデータの間の半角スペース分
    const newColumn = (prevColumn > 0) ? prevColumn - 1 : tableDataFormatted.columns.length - 1;
    const newRow = (prevColumn > 0) ? prevRow : prevRow - 1;
    const [newCellLineAt, newCellCharacterAt] = mtdh.getPositionOfCell(tableDataFormatted, newRow, newColumn);
    const nextCellData = mtdh.getCellData(tableDataFormatted, newRow, newColumn);
    if (nextCellData.trim() === '') {
        const newPositionStart = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + 1);
        const newPositionEnd = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + nextCellData.length - 1);
        const newSelection = new vscode.Selection(newPositionEnd, newPositionStart);
    
        // カーソル位置を移動
        editor.selection = newSelection;
    }
    else {
        const leftSpaceNum = nextCellData.length - nextCellData.trimLeft().length;
        const newPositionStart = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + leftSpaceNum);
        const newPositionEnd = new vscode.Position(
            table_selection.start.line + newCellLineAt,
            table_selection.start.character + newCellCharacterAt + leftSpaceNum + nextCellData.trim().length);
        const newSelection = new vscode.Selection(newPositionEnd, newPositionStart);
    
        // カーソル位置を移動
        editor.selection = newSelection;
    }

};

export function formatAll() {
    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    // 変換のリスト
    let format_list = [] as [vscode.Selection, MarkdownTableData][];

    // 表を探す
    let preSearchedLine = -1;
    for (let line = 0; line < doc.lineCount; line++) {
        if (line <= preSearchedLine) {
            continue;
        }
        if (!doc.lineAt(line).text.trim().startsWith('|')) {
            continue;
        }
        let startLine = line;
        let endLine = line;

        // 表の終わり行を探す
        while (endLine + 1 < doc.lineCount && doc.lineAt(endLine + 1).text.trim().startsWith('|')) {
            endLine++;
            if (endLine >= doc.lineCount) {
                break;
            }
        }
        // 表のテキストを取得
        const table_selection = new vscode.Selection(startLine, 0, endLine, doc.lineAt(endLine).text.length);
        const table_text = doc.getText(table_selection);

        // 表をフォーマットする
        const tableData = mtdh.stringToTableData(table_text);

        // 変換内容をリストに保持する
        format_list.push([table_selection, tableData]);

        preSearchedLine = endLine;
    }

    // 新しいカーソル位置（editor.editでの処理が完了してから動かさないとずれるため外に置く）
    let newSelection = new vscode.Selection(editor.selection.active, editor.selection.active);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        for (let i = 0; i < format_list.length; i++) {
            const [selection, tableData] = format_list[i] as [vscode.Selection, MarkdownTableData];

            // カーソルを元のセルと同じ位置にするためにカーソル位置を特定しておく
            if (selection.contains(editor.selection.active)) {
                // テーブルの変形処理クラス
                const [prevline, prevcharacter] = [editor.selection.active.line - selection.start.line, editor.selection.active.character];
                const [prevRow, prevColumn] = mtdh.getCellAtPosition(tableData, prevline, prevcharacter);

                // テキストを置換
                const tableStrFormatted = mtdh.toFormatTableStr(tableData);
                const tableDataFormatted = mtdh.stringToTableData(tableStrFormatted);

                edit.replace(selection, tableStrFormatted);

                // 新しいカーソル位置を計算
                // character の +1 は表セル内の|とデータの間の半角スペース分
                const [newline, newcharacter] = mtdh.getPositionOfCell(tableDataFormatted, prevRow, prevColumn);
                const newPosition = new vscode.Position(
                    selection.start.line + newline,
                    selection.start.character + newcharacter + 1);
                newSelection = new vscode.Selection(newPosition, newPosition);
            }
            else {
                // テキストを置換
                edit.replace(selection, mtdh.toFormatTableStr(tableData));
            }
        }
    });

    // カーソル位置を移動
    editor.selection = newSelection;
}

export function tsvToTable() {
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

    const tableData = mtdh.tsvToTableData(text);
    const newTableStr = mtdh.toFormatTableStr(tableData);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(cur_selection, newTableStr);
    });
}

export function insertColumn(isLeft: boolean) {
    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    // 選択範囲取得
    const cur_selection = editor.selection;

    // 表を探す
    let startLine = cur_selection.active.line;
    let endLine = cur_selection.active.line;
    while (startLine - 1 >= 0) {
        const line_text = doc.lineAt(startLine - 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        startLine--;
    }
    while (endLine + 1 < doc.lineCount) {
        const line_text = doc.lineAt(endLine + 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        endLine++;
    }
    const table_selection = new vscode.Selection(startLine, 0, endLine, 10000);
    const table_text = doc.getText(table_selection);


    // 元のカーソル位置を取得
    const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];

    // テーブルをフォーマット
    const tableData = mtdh.stringToTableData(table_text);

    // 元のカーソル位置のセルを取得
    const [prevRow, prevColumn] = mtdh.getCellAtPosition(tableData, prevline, prevcharacter);

    // 挿入位置
    const insertPosition = isLeft ? prevColumn : prevColumn + 1;

    const newTableData = mtdh.insertColumn(tableData, insertPosition);
    const tableStrFormatted = mtdh.toFormatTableStr(newTableData);
    const tableDataFormatted = mtdh.stringToTableData(tableStrFormatted);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, tableStrFormatted);
    });

    // 新しいカーソル位置を計算
    // character の +1 は表セル内の|とデータの間の半角スペース分
    const newColumn = insertPosition;
    const [newline, newcharacter] = mtdh.getPositionOfCell(tableDataFormatted, prevRow, newColumn);
    const newPosition = new vscode.Position(
        table_selection.start.line + newline,
        table_selection.start.character + newcharacter + 1);
    const newSelection = new vscode.Selection(newPosition, newPosition);

    // カーソル位置を移動
    editor.selection = newSelection;
};

export function alignColumns(alignMark: [string, string]) {
    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    // 選択範囲取得
    const cur_selection = editor.selection;
    // 選択範囲の始まり行
    const currentLine = doc.lineAt(cur_selection.start.line).text;

    // テーブル内ではなかったら終了
    if (!currentLine.trim().startsWith('|')) {
        vscode.window.showErrorMessage('Markdown Table : Align command failed, because your selection is not starting from inside of a table.');
        return;
    }

    // 表を探す
    let startLine = cur_selection.start.line;
    let endLine = cur_selection.start.line;
    while (startLine - 1 >= 0) {
        const line_text = doc.lineAt(startLine - 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        startLine--;
    }
    while (endLine + 1 < doc.lineCount) {
        const line_text = doc.lineAt(endLine + 1).text;
        if (!text.isInTable(line_text)) {
            break;
        }
        endLine++;
    }
    if (endLine < cur_selection.end.line) {
        vscode.window.showErrorMessage('Markdown Table : Align command failed, because your selection is hanging out of the table.');
        return;
    }
    const table_selection = new vscode.Selection(startLine, 0, endLine, 10000);
    const table_text = doc.getText(table_selection);


    // テーブルをTableDataにシリアライズ
    let tableData = mtdh.stringToTableData(table_text);
    if (tableData.aligns[0][0] === undefined) {
        return;
    }

    // 選択セルを取得
    const [startline, startcharacter] = [cur_selection.start.line - startLine, cur_selection.start.character];
    const [startRow, startColumn] = mtdh.getCellAtPosition(tableData, startline, startcharacter);
    const [endline, endcharacter] = [cur_selection.end.line - startLine, cur_selection.end.character];
    const [endRow, endColumn] = mtdh.getCellAtPosition(tableData, endline, endcharacter);

    // 選択範囲の列のAlignを変更する
    if (startRow === endRow) {
        // 選択範囲の開始位置と終了位置が同じ行内の場合
        for (let column = startColumn; column <= endColumn; column++) {
            tableData.aligns[column] = alignMark;
        }
    }
    else if (startRow + 1 === endRow) {
        // 選択範囲が2行にまたがる場合
        for (let column = startColumn; column <= tableData.columns.length; column++) {
            tableData.aligns[column] = alignMark;
        }
        for (let column = 0; column <= endColumn; column++) {
            tableData.aligns[column] = alignMark;
        }
    }
    else {
        // 選択範囲が3行以上にまたがる場合はすべての列が対象
        for (let column = 0; column < tableData.columns.length; column++) {
            tableData.aligns[column] = alignMark;
        }
    }

    // テーブルをフォーマットした文字列を取得
    const newTableText = mtdh.toFormatTableStr(tableData);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, newTableText);
    });

    // 元のカーソル選択位置を計算
    const [anchorline, anchorcharacter] = [cur_selection.anchor.line - startLine, cur_selection.anchor.character];
    // 元のカーソル選択位置のセルを取得
    const [anchorRow, anchorColumn] = mtdh.getCellAtPosition(tableData, anchorline, anchorcharacter,);

    const tableStrFormatted = mtdh.toFormatTableStr(tableData);
    const tableDataFormatted = mtdh.stringToTableData(tableStrFormatted);

    // 新しいカーソル位置をフォーマット後のテキストから計算
    const [newline, newcharacter] = mtdh.getPositionOfCell(tableDataFormatted, anchorRow, anchorColumn);
    const newPosition = new vscode.Position(
        table_selection.start.line + newline,
        table_selection.start.character + newcharacter + 1);
    const newSelection = new vscode.Selection(newPosition, newPosition);

    // カーソル位置を移動
    editor.selection = newSelection;
};

