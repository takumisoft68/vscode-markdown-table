# Change Log

All notable changes to the "markdowntable" extension will be documented in this file.

### 0.6.0 (2021/06/15)

- [Add] Support mdx
- [Fix] Activate earlier (Activate extension on markdown file is openning)

### 0.5.2 (2021/05/04)

- [Fix] zenkaku handling

### 0.5.1 (2021/03/19)

- [Fix] Readme only
    - Default value of configuration

### 0.5.0 (2021/03/19)

- [Add]
    - Align data and column header when formatting table
        - It can be disabled by configuration

### 0.4.2 (2021/01/13)

- [Fix]
    - Change supported vscode version to "upper than 1.40.0" from "upper than 1.50.0"

### 0.4.1 (2020/11/05)

- Readme update only

### 0.4.0 (2020/11/05)

- [Add] Navigate next/prev cell without auto format command.
- [Fix] Typo: "Insert Row" command should be "Insert Column".

### 0.3.0 (2020/10/27)

- [Add] Align column/columns commands
    - Align column to left/center/right.
    - ![align](images/align_column.gif)
    - Align selected multi columns at once.
    - ![align](images/align_columns_at_once.gif)

### 0.2.2 (2020/9/5)

- [Fix]
    - Tab key confliction with accepting suggestion or snippet.

### 0.2.1 (2020/9/2)

- [Fix] bugs of navigate to next/prev cell
    - Bahavior when Tab key pressing out of table.
    - Bahavior when Shift+Tab key pressing out of table.

### 0.2.0 (2020/9/1)

- [Fix] Keep white spaces indentation on the left of table when formatting.
    - before
    - ![keepindent_before](images/keep_indent_before.gif)
    - after
    - ![keepindent](images/keep_indent.gif)

- [Add] Navigate to prev cell when you press Shift+Tab key in table.
    - ![navigate_prev](images/navigate_prev_cell.gif)

### 0.1.1 (2020/08/07)

- [Fix] Treat "umlauts" as half-width character.

### 0.1.0 (2020/08/01)

- [Add] Navigate to next cell when you press Tab key in table.

### 0.0.2 (2020/07/23)

- Initial release
