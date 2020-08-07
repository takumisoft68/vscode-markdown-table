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

export class MarkdownTable {


    public stringToTableData(tableText :string) :TableData {
        let lines = tableText.split(/\r\n|\n|\r/);
        
        // 行文字列をセルデータ配列に分解する
        // datasNumMin に指定したデータ数に満たない行は '' で埋める
        let splitline = (linestr: string, datasNumMin :number, fillstr :string = '') => {
            linestr = linestr.trim();
            if (linestr.startsWith('|')) {
                linestr = linestr.slice(1);
            }
            if (linestr.endsWith('|')) {
                linestr = linestr.slice(0, -1);
            }
            let linedatas =linestr.split('|');

            // 最低データ数分を''で埋めておく
            let datas : string[] = new Array(datasNumMin).fill(fillstr);
            // 行文字列から取得したデータに置き換える
            for (let i = 0; i < linedatas.length; i++) {
                datas[i] = linedatas[i];
            }
            return datas;
        };

        // 1行目
        let columns = splitline(lines[0], 0).map((v)=> v.trim());
        let columnNum = columns.length;

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
            cells[cellrow] = linedatas.slice(0, columnNum).map((v)=> v.trim());

            // あまりデータを収集する
            leftovers[cellrow] = '';
            if (linedatas.length > columnNum)
            {
                let leftoverdatas = linedatas.slice(columnNum, linedatas.length);
                leftovers[cellrow] = leftoverdatas.join('|');
            }
        }
        
        return new TableData(aligns, columns, cells, leftovers);
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

        return new TableData(aligns, columns, cells, leftovers);
    }

    public tableDataToTableStr(data :TableData) : string {
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
            if( (chr >= 0x00 && chr <= 0x80) ||
                (chr >= 0xa0 && chr <= 0xff) ||
                (chr === 0xf8f0) ||
                (chr >= 0xff61 && chr <= 0xff9f) ||
                (chr >= 0xf8f1 && chr <= 0xf8f3)){
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

    public tableDataToFormatTableStr(tableData :TableData) :string {
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
            for (let i = 0; i < columnNum; i++) {
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
            if (tableData.leftovers[row].length > 0) {
                formatted[row] += tableData.leftovers[row];
            }
        }

        // 1行目を成形する
        let columnHeader = '';
        for (let i = 0; i < columnNum; i++) {
            columnHeader += '| ' + tableData.columns[i];
            let columnHeader_length = this.getLen(tableData.columns[i]);

            // 余白を-で埋める
            for(let n = columnHeader_length; n < maxWidths[i]; n++) {
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

    public insertRow(tableData :TableData, insertAt :number) : TableData {
        let columns = tableData.columns;
        let aligns = tableData.aligns;
        let cells = tableData.cells;
        let leftovers = tableData.leftovers;
        let column_num = tableData.columns.length;

        cells.splice(insertAt, 0, Array.from({length: column_num}, () => ''));
        leftovers.splice(insertAt, 0, '');
        
        return new TableData(aligns, columns, cells, leftovers);
    }

    public insertColumn(tableData :TableData, insertAt :number) : TableData {
        let columns = tableData.columns;
        let aligns = tableData.aligns;
        let cells = tableData.cells;
        let leftovers = tableData.leftovers;
        let column_num = tableData.columns.length;

        columns.splice(insertAt, 0, '');
        aligns.splice(insertAt, 0, ['-', '-']);
        for (let i = 0; i < cells.length; i++)
        {
            cells[i].splice(insertAt, 0, '');
        }

        return new TableData(aligns, columns, cells, leftovers);
    }

    // return [line, character]
    public getPositionOfCell(tableText :string, cellRow :number, cellColumn :number) : [number, number] {
        let line = (cellRow <= 0) ? 0 : cellRow;
        let character = 0;

        let lines = tableText.split(/\r\n|\n|\r/);
        let linestr = lines[line];
        let column = -1;
        for (let n = 0; n < linestr.length; n++) {
            if (linestr[n] === '|') {
                column++;
            }

            if (column >= cellColumn) {
                character = n + 1;
                break;
            }

            character = n;
        }

        return [line, character];
    }

    // return [row, column]
    public getCellAtPosition(tableText :string, line :number, character :number) {
        let row = (line <= 0) ? 0 : line;

        let lines = tableText.split(/\r\n|\n|\r/);
        let linestr = lines[line];

        let column = -1;

        for (let n = 0; n < character; n++) {
            if (linestr[n] === '|') {
                column++;
            }
        }

        return [row, column];
    }
}
