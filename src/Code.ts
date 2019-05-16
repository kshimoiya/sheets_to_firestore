import { InputSheet, ListSheet } from './Item';

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
  subMenu1.addItem(item2, 'updateFirestore');
  var subMenu2 = ui.createMenu(subMenuName + '2');
  subMenu2.addItem(item1, 'setDataRegistration');
  subMenu2.addItem(item2, 'updateFirestore');
  menu.addSubMenu(subMenu1);
  menu.addSubMenu(subMenu2);

  menu.addToUi();
}

function setDataRegistration() {
  var inputSheet = new InputSheet('Item', ss, 6, 3, 'C4', 4);
  var id = inputSheet.getId();
  var data = inputSheet.getInputData();

  if (data.length === 0) {
    Browser.msgBox('未入力の項目があります。');
    return;
  }

  var listSheet = new ListSheet('Item', ss, 2, 3, 'C', 5);

  if (id !== '' && listSheet.isDuplicateId(id)) {
    let confirm = Browser.msgBox('重複しているデータがあります。上書きしますか？', Browser.Buttons.OK_CANCEL);
    if(confirm === 'ok') {
      listSheet.updateData(id, data);
    } else {
      Browser.msgBox('登録をキャンセルしました。');
    }
  } else {
    listSheet.addData(data);
  }
}

function updateFirestore() {
  var listSheet = new ListSheet('Item', ss, 2, 3, 'C', 5);
  listSheet.getAllDataConvertFirestore();
}