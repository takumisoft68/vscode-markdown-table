import { ExtensionContext, Selection, TextDocument, TextEditor, window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { AbsTextEditorContextService } from "./iTextEditorContextService";
import * as textUtility from '../../textUtility';

export class TextEditorContextServiceCursorInTable extends AbsTextEditorContextService {
    private statusBarItem: StatusBarItem | undefined;

    public onActivate(context: ExtensionContext) {
        // set initial state of context
        this.setState(false);

        if(this.isDebugMode()) {
            // create a new status bar item that we can now manage
            this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 10000);
            context.subscriptions.push(this.statusBarItem);
        }
    }

    public dispose(): void { }

    public onDidChangeActiveTextEditor(document: TextDocument | undefined, selection: Selection | undefined) {
        this.updateContextState(document, selection);
    }

    public onDidChangeTextEditorSelection(document: TextDocument | undefined, selection: Selection | undefined) {
        this.updateContextState(document, selection);
    }

    private isDebugMode(): boolean {
        return process.env.VSCODE_DEBUG_MODE === "true";
    }

    private updateContextState(document: TextDocument | undefined, selection: Selection | undefined) {
        const isInTable = this.isInTable(document, selection);

        if (isInTable) {
            this.setState(true);
    
            if (this.statusBarItem) {
                this.statusBarItem.text = `$(circle-large-filled) in the table`;
                this.statusBarItem.tooltip = `cursor is in the table`;
                this.statusBarItem.show();
            }
        } else {
            this.setState(false);
    
            if (this.statusBarItem) {
                this.statusBarItem.text = `$(circle-slash) out of table`;
                this.statusBarItem.tooltip = `cursor is out of table`;
                this.statusBarItem.show();
            }
        }
    }
    
    private isInTable(document: TextDocument | undefined, selection: Selection | undefined) {
        if(!document || document.languageId === null) {
            return false;
        }
    
        if(document.languageId !== 'markdown' && document.languageId !== 'mdx' && document.languageId !== 'quarto') {
            return false;
        }

        if (!selection) {
            return false;
        }

        // 選択範囲取得
        let inTable: boolean = true;
        for (let linenum = selection.start.line; linenum <= selection.end.line; linenum++) {
            const line_text = document.lineAt(linenum).text;
            if (!textUtility.isInTable(line_text)) {
                inTable = false;
                break;
            }
        }

        return inTable;
    }
}
