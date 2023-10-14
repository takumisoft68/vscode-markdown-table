import { ExtensionContext, Selection, TextDocument, window, StatusBarItem, StatusBarAlignment, TextEditor, TextEditorSelectionChangeEvent } from 'vscode';
import { ContextService } from "./contextService";
import * as textUtility from "../textUtility";

export class TextEditorContextServiceCursorInTable extends ContextService {
    private statusBarItem: StatusBarItem | undefined = undefined;
    private readonly defaultVal: boolean;

    constructor(contextName: string, defaultVal: boolean) {
        super(contextName);
        this.defaultVal = defaultVal;
    }

    public onActivate(context: ExtensionContext) {
        super.onActivate(context);

        // set initial state of context
        this.setState(this.defaultVal);

        if(this.isDebugMode()) {
            // create a new status bar item that we can now manage
            this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 10000);
            context.subscriptions.push(this.statusBarItem);
        }
    }

    public onDidChangeActiveTextEditor(editor: TextEditor | undefined): void {
        super.onDidChangeActiveTextEditor(editor);
        this.updateContextState(editor);
    }

    public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent): void {
        super.onDidChangeTextEditorSelection(event);
        this.updateContextState(event.textEditor);
    }

    private isDebugMode(): boolean {
        return process.env.VSCODE_DEBUG_MODE === "true";
    }

    private updateContextState(editor: TextEditor | undefined) {
        const document = editor?.document;
        const selection = editor?.selection;
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
