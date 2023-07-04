import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.extractProblemsMessage', async () => {
        try {
            const diagnostics = vscode.languages.getDiagnostics();

            if (diagnostics.length === 0) {
                vscode.window.showInformationMessage("No problems detected.");
                return;
            }

            let messages: string[] = [];
            for (const diagnostic of diagnostics) {
                for (const item of diagnostic[1]) {
                    messages.push(item.message);
                }
            }

            const config = vscode.workspace.getConfiguration('extractProblemsMessage');
            const separator = config.get('separator', ', ');

            const output = messages.join(separator);
            await vscode.env.clipboard.writeText(output);

            vscode.window.showInformationMessage("Messages have been copied to the clipboard.");
        } catch (error: unknown) {
						const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
						vscode.window.showErrorMessage("An error occurred while extracting the messages: " + message);
				}
			
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
