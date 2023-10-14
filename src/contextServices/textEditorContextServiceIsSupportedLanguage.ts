import { ExtensionContext, Selection, TextDocument, window, StatusBarItem, StatusBarAlignment, TextEditor, TextEditorSelectionChangeEvent } from 'vscode';
import { ContextService } from "./contextService";

export class TextEditorContextServiceIsSupportedLanguage extends ContextService {
    private statusBarItem: StatusBarItem | undefined;
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
        var isSupported = this.isSupportedLanguage(document);

        if (isSupported) {
            this.setState(true);
    
            if (this.statusBarItem && document) {
                this.statusBarItem.text = `$(circle-large-filled) doc.languageId is ` + document.languageId;
                this.statusBarItem.tooltip = `supported language`;
                this.statusBarItem.show();
            }
        } else {
            this.setState(false);
    
            if (this.statusBarItem && document) {
                this.statusBarItem.text = `$(circle-slash) doc.languageId is ` + document.languageId;
                this.statusBarItem.tooltip = `not supported language`;
                this.statusBarItem.show();
            }
            else if (this.statusBarItem && !document) {
                this.statusBarItem.text = `$(circle-slash) document is undefined`;
                this.statusBarItem.tooltip = `not supported language`;
                this.statusBarItem.show();
            }
        }
    }

    private isSupportedLanguage(document: TextDocument | undefined): boolean {
        if(!document || document.languageId === null) {
            return false;
        }
        return (document.languageId === 'markdown' || document.languageId === 'mdx' || document.languageId === 'quarto');
    }
}
