import { TextDocument } from 'vscode';

export class SupportLanguage {
    public static isSupportedLanguage(document: TextDocument | undefined): boolean {
        if (!document || document.languageId === null) {
            return false;
        }
        return (document.languageId === 'markdown' || document.languageId === 'mdx' || document.languageId === 'quarto');
    }
}
