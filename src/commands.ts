import * as vscode from 'vscode';
import * as mdt from './markdowntable';
import MarkdownTableData from './markdownTableData';

export function navigateNextCell(withFormat: boolean) {
    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    // 選択範囲取得
    const cur_selection = editor.selection;
    // カーソル行
    const currentLine = new vscode.Selection(
        new vscode.Position(cur_selection.active.line, 0),
        new vscode.Position(cur_selection.active.line, 10000));
    const currentLineText = doc.getText(currentLine);
    // テーブル内ではなかったら終了
    if (!currentLineText.trim().startsWith('|')) {
        // 通常のインデント
        vscode.commands.executeCommand('tab');
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

    // 元のカーソル位置を取得
    const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];

    // テーブルをTableDataにシリアライズ
    let tableData = mdt.stringToTableData(table_text);
    if (tableData.aligns[0][0] === undefined) {
        return;
    }

    // 元のカーソル位置のセルを取得
    const [prevRow, prevColumn] = mdt.getCellAtPosition(tableData, prevline, prevcharacter, false);

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

    // テーブルをフォーマットしたテキストを取得
    let formatted_text = withFormat ? mdt.toFormatTableStr(tableData) : tableData.toString();

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, formatted_text);
    });

    // 新しいカーソル位置を計算
    // character の +1 は表セル内の|とデータの間の半角スペース分
    const newColumn = (isNextRow === true) ? 0 : prevColumn + 1;
    const newRow = (isNextRow === true) ? prevRow + 1 : prevRow;
    const [newline, newcharacter] = mdt.getPositionOfCell(tableData, newRow, newColumn, withFormat);
    const newPosition = new vscode.Position(
        table_selection.start.line + newline,
        table_selection.start.character + newcharacter + 1);
    const newSelection = new vscode.Selection(newPosition, newPosition);

    // カーソル位置を移動
    editor.selection = newSelection;
};

export function navigatePrevCell(withFormat: boolean) {
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
        // 通常のアウトデント
        vscode.commands.executeCommand('outdent');
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
    let table_text = doc.getText(table_selection);


    // 元のカーソル位置を取得
    const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];

    // テーブルをTableDataにシリアライズ
    let tableData = mdt.stringToTableData(table_text);
    if (tableData.aligns[0][0] === undefined) {
        return;
    }

    // 元のカーソル位置のセルを取得
    const [prevRow, prevColumn] = mdt.getCellAtPosition(tableData, prevline, prevcharacter, false);
    // 先頭セルだったら何もしない
    if (prevColumn <= 0 && prevRow <= 0) {
        return;
    }

    // テーブルをフォーマットしたテキストを取得
    let formatted_text = withFormat ? mdt.toFormatTableStr(tableData) : tableData.toString();

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, formatted_text);
    });

    // 新しいカーソル位置を計算
    // character の +1 は表セル内の|とデータの間の半角スペース分
    const newColumn = (prevColumn > 0) ? prevColumn - 1 : tableData.columns.length - 1;
    const newRow = (prevColumn > 0) ? prevRow : prevRow - 1;
    const [newline, newcharacter] = mdt.getPositionOfCell(tableData, newRow, newColumn, withFormat);
    let newPosition = new vscode.Position(
        table_selection.start.line + newline,
        table_selection.start.character + newcharacter);
    if (withFormat ||
        mdt.getCellData(tableData, newRow, newColumn).startsWith(' ')) {
        newPosition = new vscode.Position(
            table_selection.start.line + newline,
            table_selection.start.character + newcharacter + 1);
    }
    const newSelection = new vscode.Selection(newPosition, newPosition);

    // カーソル位置を移動
    editor.selection = newSelection;
};

export function formatAll() {
    // エディタ取得
    const editor = vscode.window.activeTextEditor as vscode.TextEditor;
    // ドキュメント取得
    const doc = editor.document;
    // // ドキュメント全てを取得する
    // const all_selection = new vscode.Selection(
    //     new vscode.Position(0, 0),
    //     new vscode.Position(doc.lineCount - 1, 10000));

    // const text = doc.getText(all_selection); //取得されたテキスト
    // const lines = text.split(/\r\n|\n|\r/);

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
        const table_selection = new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, doc.lineAt(endLine).text.length));
        const table_text = doc.getText(table_selection);

        // 表をフォーマットする
        const tableData = mdt.stringToTableData(table_text);

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
                const [prevRow, prevColumn] = mdt.getCellAtPosition(tableData, prevline, prevcharacter, false);

                // テキストを置換
                const tableStrFormatted = mdt.toFormatTableStr(tableData);
                edit.replace(selection, tableStrFormatted);

                // 新しいカーソル位置を計算
                // character の +1 は表セル内の|とデータの間の半角スペース分
                const [newline, newcharacter] = mdt.getPositionOfCell(tableData, prevRow, prevColumn, true);
                const newPosition = new vscode.Position(
                    selection.start.line + newline,
                    selection.start.character + newcharacter + 1);
                newSelection = new vscode.Selection(newPosition, newPosition);
            }
            else {
                // テキストを置換
                edit.replace(selection, mdt.toFormatTableStr(tableData));
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

    const tableData = mdt.tsvToTableData(text);
    const newTableStr = mdt.toFormatTableStr(tableData);

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


    // 元のカーソル位置を取得
    const [prevline, prevcharacter] = [cur_selection.active.line - startLine, cur_selection.active.character];

    // テーブルをフォーマット
    const tableData = mdt.stringToTableData(table_text);

    // 元のカーソル位置のセルを取得
    const [prevRow, prevColumn] = mdt.getCellAtPosition(tableData, prevline, prevcharacter, false);

    // 挿入位置
    const insertPosition = isLeft ? prevColumn : prevColumn + 1;

    const newTableData = mdt.insertColumn(tableData, insertPosition);
    const newTableText = mdt.toFormatTableStr(tableData);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, newTableText);
    });

    // 新しいカーソル位置を計算
    // character の +1 は表セル内の|とデータの間の半角スペース分
    const newColumn = insertPosition;
    const [newline, newcharacter] = mdt.getPositionOfCell(tableData, prevRow, newColumn, true);
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
    const currentLine = doc.getText(new vscode.Selection(
        new vscode.Position(cur_selection.start.line, 0),
        new vscode.Position(cur_selection.start.line, 10000)));
    // テーブル内ではなかったら終了
    if (!currentLine.trim().startsWith('|')) {
        vscode.window.showErrorMessage('Markdown Table : Align command failed, because your selection is not starting from inside of a table.');
        return;
    }

    // 表を探す
    let startLine = cur_selection.start.line;
    let endLine = cur_selection.start.line;
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
    if (endLine < cur_selection.end.line) {
        vscode.window.showErrorMessage('Markdown Table : Align command failed, because your selection is hanging out of the table.');
        return;
    }
    const table_selection = new vscode.Selection(
        new vscode.Position(startLine, 0),
        new vscode.Position(endLine, 10000));
    const table_text = doc.getText(table_selection);


    // テーブルをTableDataにシリアライズ
    let tableData = mdt.stringToTableData(table_text);
    if (tableData.aligns[0][0] === undefined) {
        return;
    }

    // 選択セルを取得
    const [startline, startcharacter] = [cur_selection.start.line - startLine, cur_selection.start.character];
    const [startRow, startColumn] = mdt.getCellAtPosition(tableData, startline, startcharacter, false);
    const [endline, endcharacter] = [cur_selection.end.line - startLine, cur_selection.end.character];
    const [endRow, endColumn] = mdt.getCellAtPosition(tableData, endline, endcharacter, false);

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
    const newTableText = mdt.toFormatTableStr(tableData);

    //エディタ選択範囲にテキストを反映
    editor.edit(edit => {
        edit.replace(table_selection, newTableText);
    });

    // 元のカーソル選択位置を計算
    const [anchorline, anchorcharacter] = [cur_selection.anchor.line - startLine, cur_selection.anchor.character];
    // 元のカーソル選択位置のセルを取得
    const [anchorRow, anchorColumn] = mdt.getCellAtPosition(tableData, anchorline, anchorcharacter, false);

    // 新しいカーソル位置をフォーマット後のテキストから計算
    const [newline, newcharacter] = mdt.getPositionOfCell(tableData, anchorRow, anchorColumn, true);
    const newPosition = new vscode.Position(
        table_selection.start.line + newline,
        table_selection.start.character + newcharacter + 1);
    const newSelection = new vscode.Selection(newPosition, newPosition);

    // カーソル位置を移動
    editor.selection = newSelection;
};

