import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

suite('Usecase Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample usecase test 1', () => {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [0, 1, 2, 3].indexOf(0));
    });


    test('Sample usecase test 2', () => {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });
});
