# Manually Tests

## 1. Key Binding Tests

### 1.1. working key binding

1. Make sure that "Key Binding" is working within the table
1. Make sure that the entire text in the cell is selected

| Title                      | Command                | Keybinding  |
| :------------------------- | :--------------------- | :---------- |
| Navigate to next cell.     | markdowntable.nextCell | Tab         |
| Navigate to previous cell. | markdowntable.prevCell | Shift + Tab |

### 1.2. default bahavior on out of table

1. Make sure that the command keybinding is not working on out of table

--------------------
text text text

- List item 1
- List item 2
- List item 3

1. Numbered list item 1
2. Numbered list item 2
3. Numbered list item 3

| column A | column B | column C | column D |
| :-- | :-- | :-- | :-- |
| data A1 | data B1 | data C1 | data D1 |
| data A2 data A2 | data B2  | data C2  | data D2  |
| data A3  | data B3 data B3 | data C3  | data D3  |
| data A4  | data B4  | data C4  | data D4  |
--------------------

## 2. Context Menu Visibility Tests

### 2.1. default

1. Make sure that the each visibilities of menus in the right-click context menu follows default configurations

| Configuration ID                   | Description                                                | Type    | Default |
| :--------------------------------- | :--------------------------------------------------------- | :------ | :------ |
| markdowntable.showMenu.format      | Show command in context menu, "Format all tables"          | boolean | true    |
| markdowntable.showMenu.tsvToTable  | Show command in context menu, "Convert TSV to table"       | boolean | true    |
| markdowntable.showMenu.csvToTable  | Show command in context menu, "Convert CSV to table"       | boolean | false   |
| markdowntable.showMenu.insertRight | Show command in context menu, "Insert column to the right" | boolean | true    |
| markdowntable.showMenu.insertLeft  | Show command in context menu, "Insert column to the left"  | boolean | true    |
| markdowntable.showMenu.alignLeft   | Show command in context menu, "Align to Left"              | boolean | true    |
| markdowntable.showMenu.alignCenter | Show command in context menu, "Align to Center"            | boolean | true    |
| markdowntable.showMenu.alignRight  | Show command in context menu, "Align to Right"             | boolean | true    |
| markdowntable.showMenu.moveLeft    | Show command in context menu, "Move to Left"               | boolean | true    |
| markdowntable.showMenu.moveRight   | Show command in context menu, "Move to Right"              | boolean | true    |

### 2.2. inverted

1. Set configurations as inverted
1. Make sure that the each visibilities of menus in the right-click context menu follows new configurations

| Configuration ID                   | Description                                                | Type    | Default |
| :--------------------------------- | :--------------------------------------------------------- | :------ | :------ |
| markdowntable.showMenu.format      | Show command in context menu, "Format all tables"          | boolean | false   |
| markdowntable.showMenu.tsvToTable  | Show command in context menu, "Convert TSV to table"       | boolean | false   |
| markdowntable.showMenu.csvToTable  | Show command in context menu, "Convert CSV to table"       | boolean | true    |
| markdowntable.showMenu.insertRight | Show command in context menu, "Insert column to the right" | boolean | false   |
| markdowntable.showMenu.insertLeft  | Show command in context menu, "Insert column to the left"  | boolean | false   |
| markdowntable.showMenu.alignLeft   | Show command in context menu, "Align to Left"              | boolean | false   |
| markdowntable.showMenu.alignCenter | Show command in context menu, "Align to Center"            | boolean | false   |
| markdowntable.showMenu.alignRight  | Show command in context menu, "Align to Right"             | boolean | false   |
| markdowntable.showMenu.moveLeft    | Show command in context menu, "Move to Left"               | boolean | false   |
| markdowntable.showMenu.moveRight   | Show command in context menu, "Move to Right"              | boolean | false   |

## 3. Options tests

### 3.1. default

1. Check that "Auto-format on save" is not working

| Configuration ID           | Description               | Type    | Default |
| :------------------------- | :------------------------ | :------ | :------ |
| markdowntable.formatOnSave | Format all tables on save | boolean | false   |

### 3.2. inverted

1. Set configurations as inverted
1. Check that "Auto-format on save" is working

| Configuration ID           | Description               | Type    | Default |
| :------------------------- | :------------------------ | :------ | :------ |
| markdowntable.formatOnSave | Format all tables on save | boolean | true    |

