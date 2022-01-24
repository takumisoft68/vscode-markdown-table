
export default class MarkdownTableData {
    public readonly aligns: [string, string][];
    public readonly columns: string[];
    public readonly cells: string[][];
    public readonly leftovers: string[];
    public readonly indent: string;

    constructor(_text: string, _aligns: [string, string][], _columns: string[], _cells: string[][], _leftovers: string[], _indent: string) {
        this.aligns = _aligns;
        this.columns = _columns;
        this.cells = _cells;
        this.leftovers = _leftovers;
        this.indent = _indent;
    }

    public toString(): string {
        //return this.originalText;

        let tableString = "";

        // カラムヘッダー行の作成
        tableString += this.indent;
        for (let i = 0; i < this.columns.length; i++) {
            tableString += '|' + this.columns[i];
        }
        tableString += '|\r\n';
        // テーブル記号
        tableString += this.indent;
        for (let i = 0; i < this.columns.length; i++) {
            let [front, end] = this.aligns[i];
            tableString += '| ' + front + '-' + end + ' ';
        }
        tableString += '|\r\n';
        // テーブル内の各行
        for (let row = 0; row < this.cells.length; row++) {
            tableString += this.indent;
            for (let i = 0; i < this.cells[row].length; i++) {
                tableString += '|' + this.cells[row][i];
            }
            tableString += '|';

            // 余りデータがある場合はつなげる
            if (this.leftovers[row] !== '') {
                tableString += this.leftovers[row];
            }

            // 次の行がある場合は改行を付ける
            if (row + 1 < this.cells.length) {
                tableString += '\r\n';
            }
        }

        return tableString;
    }

};
