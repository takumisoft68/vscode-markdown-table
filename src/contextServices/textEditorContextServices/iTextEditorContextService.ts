import { Disposable, commands, ExtensionContext, Selection, TextDocument } from 'vscode';

export interface ITextEditorContextService extends Disposable {
    onActivate(context: ExtensionContext): void;

    /**
     * handler of onDidChangeActiveTextEditor
     * implement this method to handle that event to update context state
     */
    onDidChangeActiveTextEditor(document: TextDocument | undefined, selection: Selection | undefined): void;
    /**
     * handler of onDidChangeTextEditorSelection
     * implement this method to handle that event to update context state
     */
    onDidChangeTextEditorSelection(document: TextDocument | undefined, selection: Selection | undefined): void;
}

export abstract class AbsTextEditorContextService implements ITextEditorContextService {
    constructor(contextName: string) {
        this.contextName = contextName;
    }

    protected readonly contextName: string;

    /**
     * activate context service
     * @param context ExtensionContext
     */
    public abstract onActivate(context: ExtensionContext): void;
    public abstract dispose(): void;

    /**
     * default handler of onDidChangeActiveTextEditor, do nothing.
     * override this method to handle that event to update context state.
     */
    public abstract onDidChangeActiveTextEditor(document: TextDocument | undefined, selection: Selection | undefined): void;

    /**
    * default handler of onDidChangeTextEditorSelection, do nothing.
    * override this method to handle that event to update context state.
    */
    public abstract onDidChangeTextEditorSelection(document: TextDocument | undefined, selection: Selection | undefined): void;

    /**
     * set state of context
     */
    protected setState(state: any) {
        commands.executeCommand('setContext', this.contextName, state);
    }
}
