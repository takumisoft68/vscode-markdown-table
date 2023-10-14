import { ConfigurationChangeEvent, commands, ExtensionContext, workspace} from 'vscode';
import { ContextService } from "./contextService";

export class WorkspaceBooleanConfigurationContextService extends ContextService {
    private readonly configSectionDir: string;
    private readonly configSectionName: string;

    constructor(contextName: string, configSection: String) {
        super(contextName);
        this.configSectionDir = configSection.split('.').slice(0, -1).join('.');
        this.configSectionName = configSection.split('.').slice(-1)[0];
    }

    public onActivate(context: ExtensionContext) {
        super.onActivate(context);

        // set initial state of context
        let showMenuInsertToc = <boolean>workspace.getConfiguration(this.configSectionDir).get(this.configSectionName);
        this.setState(showMenuInsertToc);
    }

    public onDidChangeConfiguration(event: ConfigurationChangeEvent): void {
        super.onDidChangeConfiguration(event);
        if (event.affectsConfiguration(this.configSectionDir + "." + this.configSectionName)) {
            this.updateContextState();
        }
        return;
    }

    private updateContextState() {
        let showMenuInsertToc = <boolean>workspace.getConfiguration(this.configSectionDir).get(this.configSectionName);
        // console.debug("set " + this.contextName + " to " + showMenuInsertToc);
        this.setState(showMenuInsertToc);
    }
}
