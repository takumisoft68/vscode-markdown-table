# Markdown Table

Markdown table features.

## 1. Features

| Title                                   | Command                             | Default Keybinding | In the Editor Right Click Menu      |
| :-------------------------------------- | :---------------------------------- | :----------------- | :---------------------------------- |
| Format all tables.                      | markdowntable.format                | Shift + Alt + F    | Yes                                 |
| Convert TSV to table.                   | markdowntable.tsvToTable            | Shift + Alt + T    | Yes (only when selecting range)     |
| Navigate to next cell.                  | markdowntable.nextCell              | Tab                | No                                  |
| Navigate to previous cell.              | markdowntable.prevCell              | Shift + Tab        | No                                  |
| Navigate to next cell (w/o format).     | markdowntable.nextCellWithoutFormat |                    | No                                  |
| Navigate to previous cell (w/o format). | markdowntable.prevCellWithoutFormat |                    | No                                  |
| Insert column in the right.             | markdowntable.insertRight           |                    | Yes (only when not selecting range) |
| Insert column in the left.              | markdowntable.insertLeft            |                    | Yes (only when not selecting range) |
| Align to Left.                          | markdowntable.alignLeft             |                    | Yes                                 |
| Align to Center.                        | markdowntable.alignCenter           |                    | Yes                                 |
| Align to Right.                         | markdowntable.alignRight            |                    | Yes                                 |

---

## 2. Demo

### 2.1. Navigate to next cell (with auto format & auto insert row)

Key binding to `Tab`.

- **Auto navigate to next cell when pressing Tab key in table.**
    - When out of table, vscode's default "tab" behavior is operated.
- **Auto insert new row, when the cursor is in last row in table.**
- with auto format
    - ![navigate](images/navigate_next_cell.gif)

#### 2.1.1 Without auto format

- Use markdowntable.nextCellWithoutFormat command
- If you want, you need to assign this command to some key binding by yourself.

### 2.2. Navigate to prev cell

Key binding to `Shift`+`Tab`.

- **Auto navigate to prev cell when pressing Shift+Tab key in table.**
    - When out of table, vscode's default "outdent" behavior is operated.
- with auto format
    - ![navigate_prev](images/navigate_prev_cell.gif)

#### 2.2.1 Without auto format

- Use markdowntable.prevCellWithoutFormat command
- If you want, you need to assign this command to some key binding by yourself.

### 2.3. Convert to table from TSV text

Key binding to `Shift + Alt + T`.

- **Tips: This feature is supposed to make table from excel cells.**
    - ![convert](images/table_from_excel.gif)

### 2.4. Align column/columns

- **Align column to left/center/right.**
    - ![align](images/align_column.gif)

- **Align selected multi columns at once.**
    - ![align](images/align_columns_at_once.gif)

### 2.5. Format table

Key binding to `Shift + Alt + F`.

- **Auto format column width of all tables in current document**
    - ![formattable](images/format_table.gif)

### 2.6. Insert column

- Add context menu to insert column
    - ![insert](images/insert.gif)

## 3. Extension Settings

This extension has no settings.

## 4. Policy

What's focused on.

- As minimal
    - Not enhance or change markdown syntax spec.
    - Not implement features they can be done by vscode's box selection.
        - [https://code.visualstudio.com/docs/editor/codebasics#_column-box-selection](https://code.visualstudio.com/docs/editor/codebasics#_column-box-selection)
- Support full-width characters
    - Because author is Japanese

## 5. Release Notes

### 5.1. - 0.3.0 (2020/10/27)

- [Add] Align column/columns commands

## 6. Links

- [Source Code](https://github.com/takumisoft68/vscode-markdown-table)
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=TakumiI.markdowntable)
