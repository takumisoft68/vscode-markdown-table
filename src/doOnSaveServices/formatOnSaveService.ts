import { ExtensionContext, window, Disposable, TextDocumentWillSaveEvent, commands, workspace } from 'vscode';
import { SupportLanguage } from '../definitions/supportLanguage';

export class FormatOnSaveService implements Disposable {

    public constructor() { }

    public activate(context: ExtensionContext) {
        context.subscriptions.push(
            workspace.onWillSaveTextDocument((event) => this.onWillSaveTextDocument(event))
        );
    }

    public dispose(): void { }

    private onWillSaveTextDocument(event: TextDocumentWillSaveEvent): void {
        let isSupportedLanguage = SupportLanguage.isSupportedLanguage(event.document);
        if (!isSupportedLanguage) {
            return;
        }

        let formatOnSave = <boolean>workspace.getConfiguration("markdowntable").get("formatOnSave");
        if (!formatOnSave) {
            return;
        }

        commands.executeCommand("markdowntable.format");
    }
}
