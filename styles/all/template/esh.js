const element = document.querySelector('#message-box textarea');
if (element && element.tagName.toLowerCase() === 'textarea') {
    var editor = CodeMirror.fromTextArea(element, {
		inputStyle: "contenteditable",
		lineNumbers: true,
		lineWrapping: true,
		mode: "bbcode",
		matchBrackets: true,
		spellcheck: true
	});
}

/**
 * Force native browser spellchecker on page load
 */
// $('.CodeMirror [contenteditable="true"]').focus().blur();

/**
 * Overridden phpbb function
 * 
 * bbstyle
 */	
function bbstyle(bbnumber) {
    var doc = editor.getDoc();
	if (bbnumber !== -1) {
		bbfontstyle(bbtags[bbnumber], bbtags[bbnumber+1]);
	} else {
        doc.replaceSelection('[*]');
        editor.focus();
	}
}

/**
 * Overridden phpbb function from editor.js
 * 
 * Apply bbcodes
 */
function bbfontstyle(bbopen, bbclose) {
	theSelection = false;

    var doc = editor.getDoc();
    theSelection = doc.getSelection();

    doc.replaceSelection(bbopen + theSelection + bbclose);
    editor.focus();
    curPos = doc.getCursor();
    doc.setCursor({line: curPos.line, ch: curPos.ch - bbclose.length});
    editor.focus();
}

/**
 * Overridden phpbb function from editor.js
 * 
 * Insert text at position
 */
function insert_text(text, spaces, popup) {
	var doc = editor.getDoc();

    if (spaces) {
		text = ' ' + text + ' ';
	}

    doc.replaceSelection(text);

	if (!popup) {
		editor.focus();
	}
}

/**
 * Overridden phpbb function from editor.js
 *
 * Add inline attachment at position
 */
function attachInline(index, filename) {
    var doc = editor.getDoc();
    doc.replaceSelection('[attachment=' + index + ']' + filename + '[/attachment]');
    editor.focus();
}

if (phpbb.plupload !== undefined) {
	/**
	 * Overridden function from plupload.js
	 * 
	 * Update the indices used in inline attachment bbcodes. This ensures that the
	 * bbcodes correspond to the correct file after a file is added or removed.
	 * This should be called before the phpbb.plupload,data and phpbb.plupload.ids
	 * arrays are updated, otherwise it will not work correctly.
	 *
	 * @param {string} action	The action that occurred -- either "addition" or "removal"
	 * @param {int} index		The index of the attachment from phpbb.plupload.ids that was affected.
	 */
	phpbb.plupload.updateBbcode = function(action, index) {
		var	doc = editor.getDoc(),
			text = doc.getValue(),
			removal = (action === 'removal');

		// Return if the bbcode isn't used at all.
		if (text.indexOf('[attachment=') === -1) {
			return;
		}

		function runUpdate(i) {
			var regex = new RegExp('\\[attachment=' + i + '\\](.*?)\\[\\/attachment\\]', 'g');
			text = text.replace(regex, function updateBbcode(_, fileName) {
				// Remove the bbcode if the file was removed.
				if (removal && index === i) {
					return '';
				}
				var newIndex = i + ((removal) ? -1 : 1);
				return '[attachment=' + newIndex + ']' + fileName + '[/attachment]';
			});
		}

		// Loop forwards when removing and backwards when adding ensures we don't
		// corrupt the bbcode index.
		var i;
		if (removal) {
			for (i = index; i < phpbb.plupload.ids.length; i++) {
				runUpdate(i);
			}
		} else {
			for (i = phpbb.plupload.ids.length - 1; i >= index; i--) {
				runUpdate(i);
			}
		}

		doc.setValue(text);
		const lastLine = doc.lineCount() - 1;
		const lastChar = doc.getLine(lastLine).length;
		doc.setCursor({ line: lastLine, ch: lastChar });
	};
}

/**
 * Overridden function from core.js
 * 
 * Show drag and drop animation when textarea is present
 *
 * This function will enable the drag and drop animation for a specified
 * textarea.
 *
 * @param {HTMLElement} textarea Textarea DOM object to apply editor to
 */
phpbb.showDragNDrop = function(textarea) {
	if (!textarea) {
		return;
	}

    var e = editor.getWrapperElement();

	$('body').on('dragenter dragover', function () {
		$(e).addClass('drag-n-drop');
	}).on('dragleave dragout dragend drop', function() {
		$(e).removeClass('drag-n-drop');
	});
	$('.CodeMirror-scroll', e).on('dragenter dragover', function () {
		$(e).addClass('drag-n-drop-highlight');
	}).on('dragleave dragout dragend drop', function() {
		$(e).removeClass('drag-n-drop-highlight');
	}).on('drop', function(event) {
        event.preventDefault();
        const dropEvent = new DragEvent('drop', {
            dataTransfer: event.originalEvent.dataTransfer
        });

        textarea.dispatchEvent(dropEvent);
    });
};
