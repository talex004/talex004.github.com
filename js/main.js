//require(["vendor/jquery-1.8.3.min", "vendor/jquery.vegas"], function() {

    
    
oldHash = "";
    
// state changes
(function(window,undefined){

    // Prepare
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'anchorchange',function(){ // Note: We are using statechange instead of popstate
        hash = History.getHash(); // Note: We are using History.getState() instead of event.state
        console.log(hash, oldHash);
        if (hash == "") {
            hash = "alex";
        }
        console.log(hash, oldHash);
        if (hash != oldHash) {
            oldHash = hash;
            
            $(function() {
        //$( "#tabs" ).tabs(); 
        // fix the classes
        $( ".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *" )
            .removeClass( "ui-corner-all ui-corner-top" )
            .addClass( "ui-corner-bottom" );
        // move the nav to the bottom
        $( ".tabs-bottom .ui-tabs-nav" ).appendTo( ".tabs-bottom" );
    })

    dataName = window.location.hash.replace("#", "") || "alex";
    $.ajax("data/"+dataName+".json",  {
        success: function(data) {
            $( function() {
      console.log(data["background"]);
      $.vegas({
        src:data["background"],
        fade:500,
        valign: '30%',
        loading: false,
        load: function() {
            $("#loading-box").hide();
            $("#info-box").show(500, function() { 
                // Set consistent height
                tabs = $("#info-box .tab-pane");
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
            });
            $("#info-box" ).draggable();
            $("#info-box" ).resizable({ handles: "e" });
        },
        complete: function() {
            
        }
      });
    });
    
    
            $("#info-box").css("background-color", data.colors.infobox).css("color", data.colors.text);
            $("#info-box #name").text(data.name).css("color", data.colors.name);
            $("#info-box #headline").text(data.headline).css("color", data.colors.headline);
            $("#info-box #bio").html(marked(data.bio.join("\n\n")));
            links = ""
            for (i=0; i<data.links.length; i++) {
                link = data.links[i];
                links = links + "<li>"+marked(link)+"</li>";
            }
            $("#info-box #links").html("<ul>"+links+"</ul>");
            
        },
        dataType: "json",
        error: function(jqXHR, textStatus, errorThrown) { 
            console.log( "error: "  + textStatus );
        },
    });

            
        }
    });
    
    // first load
    if (History.getHash() == "") {
        History.pushState(null, null, "/#alex");
    }

})(window);
