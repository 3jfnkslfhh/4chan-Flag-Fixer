// ==UserScript==
// @name        4chan Flag Fixer
// @namespace   flagfixer
// @description Because Hiroshimoot keeps using old flags
// @include     http*://boards.4chan.org/int/*
// @include     http*://boards.4chan.org/sp/*
// @include     http*://boards.4chan.org/pol/*
// @include     http*://s.4cdn.org/image/country/*
// @exclude     http*://boards.4chan.org/int/catalog
// @exclude     http*://boards.4chan.org/sp/catalog
// @exclude     http*://boards.4chan.org/pol/catalog
// @version     1.3
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @run-at      document-end
// @icon   		https://github.com/flagzzzz/4chan-Flag-Fixer/raw/master/extra/icon.png
// @updateURL   https://github.com/flagzzzz/4chan-Flag-Fixer/raw/master/4chan_flag_fixer.user.js
// @downloadURL https://github.com/flagzzzz/4chan-Flag-Fixer/raw/master/4chan_flag_fixer.user.js
// ==/UserScript==
var flagOption = "fixed"; // Radio button; options are fixed, diverse, or official flags
var flagOptionsVar = "fixerFlagOptions";
var flagReplaceUrl = "https://raw.githubusercontent.com/flagzzzz/4chan-Flag-Fixer/master/flagsheets/";
var nameSpace = "flagfixer.";

var setup = {
	html: function () {
        var htmlFixedStart = '<div>4chan Fixed Flags</div><br/>';
        var htmlSaveButton = '<div><button name="save" title="Pressing &#34;Save Preset&#34; will set your preset to whatever is selected">' +
            'Save Preset</button></div><br/>';
		var helpText = '<label name="fixedflagslabel"><a href="https://github.com/flagzzzz/4chan-Flag-Fixer" style="color:blue">Click here</a> for a complete description of each preset.</label>';
        var filterRadio = '<br/><form id="filterRadio">' +
            '<input type="radio" name="filterRadio" id="filterRadiofixed" style="display: inline !important;" value="fixed"><label>Fixed: flags are updated and glossed</label>' +
            '<br/><input type="radio" name="filterRadio" id="filterRadiounofficial" style="display: inline !important;" value="unofficial"><label>Unofficial: use unofficial flags</label>' +
            '<br/><input type="radio" name="filterRadio" id="filterRadioofficial" style="display: inline !important;" value="official"><label>Official only: only use official flags</label>' +
            '</form>';
			
        return htmlFixedStart + htmlSaveButton + helpText + filterRadio;

    },
	setRadio: function() {
        var flagOptionStatus = load(flagOptionsVar);
        if (!flagOptionStatus || flagOptionStatus === "" || flagOptionStatus === "undefined") {
            flagOptionStatus = "fixed";
        }
        var radioButton = document.getElementById("filterRadio" + flagOptionStatus);
        if (!radioButton) {
            radioButton = document.getElementById("filterRadiofixed");
        }
        radioButton.checked = true;
    },
	show: function () {
        /* remove setup window if existing */
        var setup_el = document.getElementById("fixedflags");
        if (setup_el) {
            setup_el.parentNode.removeChild(setup_el);
        }
        /* create new setup window */
        GM_addStyle('\
            #fixedflags { position:fixed;z-index:10001;top:40px;right:40px;padding:20px 30px;background-color:white;width:auto;border:1px solid black }\
            #fixedflags * { color:black;text-align:left;line-height:normal;font-size:12px }\
            #fixedflags div { text-align:center;font-weight:bold;font-size:14px }'
        );
        setup_el = document.createElement('div');
        setup_el.id = 'fixedflags';
        setup_el.innerHTML = setup.html();

        document.body.appendChild(setup_el);

        setup.setRadio();

        /* button listeners */
        document.querySelector('#fixedflags *[name="save"]').addEventListener('click', function () {
			flagOption = document.querySelector('input[name="filterRadio"]:checked').value;
            this.disabled = true;
            this.innerHTML = 'Saving...';
            setup_el.parentNode.removeChild(setup_el);
            save(flagOptionsVar, flagOption);
			alert("Fixed Flags option set, please refresh all of your 4chan tabs!");

        }, false);
    },
	setupSetting: function() {
		GM_registerMenuCommand("Flag Fixer Setup", setup.show);
	}
};

function save(key, value) {
	GM_setValue(nameSpace + key, value);
}

function load(key) {
	return GM_getValue(nameSpace + key);
}


flagOption = load(flagOptionsVar);
if (!flagOption || flagOption === "" || flagOption === "undefined") {
	flagOption = "fixed";
}

setup.setupSetting();
GM_addStyle(".flag { display:inline-block; width:16px; height:11px; position:relative; top:1px; background-image:url(\'" + flagReplaceUrl + flagOption + ".png" + "\') !important; background-repeat: no-repeat;}");
GM_addStyle(".flag-a1 { background-position:-32px -176px !important; }");
GM_addStyle(".flag-a2 { background-position:-48px -176px !important; }");
GM_addStyle(".flag-ap { background-position:-64px -176px !important; }");
var address = window.location.href;
if (address.indexOf("4cdn.org/image/country") > -1) {
    document.querySelector('img').src = flagReplaceUrl + "flags/" + flagOption + "/" + address.substring(address.length - 6, address.length);
}