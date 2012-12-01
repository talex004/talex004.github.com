//require(["vendor/jquery-1.8.3.min", "vendor/jquery.vegas"], function() {


function changePage(page) {
    var History = window.History;
    var state = History.getState();
    if (state.data.page != page) {
        History.pushState({"page": page}, null, "./?"+page);
        $("#loadingbox").show();
    }
}


// Page State functions
function pageState_changed() { 
    console.log("<pageState_changed function>");
    
    var state = History.getState(); 
    // Note: We are using History.getState() instead of event.state
    console.log("State:", state);
    
    
    /*$(function() {
        //$( "#tabs" ).tabs(); 
        // fix the classes
        $( ".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *" )
            .removeClass( "ui-corner-all ui-corner-top" )
            .addClass( "ui-corner-bottom" );
        // move the nav to the bottom
        $( ".tabs-bottom .ui-tabs-nav" ).appendTo( ".tabs-bottom" );
    })*/

    // Start loading new data
    var page = state.data.page || "alex";
    console.log("Page:", page);
    
    $.ajax("data/"+page+".json",  {
        success: pageJSON_loaded,
        dataType: "json",
        error: function(jqXHR, textStatus, errorThrown) { 
            console.log( "$.ajax error: "  + textStatus );
        },
    });
    
    // Fade out old box
    var infoBox = $("#infobox");
    infoBox.data("data", false);
    infoBox.data("hide-complete", false);
    infoBox.hide(300, infobox_onHideCompleted);
};

// Page JSON functions
function pageJSON_loaded(pageJSON) {
    console.log("<pageJSON_loaded function>");
    
    var infobox = $("#infobox");
    if (infobox.data("hide-complete")) {
        // Update infobox if hide animation has finished
        infobox_update(pageJSON);
    } else {
        // Otherwise, attach data for later display
        infobox.data("pageJSON", pageJSON);
    }
    
    // Update background
    console.log("Background: ", pageJSON["background"]);
    $.vegas({
        src:pageJSON["background"],
        fade:500,
        valign: '30%',
        loading: false,
        load: pageBackground_loaded,
        complete: function() {}
    });
    // Handle missing (or late) background image
    var bgTimeout = window.setTimeout(pageBackground_timeout, 1000);
    infobox.data("bg-timeout", bgTimeout);
};

// Page Background functions
function pageBackground_timeout() {
    console.log("<pageBackground_timeout function>");
    // Clean up
    var infobox = $("#infobox");
    var bgTimeout = infobox.data("bg-timeout");
    infobox.removeData("bg-timeout");

    // Remove old background
    $.vegas("destroy", "background");
    
    // Show infobox
    infobox_show();
}

function pageBackground_loaded() {
    console.log("<pageBackground_loaded function>");
    // Clean up
    var infobox = $("#infobox");
    var bgTimeout = infobox.data("bg-timeout");
    if (bgTimeout) {
        infobox.removeData("bg-timeout");
        window.clearTimeout(bgTimeout);
        
        // Show infobox
        infobox_show();
    } else {
        console.log("Nothing to do. Timeout showed box first.");
    }
}


// InfoBox functions
function infobox_onHideCompleted() {
    console.log("<infobox_onHideCompleted function>");
    var infobox = $("#infobox");
    var pageJSON = infobox.data("pageJSON");
    if (pageJSON) {
        infobox_update(pageJSON);
    } else {
        infobox.data("hide-complete", true);
    }
}

function infobox_update(pageJSON) {
    
    // Override user-links within the infobox
    var tablink_clicked = function(e) {
        if (e.target) {
            var base = e.target.baseURI.split("?")[0];
            var target = e.target.href.split("?")[0];
            if (base == target) {
                console.log("Intercepted link: ", e.target.search);
                changePage(e.target.search.replace("?", ""));
                return false;
            }
        }
        return true
    };
    
    console.log("<infobox_update function>");
    $("#infobox").css("background-color", pageJSON.colors.infobox).css("color", pageJSON.colors.text);
    $("#infobox #name").text(pageJSON.name).css("color", pageJSON.colors.name);
    $("#infobox #headline").text(pageJSON.headline).css("color", pageJSON.colors.headline);
    $("#infobox #bio").html(marked(pageJSON.bio.join("\n\n")));
    var links = ""
    for (var i=0; i<pageJSON.links.length; i++) {
        var link = pageJSON.links[i];
        links = links + "<li>"+marked(link)+"</li>";
    }
    $("#infobox #links").html("<ul>"+links+"</ul>");
    
    // Tabs
    // Clear old
    var tabmenu = $("#infobox #infobox-tabmenu");
    tabmenu.children(":not(:first-child)").remove();
    // TODO: also remove old panes to prevent memory leak!
    // Change to overview
    $("#infobox #infobox-tabmenu a:first").tab("show");
    
    // Add new
    var lastpane = $("#infobox #infobox-tabmenu");
    for (var tabname in pageJSON.tabs) {
        // Create link to tab
        var tabid = "infobox-tab-"+tabname.replace(/\W/, "");
        var tablink = $("<a></a>").attr("href", "#"+tabid).attr("data-toggle", "tab").text(tabname);
        var tabitem = $("<li></li>").append(tablink);
        // Add to list of links
        var tabcontent = pageJSON.tabs[tabname];
        tabmenu.append(tabitem);
        // Create new content pane
        var tabpane = $("<div></div>").addClass("tab-pane").attr("id", tabid).html(marked(tabcontent));
        tabpane.find("a").click(tablink_clicked);
        // Add to pane container
        lastpane.before(tabpane);
    }
}



function infobox_show() {
    console.log("<infobox_show function>");
    
    var makeTabsEqualSize = function() { 
        // Set consistent height
        tabs = $("#infobox .tab-pane");
        maxw = maxh = 0;
        for (i = 0; i<tabs.length; i++) {
            tab = $(tabs[i]);
            crth = tab.height();
            crtw = tab.width();
            if (crth > maxh) {
                maxh = crth;
            }
            if (crtw > maxw) {
                maxw = crtw;
            }
        }
        for (i = 0; i<tabs.length; i++) {
            tab = $(tabs[i]);
            tab.height(maxh);
            tab.width(maxw);
        }
    };
    
    $("#loadingbox").hide();
    var infobox = $("#infobox");
    infobox.show(500, makeTabsEqualSize);
    //infobox.draggable();
    //infobox.resizable({ handles: "e" });
};


// Main function
function main(window, undefined) {
    console.log("<Main function.>");
    
    
    // Prepare
    var History = window.History; // Note: capital H
    if ( !History.enabled ) {
        // HTML4 browser, support disabled.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange', pageState_changed); // Note: We are using statechange instead of popstate
    
    // Inspect state
    var state = History.getState();
    console.log("State: ", state);
    
    if (state.data.page != undefined) {
        console.log("Reload detected. State already exists. Page: ", state.data.page);
        pageState_changed();
    } else {
        var page = state.url.split("?")[1] || "alex";
        if (page.indexOf("#") !== -1) {
            page = page.split("#")[0];
        }
        console.log("No reload. Page: ", page);
        History.replaceState({"page": page}, null, "./?"+page);
    }
};

// Entry point
main(window);

