abstract class Sheet {
  constructor(
    private name: string,
    private spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  ) {}
}

export class InputSheet extends Sheet {
  private input: string = 'Input';

  constructor(name: string, spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
      super(name, spreadSheet);
  }

/**
  public getId(): string {
    var sheet = this.spreadSheet.getSheetByName(`${this.regist}${this.name}`);
    var range = sheet.getRange(this.idRange);
    var input = range.getValue();
  
    return input as string;
  }

  public getLastRow(): number {
    var sheet = this.spreadSheet.getSheetByName(`${this.name}${this.list}`);
    var columnCVals = sheet.getRange(`${this.startColumnString}:${this.startColumnString}`).getValues();
    return columnCVals.filter(String).length;
  }
 */
}
