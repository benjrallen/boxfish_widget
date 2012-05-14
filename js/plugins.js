/*
 * Try/Catch the console
 */
try{
    console.log('Hello Ease.');
} catch(e) {
    window.console = {};
    var cMethods = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(",");
    for (var i=0; i<cMethods.length; i++) {
        console[ cMethods[i] ] = function(){};
    }
}

/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.

//MODIFIED by Ben Allen
function prettyDate(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		//diff = (((new Date()).getTime() - date.getTime()) / 1000 ),
		//MODIFIED TO ADD TIMEZONE OFFSET
		diff = (((new Date()).getTime() - date.getTime() + ((date.getTimezoneOffset()) * 60 * 1000)) / 1000 ),
		day_diff = Math.floor(diff / 86400);
		
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;

			
	return day_diff == 0 && (
			//modified to track back to seconds... BA
			diff < 2 && "just now" ||
			diff < 60 && ~~(diff) + " seconds ago" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}


//Ease is the namespace I use out of habit.
var Ease = Ease || {};

(function($){
	
	//some custom events
	Ease.Events = {
		BLURB_ADDED: 'blurbAdded'
	};
	
	Ease.Boxfish = function( config ){
		
		this.settings = {
			url: 		'http://api.staging.boxfish.com/v1/demo/codetest/?callback=?',
			cont: 		'#widget-container',
			maxBlurbs: 	10
		};
		
		$.extend( this.settings, config );
		
		//find the container
		this.$cont = $(this.settings.cont);
		//find the content container
		this.$content = this.$cont.find('.content');
		
		if( !this.$content.length )
			return false;
		
		//track the requests that have been made
		this.requests = [];
		//going to make objects for each blurb that comes back
		this.blurbs = [];
		//used to tell the container that a blurb has loaded & remove the loading screen
		this.loading = true;
		
		
		this.init();
	};
	
	Ease.Boxfish.prototype = {
		
		init: function(){
			var that = this;
			
			//bind some custom events
			this.$cont.bind( Ease.Events.BLURB_ADDED, function(){
				that.onAddBlurb();
			});
			
			//get the data
			this.requestData();
			
		}, 
		
		//make a random integer from zero to whatever number
		random: function( limit ){
			//bitwise OR can be a lot faster than Math.floor:  http://jsperf.com/or-vs-floor
			return ~~( Math.random() * limit );
		},
		
		requestData: function(){
			
			var that = this;
						
			this.requests.push(
				$.ajax({
					url: 		this.settings.url,
					dataType: 	'jsonp',
					jsonp: 		'success',
					data: {
						wait: 	( this.loading ? this.random( 2 ) : this.random( 30 ) ) //some integer between 0 and 30, after first load
					},
					success: 	function( data, status, xhr ){
						that.onRequestSuccess.apply( that, arguments );
					}
				}).always(function( data, status, xhr ){
					that.onRequestFinished.apply( that, arguments );
				})
			);
		},
		
		onRequestSuccess: function( data, status, xhr ){			
			//make a new blurb, and tell it where to put itself
			this.blurbs.push( new Ease.Boxfish.Blurb( this, data, { cont: this.$content }) );
		},
		
		//happens on error or success for the json request
		onRequestFinished: function( data, status, xhr ){
			//find the request, and get rid of it.
			
			//using $.inArray out of habit in dealing 
			//	with IE9's lack of support for indexOf
			var idx = $.inArray( xhr, this.requests ); 

			if( idx > -1 )
				this.requests.splice( idx, 1 );
			
			//request more data
			this.requestData();
		},
		
		//runs every time a blurb is added to the widget.  
		//	keeps the number of blurbs in check and everything up to date
		onAddBlurb: function(){			
			//remove the loading screen
			if( this.loading ){
				this.loading = false;
				this.$cont.addClass('boxfish-loaded');
			}
			
			if( this.blurbs.length > this.settings.maxBlurbs ){
				//remove and destroy the blurb
				this.blurbs.shift().destroy();
			}
			
			//update the times on the blurbs
			$.each( this.blurbs, function(){
				this.updateTime();
			});
		}
	};


	Ease.Boxfish.Blurb = function( superclass, data, config ){
		this.data = data; //the ajax data used to instantiate this object
		this.superclass = superclass;  //reference to the parent object
		
		this.settings = {
			blurbClass: 	'blurb',
			metaClass: 		'meta',
			contentClass: 	'blurb-content', 
			detailsClass: 	'details',
			animateTime: 	250
		};
		
		$.extend( this.settings, config );
				
		this.init();
	};
	
	Ease.Boxfish.Blurb.prototype = {
		
		init: function(){
			var that = this;
			
			//make the blurb and prepend it to the right container
			this.$blurb = this.makeBlurb()
							.hide()
							.prependTo( this.settings.cont )
							.slideDown( this.settings.animateTime, function(){
		
								that.superclass.$cont.triggerHandler( Ease.Events.BLURB_ADDED );
		
							});
			
		},
		
		makeBlurb: function(){
			//console.log( 'making blurb', this.data );
			var block = $('<div />', {}).addClass( this.settings.blurbClass );
			
			//pic & time
			var meta = $('<div />', {}).addClass( this.settings.metaClass ).appendTo( block );
			
			//the thumbnail
			this.makeThumbnail().appendTo( meta );
			
			//time
			this.makeDate().appendTo( meta );
			
			//content block
			var content = $('<div />', {}).addClass( this.settings.contentClass ).appendTo( block );
			
			this.makeTitle().appendTo( content );
			
			this.makeDetails().appendTo( content );
			
			return block;
		},
		
		makeTitle: function(){
			return $('<h2 />', {
				html: '<strong>' + this.data.channel + '</strong> - ' + this.data.program
			});
		},
		
		makeDetails: function(){
			var details = $('<div />', {
				html: this.data.text
			}).addClass( this.settings.detailsClass );
			
			//make the highlighted term go to boxfish... why not?
			details.find('em').click(function(){
				window.open( 'http://beta.boxfish.com/#search/'+$(this).text() );
			});
			
			return details;
		},
		
		makeThumbnail: function(){
			var img = new Image();
				//i would rather not see a broken image icon if something goes wrong
				img.onerror = function( evt ){
					$(this).remove();
				};
				img.src = this.data.thumbnail;
				
			return $('<div />', { html: img }).addClass('pic');
		},

		makeDate: function(){
			var time = this.getTime();
			
			this.$time = $('<span />', {
				text: time
			}).addClass('time');
			
			return this.$time;
		},
		
		//get the time in pretty format or a different format
		getTime: function( pretty ){
			//the time... 
			//try to make it pretty at first
			var time = prettyDate( this.data.time );
				time = time ? time : this.data.time;  //TODO write fallback format function if prettyDate returns NaN or undefined
			
			return time;
		},
		
		//fired on blurb add
		updateTime: function(){
			this.$time.text( this.getTime() );
		},
		
		//removes the blurb from the DOM
		destroy: function(){			
			this.$blurb.remove();
		}
	};
	
})(jQuery);