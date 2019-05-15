import { Register } from './Item';

var ss = SpreadsheetApp.getActiveSpreadsheet();

function onOpen() {
  const menuName = 'カスタムメニュー';
  const subMenuName = 'サブメニュー';
  const item1 = 'item1';
  const item2 = 'item2';

  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu(menuName);
  var subMenu1 = ui.createMenu(subMenuName + '1');
  subMenu1.addItem(item1, 'setDataRegistration');
  subMenu1.addItem(item2, 'setDataRegistration');
  var subMenu2 = ui.createMenu(subMenuName + '2');
  subMenu2.addItem(item1, 'setDataRegistration');
  subMenu2.addItem(item2, 'setDataRegistration');
  menu.addSubMenu(subMenu1);
  menu.addSubMenu(subMenu2);

  menu.addToUi();
}

function setDataRegistration() {
  var register = new Register('Book',2,3,'C',ss,'C4');  
  var lastRow = register.getLastRow();
  Logger.log(lastRow);
}

function idConfirmation(id: string, lastRow: number): boolean {
  var sheet = ss.getSheetByName('BookList');

  if (lastRow <= 1)
    return false;
  
  // 開始セル C2 => (2, 3)
  // 個数 (最終行-header行 個, header列-(空欄列+No列) 個)
  var list = sheet.getRange(2, 3, lastRow - 1, sheet.getLastColumn() - 2).getValues();

  Logger.log(list);
  return true;
}