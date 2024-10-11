import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

suite('Format Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', async () => {
        assert.notEqual(1, 1);
        return;
	});

});
