myMatrix.gui.highlightButton = function(){
    document.getElementById("myMatrix-button").className = "toolbarbutton-1 myMatrix-button-active";
};

myMatrix.gui.dimButton = function(){
    document.getElementById("myMatrix-button").className = "toolbarbutton-1 myMatrix-button-inactive";
};

myMatrix.gui.updatePreferences = function(){
    var matrixEnabledOption = document.getElementById("myMatrix-enabled");
    if (matrixEnabledOption) {
        matrixEnabledOption.setAttribute("checked", myMatrix.preferences.getPreference("enabled"));
        myMatrix.plugins.forEach(function(plugin){
            try {
                if (plugin.layout_type === "checkbox") {
                   document.getElementById("myMatrix-" + plugin.id).setAttribute("checked", myMatrix.preferences.getPreference(plugin.id));
                }
            }
            catch (e) {
                myMatrix.error("Preference listener init failed for: (" + plugin.id + "): " + e.message);
            }
        });
    }
};

myMatrix.gui.drawOptions = function() {
    if (document.getElementById("myMatrix-plugins").children.length === 0) {
        myMatrix.plugins.forEach(function(plugin){
            if (typeof(plugin.platforms) === "undefined" || !plugin.platforms || plugin.platforms.search("firefox") > -1) {
                var parent,
                    menuitem = document.createElement("menuitem");
                        menuitem.setAttribute("id", "myMatrix-" + plugin.id);
                        menuitem.setAttribute("type", "checkbox");
                        menuitem.setAttribute("option", plugin.id);
                        menuitem.setAttribute("label", plugin.name);
                        menuitem.setAttribute("oncommand", "myMatrix.preferences.toggleOption(this)"),
                    menubutton = document.createElement("button"),
                        menubutton.setAttribute("id", "myMatrix-" + plugin.id),
                        menubutton.setAttribute("label", plugin.name);

                menubutton.addEventListener("command", plugin.onclick, false);
                
                if (plugin.layout_type == "checkbox") {
                    if (plugin.experimental) {
                        parent = document.getElementById("myMatrix-experimental");
                    } else {
                        parent = document.getElementById("myMatrix-plugins");
                    }
                    parent.appendChild(menuitem);
                } else if (plugin.layout_type == "action_button") {
                    parent = document.getElementById("myMatrix-buttons");
                    parent.appendChild(menubutton);
                    //myMatrix.gui.insertDependants(plugin);
                } else {
                    // TODO: Throw an error for not supported layout types (debug mode only, fail silently otherwise)
                }
            }
        });
    }
};

//https://developer.mozilla.org/En/Code_snippets:Toolbar#Adding_button_by_default
//https://developer.mozilla.org/en/XUL_School/Appendix_B%3a_Install_and_Uninstall_Scripts#Install_Scripts
/**
 * Installs the toolbar button with the given ID into the given
 * toolbar, if it is not already present in the document.
 *
 * @param {string} toolbarId The ID of the toolbar to install to.
 * @param {string} id The ID of the button to install.
 * @param {string} afterId The ID of the element to insert after. @optional
 */
myMatrix.gui.installButton = function(toolbarId, id, afterId){
    if (!document.getElementById(id)) {
        var toolbar = document.getElementById(toolbarId);

        var before = toolbar.lastChild;
        if (afterId) {
            var before = document.getElementById(afterId);
            var elm = before;
            if (elem && elem.parentNode == toolbar) {
                before = elem.nextElementSibling;
            }
        }

        toolbar.insertItem(id, before);
        toolbar.setAttribute("currentset", toolbar.currentSet);
        document.persist(toolbar.id, "currentset");
    }
};
