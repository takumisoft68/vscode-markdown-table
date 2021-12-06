import { workspace } from "vscode";

// 行文字列をセルデータ配列に分解する
// datasNumMin に指定したデータ数に満たない行は '' で埋める
function splitline(linestr: string, datasNumMin :number, fillstr :string = '') {
    // 先頭と末尾の|を削除
    linestr = linestr.trim();
    if (linestr.startsWith('|')) {
        linestr = linestr.slice(1);
    }
    if (linestr.endsWith('|')) {
        linestr = linestr.slice(0, -1);
    }

    // |で分割
    let linedatas : string[] = [];
    let startindex = 0;
    let endindex = 0;
    let isEscaping = false;
    let isInInlineCode = false;
    for (let i = 0; i < linestr.length; ++i) {
        const chara = linestr.charAt(i);
        if(chara === '\\') {
            // \はエスケープ文字
            isEscaping = true;
            endindex++;
            continue;
        }
        if(isEscaping) {
            // エスケープ文字の次の文字は|かどうか判定しない
            isEscaping = false;
            endindex++;
            continue;
        }

        if(chara === '\`') {
            // `の間はインラインコード
            isInInlineCode = !isInInlineCode;
            endindex++;
            continue;
        }
        if(isInInlineCode) {
            // インラインコード中は|かどうか判定しない
            endindex++;
            continue;
        }

        if(chara !== '|') {
            // | 以外だったら継続
            endindex++;
            continue;
        }

        // | だったら分割
        let cellstr = linestr.slice(startindex, endindex);
        linedatas.push(cellstr);
        startindex = i+1;
        endindex = i+1;
    }
    linedatas.push(linestr.slice(startindex));

    // 最低データ数分を''で埋めておく
    let datas : string[] = new Array(datasNumMin).fill(fillstr);
    // 行文字列から取得したデータに置き換える
    for (let i = 0; i < linedatas.length; i++) {
        datas[i] = linedatas[i];
    }
    return datas;
};



export class TableData {
    public readonly aligns : [string, string][] ;
    public readonly columns : string[];
    public readonly cells: string [][];
    public readonly leftovers : string[];
    public readonly indent : string;

    constructor(_text :string, _aligns: [string, string][], _columns : string[], _cells: string [][], _leftovers : string[], _indent : string){
        this.aligns = _aligns;
        this.columns = _columns;
        this.cells = _cells;
        this.leftovers = _leftovers;
        this.indent = _indent;
    }

    public toString() :string {
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
            if (row+1 < this.cells.length) {
                tableString += '\r\n';
            }
        }

        return tableString;
    }

    public toFormatTableStr() :string {
        let alignData = <boolean> workspace.getConfiguration('markdowntable').get('alignData');
        let alignHeader = <boolean> workspace.getConfiguration('markdowntable').get('alignColumnHeader');
        let columnNum = this.columns.length;

        // 各列の最大文字数を調べる
        let maxWidths : number[] = new Array();
        // コラムヘッダーの各項目の文字数
        for (let i = 0; i < this.columns.length; i++) {
            let cellLength = this.getLen(this.columns[i].trim());
            // 表の寄せ記号行は最短で半角3文字なので、各セル最低でも半角3文字
            maxWidths[i] = (3 > cellLength) ? 3 : cellLength;
        }

        for (let row = 0; row < this.cells.length; row++) {
            let cells = this.cells[row];
            for (let i = 0; i < cells.length; i++) {
                if (i > columnNum) { break; }
                let cellLength = this.getLen(cells[i].trim());
                maxWidths[i] = (maxWidths[i] > cellLength) ? maxWidths[i] : cellLength;
            }
        }

        let formatted : string[] = new Array();

        // 列幅をそろえていく
        for (let row = 0; row < this.cells.length; row++) {
            formatted[row] = '';
            formatted[row] += this.indent;
            let cells = this.cells[row];
            for (let i = 0; i < columnNum; i++) {
                let celldata = '';
                if (i < cells.length) {
                    celldata = cells[i].trim();
                }
                let celldata_length = this.getLen(celldata);

                // | の後にスペースを入れる
                formatted[row] += '| ';
                if (alignData) {
                    let [front, end] = this.aligns[i];
                    if (front === ':' && end === ':') {
                        // 中央ぞろえ
                        for(let n = 0; n < (maxWidths[i] - celldata_length) / 2 - 0.5; n++) {
                            formatted[row] += ' ';
                        }
                        formatted[row] += celldata;
                        for(let n = 0; n < (maxWidths[i] - celldata_length) / 2; n++) {
                            formatted[row] += ' ';
                        }
                    }
                    else if (front === '-' && end === ':') {
                        // 右揃え
                        for(let n = 0; n < maxWidths[i] - celldata_length; n++) {
                            formatted[row] += ' ';
                        }
                        formatted[row] += celldata;
                    }
                    else {
                        // 左揃え
                        formatted[row] += celldata;
                        for(let n = 0; n < maxWidths[i] - celldata_length; n++) {
                            formatted[row] += ' ';
                        }
                    }
                }
                else {
                    // データ
                    formatted[row] += celldata;
                    // 余白を半角スペースで埋める
                    for(let n = celldata_length; n < maxWidths[i]; n++) {
                        formatted[row] += ' ';
                    }
                }
                // | の前にスペースを入れる
                formatted[row] += ' ';
            }
            formatted[row] += '|';

            // あまりデータを末尾に着ける
            if (this.leftovers[row].length > 0) {
                formatted[row] += this.leftovers[row];
            }
        }

        // 1行目を成形する
        let columnHeader = '';
        columnHeader += this.indent;
        for (let i = 0; i < columnNum; i++) {
            const columnText = this.columns[i].trim();
            const columnHeader_length = this.getLen(columnText);

            columnHeader += '| ';
            if (alignHeader) {
                let [front, end] = this.aligns[i];
                if (front === ':' && end === ':') {
                    // 中央ぞろえ
                    for(let n = 0; n < (maxWidths[i] - columnHeader_length) / 2 - 0.5; n++) {
                        columnHeader += ' ';
                    }
                    columnHeader += columnText;
                    for(let n = 0; n < (maxWidths[i] - columnHeader_length) / 2; n++) {
                        columnHeader += ' ';
                    }
                }
                else if (front === '-' && end === ':') {
                    // 右揃え
                    for(let n = 0; n < maxWidths[i] - columnHeader_length; n++) {
                        columnHeader += ' ';
                    }
                    columnHeader += columnText;
                }
                else {
                    // 左揃え
                    columnHeader += columnText;
                    for(let n = 0; n < maxWidths[i] - columnHeader_length; n++) {
                        columnHeader += ' ';
                    }
                }

            }
            else {
                columnHeader += columnText;
                // 余白を-で埋める
                for(let n = columnHeader_length; n < maxWidths[i]; n++) {
                    columnHeader += ' ';
                }
            }
            columnHeader += ' ';
        }
        columnHeader += '|';


        // 2行目を成形する
        let tablemark = '';
        tablemark += this.indent;
        for (let i = 0; i < columnNum; i++) {
            let [front, end] = this.aligns[i];
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

    // 半角文字は1文字、全角文字は2文字として文字数をカウントする
    public getLen(str :string) :number {
        let length = 0;
        for(let i=0; i<str.length; i++) {
            let chp = str.codePointAt(i);
            if (chp === undefined) {
                continue;
            }
            let chr = chp as number;
            if (this.doesUse0Space(chr)) {
                length += 0;
            }
            else if (this.doesUse3Spaces(chr)) {
                length += 3;
            }
            else if (this.doesUse2Spaces(chr)) {
                // 全角文字の場合は2を加算
                length += 2;
            }
            else {
                //それ以外の文字の場合は1を加算
                length += 1;
            }

            let chc = str.charCodeAt(i);
            if (chc >= 0xD800 && chc <= 0xDBFF) {
                // サロゲートペアの時は1文字読み飛ばす
                i++;
            }

            // if( (chr >= 0x00 && chr <= 0x80) ||
            //     (chr >= 0xa0 && chr <= 0xff) ||
            //     (chr === 0xf8f0) ||
            //     (chr >= 0xff61 && chr <= 0xff9f) ||
            //     (chr >= 0xf8f1 && chr <= 0xf8f3)){
            //     //半角文字の場合は1を加算
            //     length += 1;
            // }else{
            //     //それ以外の文字の場合は2を加算
            //     length += 2;
            // }
        }
        //結果を返す
        return length;
    };

    private doesUse0Space(charCode :number): boolean {
        if ((charCode === 0x02DE) || 
            (charCode >= 0x0300 && charCode <= 0x036F) ||
            (charCode >= 0x0483 && charCode <= 0x0487) ||
            (charCode >= 0x0590 && charCode <= 0x05CF) ) {
            return true;
        }
        return false;
    }

    private doesUse2Spaces(charCode :number): boolean {
        if ((charCode >= 0x2480 && charCode <= 0x24FF) ||
            (charCode >= 0x2600 && charCode <= 0x27FF) ||
            (charCode >= 0x2900 && charCode <= 0x2CFF) ||
            (charCode >= 0x2E00 && charCode <= 0xFF60) ||
            (charCode >= 0xFFA0) ) {
            return true;
        }
        return false;
    }

    private doesUse3Spaces(charCode :number): boolean {
        if (charCode >= 0x1F300 && charCode <= 0x1FBFF) {
            return true;
        }
        return false;
    }



    // return [line, character]
    public getPositionOfCell(cellRow :number, cellColumn :number, isInFormatStr :boolean) : [number, number] {
        let line = (cellRow <= 0) ? 0 : cellRow;

        let lines = isInFormatStr ? this.toFormatTableStr().split(/\r\n|\n|\r/) : this.toString().split(/\r\n|\n|\r/);
        let linestr = lines[cellRow];

        let cells = splitline(linestr, this.columns.length);

        let character = 0;
        character += this.indent.length;
        character += 1;
        for (let i = 0; i < cellColumn; i++) {
            character += cells[i].length;
            character += 1;
        }

        return [line, character];
    }

    // return [row, column]
    public getCellAtPosition(line :number, character :number, isInFormatStr :boolean) {
        let row = (line <= 0) ? 0 : line;

        let lines = isInFormatStr ? this.toFormatTableStr().split(/\r\n|\n|\r/) : this.toString().split(/\r\n|\n|\r/);
        let linestr = lines[row];

        let cells = splitline(linestr, this.columns.length);

        let column = -1;
        let cell_end = this.indent.length;
        for (let cell of cells) {
            column ++;
            cell_end += 1 + cell.length;

            if(character <= cell_end) {
                break;
            }
        }

        return [row, column];
    }

    public getCellData(cellRow :number, cellColumn :number) : string {
        if(cellRow === 0) {
            return (this.columns.length > cellColumn) ? this.columns[cellColumn] : "";
        }
        if(cellRow === 1) {
            if(this.aligns.length <= cellColumn) {
                return "---";
            }
            let [front, end] = this.aligns[cellColumn];
            return ' ' + front + '-' + end + ' ';
        }
        if(cellRow >= this.cells.length+2) {
            return "";
        }

        return this.cells[cellRow-2][cellColumn];
    }
};

export class MarkdownTable {
    public stringToTableData(tableText :string) :TableData {
        let lines = tableText.split(/\r\n|\n|\r/);
        
        let getIndent = (linestr: string) => {
            if (linestr.trim().startsWith('|')) {
                let linedatas = linestr.split('|');
                return linedatas[0];
            }
            else {
                return '';
            }
        };

        // 1行目
        let columns = splitline(lines[0], 0);
        let columnNum = columns.length;
        let indent = getIndent(lines[0]);

        // 2行目の寄せ記号
        let aligns : [string, string][] = new Array();
        let aligndatas = splitline(lines[1], columnNum, '---').map((v)=> v.trim());
        for (let i = 0; i < columnNum; i++) {
            let celldata = aligndatas[i];
            aligns[i] = [celldata[0], celldata.slice(-1)];
        }

        // セルの値を取得
        let cells : string [][] = new Array();
        let leftovers : string[] = new Array();
        let cellrow = -1;
        for (let row = 2; row < lines.length; row++) {
            cellrow++;

            let linedatas = splitline(lines[row], columnNum);
            cells[cellrow] = linedatas.slice(0, columnNum);

            // あまりデータを収集する
            leftovers[cellrow] = '';
            if (linedatas.length > columnNum)
            {
                let leftoverdatas = linedatas.slice(columnNum, linedatas.length);
                leftovers[cellrow] = leftoverdatas.join('|');
            }
        }
        
        return new TableData(tableText, aligns, columns, cells, leftovers, indent);
    }

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
        let leftovers : string[] = new Array();
        for (let row = 1; row < lines.length; row++) {
            // 各セルの値
            cells[row - 1] = new Array();
            // 行内のデータが足りない場合に備えて空白文字で埋める
            for (let column = 0; column < columnCount; column++) {
                cells[row - 1][column] = ' ';
            }

            // 余りデータを初期化
            leftovers[row - 1] = '';

            // 行データをタブで分割
            let lineValues = lines[row].split('\t');

            // 実際の値に置き換える
            for (let column = 0; column < lineValues.length; column++) {
                if(column >= columnCount){
                    // カラムヘッダーよりも多い場合ははみ出しデータ配列に保存
                    leftovers[row - 1] += '\t' + lineValues[column];
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

        const table = new TableData("", aligns, columns, cells, leftovers, '');
        return new TableData(table.toFormatTableStr(), aligns, columns, cells, leftovers, '');
    }

    public insertRow(tableData :TableData, insertAt :number) : TableData {
        const columns = tableData.columns;
        const aligns = tableData.aligns;
        const cells = tableData.cells;
        const leftovers = tableData.leftovers;
        const column_num = tableData.columns.length;
        const indent = tableData.indent;

        cells.splice(insertAt, 0, Array.from({length: column_num}, () => '  '));
        leftovers.splice(insertAt, 0, '');
        
        const text = tableData.toString() + '\n' + tableData.indent + '|' + '  |'.repeat(tableData.columns.length);

        return new TableData(text, aligns, columns, cells, leftovers, indent);
    }

    public insertColumn(tableData :TableData, insertAt :number) : TableData {
        let columns = tableData.columns;
        let aligns = tableData.aligns;
        let cells = tableData.cells;
        let leftovers = tableData.leftovers;
        let column_num = tableData.columns.length;
        let indent = tableData.indent;

        columns.splice(insertAt, 0, '');
        aligns.splice(insertAt, 0, ['-', '-']);
        for (let i = 0; i < cells.length; i++)
        {
            cells[i].splice(insertAt, 0, '');
        }

        const table = new TableData("", aligns, columns, cells, leftovers, indent);
        return new TableData(table.toFormatTableStr(), aligns, columns, cells, leftovers, indent);
    }
}
