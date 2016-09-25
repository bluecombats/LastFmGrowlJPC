// ==UserScript==
// @name          Last FM Growl JPC
// @namespace     http://www.bluecombats.blogspot.com
// @description	  Sends Growl notifications from the Last.fm website when the currently playing track changes. Changes to when track is changed, also scrobble notification should work better.
// @icon      		http://www.growlforwindows.com/gfw/images/plugins/lastfm.png
// @grant			none
// @include       http://last.fm/listen*
// @include       http://www.last.fm/listen*
// @include       http*last.fm/listen*
// @include       http*www.last.fm/listen*
// @version        1.41
// ==/UserScript==

GrowlMonkey = function(){
    function fireGrowlEvent(type, data){
        var element = document.createElement("GrowlEventElement");
        element.setAttribute("data", JSON.stringify(data));
        document.documentElement.appendChild(element);

        var evt = document.createEvent("Events");
        evt.initEvent(type, true, false);
        element.dispatchEvent(evt);
    }
    
    return {
        register : function(appName, icon, notificationTypes){
            var r = {};
            r.appName = appName;
            r.icon = icon;
            r.notificationTypes = notificationTypes;
            fireGrowlEvent("GrowlRegister", r);
        },
        
        notify : function(appName, notificationType, title, text, icon){
            var n = {};
            n.appName = appName;
            n.type = notificationType;
            n.title = title;
            n.text = text;
            n.icon = icon;
            fireGrowlEvent("GrowlNotify", n);
        }
    }
}();

	try{
        function LastFMGrowlinit(appname){
            console.log('Starting '+  'Last FM Growl JPC');
            
            var ntNewSong = {};
            ntNewSong.name ='songplayed';
            ntNewSong.displayName = 'Song Played';
            ntNewSong.enabled = true;

            var types = [ntNewSong];
            GrowlMonkey.register(appname, "http://www.growlforwindows.com/gfw/images/plugins/lastfm.png", types);
        }
        function LastFMGrowlinterval(originalTitle,appname){
            //console.log("current Title:"+newTitle);
            console.log("original title: "+originalTitle);
            
            if(document.getElementsByClassName("player-bar-artist-name")[0]){
                var creator=document.getElementsByClassName("player-bar-artist-name")[0].innerHTML;
                var name=document.getElementsByClassName("player-bar-track-name")[0].innerHTML;
            }
            else{
                var creator="Unknown";
                var name="Unknown";
            }
            //var  albumImage=null;
            //console.log("ARTIST "+creator);
            //console.log("TRACK "+name);
            if (creator !== originalTitle) {
                originalTitle=creator;
                console.log('Sent Last.fm Growl notification');
                //GrowlMonkey.notify("APPLICATION NAME", "NOTIFICATION TYPE", "TITLE", "TEXT", "ICON URL");
                GrowlMonkey.notify(appname, 'songplayed',creator, name);
                scrobble="UNKNOWN";
                //scrobble=LastFMScrobble(appname,creator,name,scrobble);
            }
            else{
                console.log('same song');
            }
            return [originalTitle,creator,name];
        }
		function removeHtml(tweet){
            //find 1st occurence of <
            var lessthan=tweet.indexOf("<");
            while(lessthan!=-1){
                //console.log("check: "+tweet);
                //find 1st occurence of >
                var greaterthan=tweet.indexOf(">");
                //the html stuff
                var htmlstuff=tweet.substring(lessthan,greaterthan+1);
                //replacing html with nothing
                //console.log("<:"+lessthan+" >:"+greaterthan+" htmlstuff:"+htmlstuff);
                tweet=tweet.replace(htmlstuff,"");
                //console.log("newtweet: "+tweet);
                //update lessthan
                lessthan=tweet.indexOf("<");
            }
            //console.log("end of if statements");
            return tweet;
        }
        function destroyGrowl(){
            var growlexist="exist";
            while( growlexist=="exist"){
                if(document.getElementsByTagName("growleventelement")[0]){
                    growlexist="exist";
                    var parent=document.getElementsByTagName("html")[0];
                    var child=document.getElementsByTagName("growleventelement")[0];
                    parent.removeChild(child);
                }
                else{
                    //doesn't exist
                    growlexist=" doesn't exist";
                }
            }
        }
//Main Script starts here
        var appname= 'Last FM Growl JPC';
        LastFMGrowlinit(appname);
        var originalTitle = "not playing yet";
        console.log("Original Title:"+originalTitle);
        scrobble="UNKNOWN";
        //var count=0;
        MyVar=setInterval(function(){
            var returnVar=LastFMGrowlinterval(originalTitle,appname);
            originalTitle=returnVar[0];
            creator=returnVar[1];
            name=returnVar[2];
            //destroy growl html elements
            destroyGrowl();
            //count++;
            //console.log(count);
            //if(count>20){
                //clearInterval(MyVar);
            //}
        },3000);		      
    }
    catch(err){
        txt="There was an error on this page.\n";   
        txt+="Error description: " + err.message + "\n";
        txt+="Error line"+err.lineNumber+ "\n";
        txt+="Click OK to continue.\n\n";   
        console.log(txt);
    }
    console.log("end of loop");