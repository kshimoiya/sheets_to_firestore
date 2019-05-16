abstract class Sheet {
  constructor(
    protected name: string,
    protected spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    // 値の範囲選択のスタート座標
    protected row: number,
    protected column: number,
    // 入力データ件数
    protected size: number,
  ) {}
}

export class InputSheet extends Sheet {
  private input: string = 'Input';

  constructor(
    name: string, 
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    // 値の範囲選択のスタート座標
    row: number,
    column: number,
    // IDセル指定文字列
    private id: string,
    // 入力データ件数
    size: number,
  ) {
      super(name, spreadSheet, row, column, size);
  }

  public getId(): string {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.input}`);
    let value = sheet.getRange(this.id).getValue();

    Logger.log(value);
    return value as string;
  }

  public setInputData(id: string, data: any[]) {
    // TODO: リストのデータを反映する
  }

  public getInputData(): any[] {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.input}`);
    let values = sheet.getRange(this.row, this.column, this.size).getValues();

    var result = [];
    if(values.length === 0)
      return result;

    for (let index = 0; index < values.length; index++) {
      const element = values[index][0];

      if(element === '')
        return [];

      result.push(element);
    }

    Logger.log(result);
    return result;
  }
}

export class ListSheet extends Sheet {
  private list: string = 'List';

  constructor(
    name: string, 
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    // 値の範囲選択のスタート座標
    row: number,
    column: number,
    private columnString: string,
    // 入力データ件数
    size: number,
  ) {
    super(name, spreadSheet, row, column, size);
  }

  private getLastRow(): number {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    var columnVals = sheet.getRange(`${this.columnString}:${this.columnString}`).getValues();
    return columnVals.filter(String).length - 1;
  }

  private getDuplicatedRow(id: string): number {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    var columnVals = sheet.getRange(`${this.columnString}:${this.columnString}`).getValues();
    for (let index = 0; index < columnVals.length; index++) {
      if (columnVals[index][0] === id)
        return index;      
    }
    return 0;
  }

  public isDuplicateId(id: string): boolean {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    let lastRow = this.getLastRow();

    if (lastRow <= 0)
      return false;
    
    // 開始セル C2 => (2, 3)
    // 個数 (最終行-header行 個, header列-(空欄列+No列) 個)
    let list = sheet.getRange(this.row, this.column, lastRow, sheet.getLastColumn() - this.column + 1).getValues();

    let overlap = list.some(function(array, index, list) {
      return (array[0] === id);
    });

    if(overlap) {
      return true;
    }

    return false;
  }

  public getDataByRow(row: number): Object[] {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    return sheet.getRange(row, this.column, 1, this.size).getValues()[0];
  }

  public addData(data: any[]) {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    let id = Utilities.getUuid();
    data.unshift(id);
    let lastRow = this.getLastRow();

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      sheet.getRange(lastRow + 2, this.column + index).setValue(element);
    }
  }

  public updateData(id: string, data: any[]) {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    let duplicateRow = this.getDuplicatedRow(id);
    data.unshift(id);

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      sheet.getRange(duplicateRow + 1, this.column + index).setValue(element);
    }
  }

  public deleteData(id: string) {}

  public getAllDataConvertFirestore(): object {
    let sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    let keys = sheet.getRange(this.row -1, this.column, 1, this.size).getValues()[0] as string[];
    let lastRow = this.getLastRow();
    if (lastRow === 0)
      return [];

    let rowValues = [];
    for (let index = 2; index <= lastRow + 1; index++) {
      let item = this.getDataByRow(index);
      rowValues.push(item);
    }

    let items = [];
    for (let index = 0; index < rowValues.length; index++) {
      const rowData = rowValues[index];
      let item = new Object();
      for (let x = 0; x < keys.length; x++) {
        item[keys[x]] = rowData[x];
      }
      items.push(item);
    }

    Logger.log(items);
    return items;
  }
}