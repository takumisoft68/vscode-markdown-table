import { ExtensionContext, window, Disposable, ConfigurationChangeEvent, TextEditor, TextEditorSelectionChangeEvent, workspace } from 'vscode';
import { ContextService } from "./contextService";
import { TextEditorContextServiceCursorInTable } from "./textEditorContextServiceCursorInTable";
import { TextEditorContextServiceIsSupportedLanguage } from "./textEditorContextServiceIsSupportedLanguage";
import { WorkspaceBooleanConfigurationContextService } from "./workspaceBooleanConfigurationContextService";

export class ContextServiceManager implements Disposable {
    private readonly contextServices: Array<ContextService> = [];

    public constructor() {
        // push context services
        this.contextServices.push(
            new TextEditorContextServiceCursorInTable("markdowntable.contextkey.selection.InMarkdownTable", false),
            new TextEditorContextServiceIsSupportedLanguage("markdowntable.contextkey.active.IsSupportedLanguage", false),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.format", 'markdowntable.showMenu.format'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.tsvToTable", 'markdowntable.showMenu.tsvToTable'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.csvToTable", 'markdowntable.showMenu.csvToTable'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.insertRight", 'markdowntable.showMenu.insertRight'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.insertLeft", 'markdowntable.showMenu.insertLeft'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.alignLeft", 'markdowntable.showMenu.alignLeft'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.alignCenter", 'markdowntable.showMenu.alignCenter'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.alignRight", 'markdowntable.showMenu.alignRight'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.moveLeft", 'markdowntable.showMenu.moveLeft'),
            new WorkspaceBooleanConfigurationContextService("markdowntable.contextkey.config.showMenu.moveRight", 'markdowntable.showMenu.moveRight'),
        );
    }

    public activate(context: ExtensionContext) {
        for (const service of this.contextServices) {
            service.onActivate(context);
        }
        // subscribe update handler for context
        context.subscriptions.push(
            window.onDidChangeActiveTextEditor((editor) => this.onDidChangeActiveTextEditor(editor)),
            window.onDidChangeTextEditorSelection((event) => this.onDidChangeTextEditorSelection(event)),
            workspace.onDidChangeConfiguration((event) => this.onDidChangeConfiguration(event))
        );
    }

    public dispose(): void {
        while (this.contextServices.length > 0) {
            const service = this.contextServices.pop();
            service!.dispose();
        }
    }

    private onDidChangeActiveTextEditor(editor: TextEditor | undefined): void {
        for (const service of this.contextServices) {
            service.onDidChangeActiveTextEditor(editor);
        }
    }

    private onDidChangeTextEditorSelection(event: TextEditorSelectionChangeEvent): void {
        for (const service of this.contextServices) {
            service.onDidChangeTextEditorSelection(event);
        }
    }

    private onDidChangeConfiguration(event: ConfigurationChangeEvent): void {
        for (const service of this.contextServices) {
            service.onDidChangeConfiguration(event);
        }
    }
}
