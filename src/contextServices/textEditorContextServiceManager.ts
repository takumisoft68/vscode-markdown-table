import { ExtensionContext, window, Disposable } from 'vscode';
import { ITextEditorContextService } from "./textEditorContextServices/iTextEditorContextService";
import { TextEditorContextServiceCursorInTable } from "./textEditorContextServices/textEditorContextServiceCursorInTable";
import { TextEditorContextServiceIsSupportedLanguage } from "./textEditorContextServices/textEditorContextServiceIsSupportedLanguage";

export class TextEditorContextServiceManager implements Disposable {
    private readonly contextServices: Array<ITextEditorContextService> = [];

    public constructor() {
        // push context services
        this.contextServices.push(new TextEditorContextServiceCursorInTable("markdowntable.contextkey.selection.InMarkdownTable"));
        this.contextServices.push(new TextEditorContextServiceIsSupportedLanguage("markdowntable.contextkey.active.IsSupportedLanguage"));
    }

    public activate(context: ExtensionContext) {
        for (const service of this.contextServices) {
            service.onActivate(context);
        }
        // subscribe update handler for context
        context.subscriptions.push(
            window.onDidChangeActiveTextEditor(() => this.onDidChangeActiveTextEditor()),
            window.onDidChangeTextEditorSelection(() => this.onDidChangeTextEditorSelection())
        );
    }

    public dispose(): void {
        while (this.contextServices.length > 0) {
            const service = this.contextServices.pop();
            service!.dispose();
        }
    }

    private onDidChangeActiveTextEditor() {
        const editor = window.activeTextEditor;
        if (editor === undefined) {
            for (const service of this.contextServices) {
                service.onDidChangeActiveTextEditor(undefined, undefined);
            }
            return;
        }

        const selection = editor.selection;
        const document = editor.document;

        for (const service of this.contextServices) {
            service.onDidChangeActiveTextEditor(document, selection);
        }
    }

    private onDidChangeTextEditorSelection() {
        const editor = window.activeTextEditor;
        if (editor === undefined) {
            return;
        }

        const selection = editor.selection;
        const document = editor.document;

        for (const service of this.contextServices) {
            service.onDidChangeTextEditorSelection(document, selection);
        }
    }
}
