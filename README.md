# ESH – Editor Syntax Highlighter (Beta)

**ESH** is a phpBB extension that replaces the default post editor with a CodeMirror-based editor. It provides syntax highlighting for BBCode, links, and other content elements inside posts.

> ⚠️ **Beta Version** – This extension is under active development. Some features may be missing or unstable.

## Features

- Replaces phpBB's default editor.
- Syntax highlighting for BBCode, links, and inline content.
- Based on [CodeMirror 5](https://codemirror.net/5/).
- Easy integration with phpBB 3.3+.

## Installation

1. Clone or [download](https://github.com/rodgard/esh/archive/refs/tags/1.0.0-RC1.zip) this repository.
2. Place the extension in the following directory:

       ext/rodgard/esh/

3. Go to the phpBB Administration Control Panel (ACP):
   **Customize → Manage Extensions**
4. Enable the extension named **Editor Syntax Highlighter**.

## Requirements

- phpBB 3.3.0 or newer
- PHP 7.1.3 or newer

## License

[GNU General Public License v2](http://opensource.org/licenses/GPL-2.0)

## Third-party components

This extension includes the following third-party component:

- `bbcode.js` from [CodeMirror-modes by rosmanov](https://github.com/rosmanov/CodeMirror-modes),  
  licensed under the GNU Lesser General Public License v3.0.

See the `styles/all/template/bbcode.js` file for licensing details.

---

**Author:** [rodgard](https://github.com/rodgard)