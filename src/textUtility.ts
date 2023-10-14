import { workspace } from "vscode";

export function isInTable(text: string, startline: number, endline: number): boolean {
    const lines = text.split(/\r\n|\n|\r/);

    // 指定範囲がテキストに存在しない
    if (startline < 0 || lines.length <= startline || lines.length <= endline) {
        return false;
    }

    const ignoreCodeblock = <boolean>workspace.getConfiguration('markdowntable').get('ignoreCodeblock');
    if (ignoreCodeblock) {
        // 開始行がコードブロック内だったらTable内ではない
        let isInCodeBlock = false;
        for (let i = 0; i <= startline; i++) {
            if (lines[i].trim().startsWith("```")) {
                isInCodeBlock = !isInCodeBlock;
            }
        }
        if (isInCodeBlock) {
            return false;
        }

        // 開始行から終了行までの間にコードブロックを含む場合はTableではない
        let includeCodeBlock = false;
        for (let i = startline; i <= endline; i++) {
            if (lines[i].trim().startsWith("```")) {
                includeCodeBlock = true;
                break;
            }
        }
        if (includeCodeBlock) {
            return false;
        }
    }

    // 開始行から終了行までのすべての行が | で始まっていたらテーブル内
    for (let i = startline; i <= endline; i++) {
        if (!lines[i].trim().startsWith('|')) {
            return false;
        }
    }

    return true;
}

export function findTableRange(text: string, startline: number, endline: number): [number, number] | undefined {
    const lines = text.split(/\r\n|\n|\r/);

    // 指定範囲がテーブル内か確認する
    if (!isInTable(text, startline, endline)) {
        return undefined;
    }

    // 指定範囲の外にテーブルが広がっていたら範囲を修正
    let firstLine = startline;
    let lastLine = endline;
    while (firstLine - 1 >= 0) {
        const line_text = lines[firstLine - 1];
        if (!line_text.trim().startsWith("|")) {
            break;
        }
        firstLine--;
    }
    while (lastLine + 1 < lines.length) {
        const line_text = lines[lastLine + 1];
        if (!line_text.trim().startsWith("|")) {
            break;
        }
        lastLine++;
    }

    return [firstLine, lastLine];
}
