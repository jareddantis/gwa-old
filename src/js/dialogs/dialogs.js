const dialogs = {
    _new: function(opts) {
        let dialog = new Dialog(),
            subtitle = opts.subtitle || undefined,
            img = opts.img || undefined,
            onDismiss = opts.onDismiss || undefined,
            buttons = opts.buttons || undefined;
        dialog.title = opts.title || throw new Error('[dialog] Title unspecified');
        dialog.type = opts.type || throw new Error('[dialog] Type unspecified');

        // Image
        if (img !== undefined) {
            let imgEl = document.createElement('img');
            imgEl.src = `dist/img/${img}.svg`;
            imgEl.alt = img.replace(/-/g, ' ');
            dialog.appendToBody(imgEl);
        }

        // Subtitle
        if (subtitle !== undefined) {
            let subEl = document.createElement('p');
            subEl.innerText = subtitle;
            dialog.appendToBody(subEl);
        }

        // Dismiss button
        if (onDismiss !== undefined) {
            dialog.addButton('dismiss', function() {
                opts.onDismiss();
                dialog.dismiss();
            });
        }

        // Other buttons
        if (buttons !== undefined) {
            for (let i = 0; i < buttons.length; i++) {
                let { name, fn } = buttons[i];
                dialog.addButton(name, fn);
            }
        }

        return dialog;
    },

    customSubjects: function() {
        let dialog = this._new({
            title: 'Custom subjects',
            type: 'custom-subjects',
            buttons: [
                {
                    name: '+ row',
                    fn: function(){
                        const { shadowRoot } = this;

                        // Add empty row to custom subject table
                        let table = shadowRoot.querySelector('tbody');
                        table.appendChild(utils.newCustomSubject());

                        // Scroll to bottom of table
                        let body = shadowRoot.querySelector('.dialog-body');
                        body.scrollTop = body.scrollHeight;
                    }
                },
                {
                    name: 'cancel',
                    fn: function(){
                        if (subjects.get("custom").length === 0) {
                            // Restore previously selected subject set
                            let prevSet = state.get("prevSet"),
                                dropdown = document.querySelector('#levels select');
                            dropdown.value = prevSet;
                            state.switchLevel(prevSet);
                        }

                        // Hide dialog
                        this.dismiss();
                    }
                },
                {
                    name: 'save',
                    fn: function(){
                        const { shadowRoot } = this;

                        // Parse new subject data
                        let subjs = shadowRoot.querySelectorAll('.dialog-body tbody tr');
                        if (calc.parseSubjects(subjs, shadowRoot.querySelector('.dialog-body')))
                            dialog.dismiss();
                    }
                }
            ]
        }), currCustom = subjects.get('custom'),
            tableBody = document.createElement('tbody');

        // See if there are already defined subjects
        if (currCustom.length > 0) {
            // Restore previously defined subjects
            for (let i = 0; i < currCustom.length; i++) {
                let name = currCustom[i].name,
                    units = currCustom[i].units,
                    row = utils.newCustomSubject(name, units);
                tableBody.appendChild(row);
            }
        } else {
            // Add empty row to subject table
            tableBody.appendChild(utils.newCustomSubject());
        }

        // Add table to dialog
        let table = document.createElement('table');
        table.appendChild(tableBody);
        dialog.appendToBody(table);

        // Show dialog
        dialog.show();
    },

    iOSinstall: function(isSafari) {
        let dialog = this._new({
            title: 'Bookmark for easier access, even when offline',
            type: 'ios-install',
            subtitle: isSafari ? 'Just tap Share and choose Add To Home Screen.'
                : 'Open this site in Safari to begin.',
            img: isSafari ? 'ios-install' : 'ios-safari',
            onDismiss: function() {
                state.set("iOSprompt", true);
            }
        });

        dialog.show();
    },

    updateFound: function() {
        let dialog = this._new({
            title: 'App update found',
            type: 'update-found',
            img: 'update-found'
        });
        dialog.addButton('update & refresh', function() {
            window.location.reload();
        });

        dialog.show();
    }
};