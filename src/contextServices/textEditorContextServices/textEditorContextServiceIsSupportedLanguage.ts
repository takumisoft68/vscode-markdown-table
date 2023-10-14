import { ExtensionContext, Selection, TextDocument, window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { AbsTextEditorContextService } from "./iTextEditorContextService";

export class TextEditorContextServiceIsSupportedLanguage extends AbsTextEditorContextService {
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
