// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "todos-to-jira" is now active!');

  const getCurrentActiveTodo = (document: vscode.TextDocument) => {
    var i = 0;
    while (i < document.lineCount) {
      var lineText = document.lineAt(i).text;
      if (lineText.indexOf("@started") > -1) {
        if (lineText.indexOf("@done") === -1) {
          return lineText;
        }
      }
      i++;
    }
    return "";
  };

  const getTags = (todo: string) => {
    console.log(`getTags("${todo}")`);
    console.log(todo);
    return todo.match(/\@\w+(\([^\)]*\)|\S)*/g);
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "todos-to-jira.getTodos",
    () => {
      // The code you place here will be executed every time your command is executed

	  const activeExtensions = vscode.extensions.all;
      const todoFiles = vscode.workspace.findFiles("*TODO*").then((result) => {
        result.forEach((filename) => {
          vscode.workspace
            .openTextDocument(filename)
            .then((doc) => getCurrentActiveTodo(doc))
            .then((todo) => {
              if (todo.length > 0) {
                return {
                  taskName: todo
                    .substring(todo.indexOf("☐") + 1, todo.indexOf("@"))
                    .trim(),
                  tags: getTags(todo)
                };
              }
            })
            .then((x) => console.log(x));
        });
      });
      // Display a message box to the user
      vscode.window.showInformationMessage("todos-to-jira.getTodos!");
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
