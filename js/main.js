//require(["vendor/jquery-1.8.3.min", "vendor/jquery.vegas"], function() {

    $(function() {
        //$( "#tabs" ).tabs(); 
        // fix the classes
        $( ".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *" )
            .removeClass( "ui-corner-all ui-corner-top" )
            .addClass( "ui-corner-bottom" );
        // move the nav to the bottom
        $( ".tabs-bottom .ui-tabs-nav" ).appendTo( ".tabs-bottom" );
    })

    $.ajax("data/alex.json",  {
        success: function(data) {
            $("#info-box #name").text(data.name);
            $("#info-box #headline").text(data.headline);
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
            alert( "error: "  + textStatus )
        },
    });


    $( function() {
      $.vegas({
        src:'img/IMG_0062.JPG',
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
