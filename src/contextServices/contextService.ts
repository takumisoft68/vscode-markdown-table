import { Disposable, commands, ExtensionContext, ConfigurationChangeEvent, TextEditor, TextEditorSelectionChangeEvent  } from 'vscode';

export class ContextService implements Disposable {
    constructor(contextName: string) {
        this.contextName = contextName;
    }

    protected readonly contextName: string;

    /**
     * activate context service
     * @param context ExtensionContext
     */
    public onActivate(context: ExtensionContext): void { }

    /**
     * Dispose this object.
     * Override this method to dispose objects those the extend class has.
     */
    public dispose(): void { }

    /**
     * Default handler of onDidChangeActiveTextEditor, do nothing.
     * Override this method to handle that event to update context state.
     */
    public onDidChangeActiveTextEditor(editor: TextEditor | undefined): void { }

    /**
    * default handler of onDidChangeTextEditorSelection, do nothing.
    * Override this method to handle that event to update context state.
    */
    public onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent): void { }

    /**
     * Default handler of an event that is emitted when the {@link WorkspaceConfiguration configuration} changed.
     * Override this method to handle that event to update context state.
     */
    public onDidChangeConfiguration(event: ConfigurationChangeEvent): void { }

    /**
     * set state of context
     */
    protected setState(state: any) {
        commands.executeCommand('setContext', this.contextName, state);
    }
}
