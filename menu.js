'use strict';
const os = require('os');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();

function sendAction(action) {
	const win = BrowserWindow.getAllWindows()[0];

	if (process.platform === 'darwin') {
		win.restore();
	}

	win.webContents.send(action);
}

const viewSubmenu = [
	{
		label: 'Reset Text Size',
		accelerator: 'CmdOrCtrl+0',
		click() {
			sendAction('zoom-reset');
		}
	},
	{
		label: 'Increase Text Size',
		accelerator: 'CmdOrCtrl+Plus',
		click() {
			sendAction('zoom-in');
		}
	},
	{
		label: 'Decrease Text Size',
		accelerator: 'CmdOrCtrl+-',
		click() {
			sendAction('zoom-out');
		}
	}
];

const helpSubmenu = [
	{
		label: `${appName} Website...`,
		click() {
			shell.openExternal('https://github.com/sindresorhus/anatine');
		}
	},
	{
		label: 'Report an Issue...',
		click() {
			const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->

-

${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

			shell.openExternal(`https://github.com/sindresorhus/anatine/issues/new?body=${encodeURIComponent(body)}`);
		}
	}
];

const darwinTpl = [
	{
		label: appName,
		submenu: [
			{
				label: `About ${appName}`,
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				label: 'Log Out',
				click() {
					sendAction('log-out');
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Services',
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				label: `Hide ${appName}`,
				accelerator: 'Cmd+H',
				role: 'hide'
			},
			{
				label: 'Hide Others',
				accelerator: 'Cmd+Shift+H',
				role: 'hideothers'
			},
			{
				label: 'Show All',
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				label: `Quit ${appName}`,
				accelerator: 'Cmd+Q',
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'File',
		submenu: [
			{
				label: 'Compose Tweet',
				accelerator: 'CmdOrCtrl+N',
				click() {
					sendAction('compose-tweet');
				}
			}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{
				label: 'Undo',
				accelerator: 'CmdOrCtrl+Z',
				role: 'undo'
			},
			{
				label: 'Redo',
				accelerator: 'Shift+CmdOrCtrl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: 'Cut',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Paste',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			},
			{
				label: 'Select All',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			}
		]
	},
	{
		label: 'View',
		submenu: viewSubmenu
	},
	{
		label: 'Window',
		role: 'window',
		submenu: [
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				type: 'separator'
			},
			{
				label: 'Bring All to Front',
				role: 'front'
			},

			// temp workaround for:
			// https://github.com/sindresorhus/caprine/issues/5
			{
				label: 'Toggle Full Screen',
				accelerator: 'Ctrl+Cmd+F',
				click() {
					const win = BrowserWindow.getAllWindows()[0];
					win.setFullScreen(!win.isFullScreen());
				}
			}
		]
	},
	{
		label: 'Help',
		role: 'help'
	}
];

const linuxTpl = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Compose Tweet',
				accelerator: 'CmdOrCtrl+N',
				click() {
					sendAction('compose-tweet');
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Log Out',
				click() {
					sendAction('log-out');
				}
			},
			{
				label: 'Quit',
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{
				label: 'Cut',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Paste',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			}
		]
	},
	{
		label: 'View',
		submenu: viewSubmenu
	},
	{
		label: 'Help',
		role: 'help'
	}
];

let tpl;
if (process.platform === 'darwin') {
	tpl = darwinTpl;
} else {
	tpl = linuxTpl;
}

tpl[tpl.length - 1].submenu = helpSubmenu;

module.exports = electron.Menu.buildFromTemplate(tpl);
