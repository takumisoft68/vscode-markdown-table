# Markdown Table

Markdown table features.

## 1. Features

- Navigate to next/prev cell
- Convert to table from TSV text
- Format all tables
- Insert column in the right/left

## 2. Demo

### 2.1. Navigate to next cell (with auto insert row)

Key binding to `Tab`.

- **Auto navigate to next cell when pressing Tab key in table.**
    - When out of table, vscode's default "tab" behavior is operated.
- **Auto insert new row, when the cursor is in last row in table.**
- with auto format
    - ![navigate](images/navigate_next_cell.gif)

### 2.1. Navigate to prev cell

Key binding to `Shift`+`Tab`.

- **Auto navigate to prev cell when pressing Shift+Tab key in table.**
    - When out of table, vscode's default "outdent" behavior is operated.
- with auto format
    - ![navigate_prev](images/navigate_prev_cell.gif)

### 2.2. Convert to table from TSV text

Key binding to `Shift + Alt + T`.

- **Tips: This feature is supposed to make table from excel cells.**
    - ![convert](images/table_from_excel.gif)

### 2.3. Format table

Key binding to `Shift + Alt + F`.

- **Auto format column width of all tables in current document**
    - ![formattable](images/format_table.gif)

### 2.4. Insert column

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

### - 0.2.1 (2020/9/2)

- Fix bugs of navigate to next/prev cell
    - Bahavior when Tab key pressing out of table.
    - Bahavior when Shift+Tab key pressing out of table.

## 7. Links

- [Source Code](https://github.com/takumisoft68/vscode-markdown-table)
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=TakumiI.markdowntable)
