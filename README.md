# Markdown Table

Markdown table features.

## 1. Features

- Navigate to next cell
- Convert to table from TSV text
- Format all tables
- Insert column in the right
- Insert column in the left

## 2. Demo

### 2.1. Navigate to next cell (with auto insert row)

- **Auto navigate to next cell when you press tab key in table.**
- **Auto insert new row, when the cursor is in last row in table.**
- with auto format

Key binding to `Tab`.

![navigate](images/navigate_next_cell.gif)

### 2.2. Convert to table from TSV text

**Tips: This feature is supposed to make table from excel cells.**

Key binding to `Shift + Alt + T`.

![convert](images/table_from_excel.gif)

### 2.3. Format table

- **Auto format column width of all tables in current document**

Key binding to `Shift + Alt + F`.

![formattable](images/format_table.gif)

### 2.4. Insert column

![insert](images/insert.gif)

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

## 6. (2020/08/07)

- Treat "umlauts" as half-width character.

## 7. Links

- [Source Code](https://github.com/takumisoft68/vscode-markdown-table)
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=TakumiI.markdowntable)
