try{console.log("Hello Ease.")}catch(e$$5){window.console={};for(var cMethods="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),i=0;i<cMethods.length;i++)console[cMethods[i]]=function(){}}var Ease=Ease||{};
(function(b){Ease.localstorage=Modernizr.localstorage;Ease.ie7=b(".lte7").length?!0:!1;Ease.Keys={RIGHT_CLICK:3};Ease.Events={FLAG_CHANGE:"mineFlagged",GAME_OVER:"gameOver"};Ease.Minesweeper=function(a){this.settings={cont:"body",holderClass:"holder",boardClass:"board",controlsClass:"controls",newGameClass:"newGame btn-primary",validateClass:"validate btn-warning",cheatClass:"cheat btn-danger",saveGameClass:"saveGame btn-success",loadGameClass:"loadGame btn-info",mineClass:"mine",size:8,numberOfMines:10,
localKey:"minesweeperLocal"};b.extend(this.settings,a);this.data=null;this.rows=[];this.init()};Ease.Minesweeper.prototype={init:function(){this.size=this.settings.size;this.numberOfMines=this.settings.numberOfMines;this.trackInstance();this.makeHolder();this.makeBoard();this.makeControls();this.makeMessageBox();this.startGame();b("#loading").hide()},startGame:function(){this.mines=[];this.settings.size=this.size;this.settings.numberOfMines=this.numberOfMines;this.inProgress=!0;var a=Math.pow(this.settings.size,
2)-1;if(a<this.settings.numberOfMines)this.settings.numberOfMines=a;this.counter=this.settings.numberOfMines;this.$mines.find("input").val(this.settings.numberOfMines);this.clearBoard();this.fillBoard()},clearBoard:function(){this.rows=[];this.$board.html("");this.setCounter();this.$messageBox.hide().prependTo(this.$controls)},setCounter:function(){var a="";Ease.ie7?a=this.counter:b.each(this.counter.toString(),function(){a+="<span>"+this+"</span>"});this.$counter.html(a)},makeHolder:function(){return this.$holder=
b("<div />",{id:this.settings.holderClass+"-"+this.instance}).addClass(this.settings.holderClass+" clearfix").appendTo(this.settings.cont)},makeBoard:function(){var a=this;return this.$board=b("<div />",{id:this.settings.boardClass+"-"+this.instance}).addClass(this.settings.boardClass+" clearfix").bind(Ease.Events.GAME_OVER,function(){a.validate()}).appendTo(this.$holder)},makeMessageBox:function(){this.$messageBox=b("<div />",{}).addClass("messageBox")},makeControls:function(){var a=this;this.$controls=
b("<div />").addClass(this.settings.controlsClass).appendTo(this.$holder);this.$counter=b("<div />",{}).addClass("counter").bind(Ease.Events.FLAG_CHANGE,function(){a.setCounter()}).appendTo(this.$controls);this.$validate=b("<button />",{text:"Validate"}).addClass(this.settings.validateClass+" btn").click(function(){a.validate()}).appendTo(this.$controls);this.$cheat=b("<button />",{text:"Cheat"}).addClass(this.settings.cheatClass+" btn").click(function(){a.cheat()}).appendTo(this.$controls);this.$newGame=
b("<button />",{text:"New Game"}).addClass(this.settings.newGameClass+" btn").click(function(){a.startGame()}).appendTo(this.$controls);this.$size=this.makeInputBlock("Dimensions ( x*x )","size",this.size,function(){a.size=b(this).val()}).appendTo(this.$controls);this.$mines=this.makeInputBlock("Number of mines","mines",this.numberOfMines,function(){a.numberOfMines=b(this).val()}).appendTo(this.$controls);if(Ease.localstorage)this.$save=b("<button />",{text:"Save"}).addClass(this.settings.saveGameClass+
" btn").click(function(){a.saveLocal()}).appendTo(this.$controls),this.$load=b("<button />",{text:"Load"}).addClass(this.settings.loadGameClass+" btn").click(function(){a.loadLocal()}).hide().appendTo(this.$controls),this.testLocal()},makeInputBlock:function(a,c,d,e){var g=b("<div />").addClass("inputBlock "+c);b("<label />",{text:a}).appendTo(g);a=b("<input />",{name:c,type:"text"}).appendTo(g);d&&a.val(d);typeof e==="function"&&a.change(e);return g},buildSettingsObject:function(){var a={settings:this.settings,
mines:this.mines,rows:[]};b.each(this.rows,function(c){a.rows[c]=[];b.each(this,function(b){a.rows[c][b]=this.settings})});return a},saveLocal:function(){localStorage.setItem(this.localKey,JSON.stringify(this.buildSettingsObject()));this.testLocal()},loadLocal:function(){var a=localStorage.getItem(this.localKey);if(a&&a.length)this.data=JSON.parse(a),this.size=this.data.settings.size=parseInt(this.data.settings.size,10),this.numberOfMines=this.data.settings.numberOfMines=parseInt(this.data.settings.numberOfMines,
10),this.settings=this.data.settings,this.startGame(),this.$size.find("input").val(this.size),this.$mines.find("input").val(this.numberOfMines),this.data=null},testLocal:function(){localStorage.getItem(this.localKey)&&this.$load.show()},validate:function(){this.showMines();var a=!0;b.each(this.rows,function(){var c=!0;b.each(this,function(){console.log("valid?",this,this.settings.exposed,this.settings.isMine);if(this.settings.exposed&&this.settings.isMine||!this.settings.exposed&&!this.settings.isMine)return c=
!1});return a=c});var c=a?this.youWon():this.youLost();this.$messageBox.html("").append(c).show();this.inProgress=!1},cheat:function(){this.inProgress&&this.showMines()},youWon:function(){var a=b("<div />",{}).addClass("winner message");b("<div />").addClass("line").appendTo(a);b("<div />",{html:"<h2>You Won!</h2><h3>Awesome.</h3>"}).addClass("content").appendTo(a);return a},youLost:function(){var a=b("<div />",{}).addClass("loser message");b("<div />").addClass("line").appendTo(a);b("<div />",{html:"<h2>You Lost!</h2><h3>Bye bye, legs.</h3>"}).addClass("content").appendTo(a);
return a},fillBoard:function(){if(!this.data||!this.data.rows.length){for(var a=0;a<this.settings.size;a++)this.rows[a]=[],this.makeRow(a);this.setMines()}else{var c=this;b.each(this.data.rows,function(a){c.rows[a]=[];c.makeRow(a,this)});this.mines=this.data.mines}},makeRow:function(a,c){var d=this.rows[a],e=b("<div />",{}).addClass("row clearfix").appendTo(this.$board);if(c){var g=this;b.each(c,function(){var b=new Ease.Minesweeper.Tile(g,this);b.row=a;b.col=d.push(b)-1;if(b.settings.value)b.settings.value=
parseInt(b.settings.value,10);b.$tile.appendTo(e)})}else for(var j=0;j<this.settings.size;j++){var f=new Ease.Minesweeper.Tile(this,{});f.row=a;f.col=d.push(f)-1;f.$tile.appendTo(e)}},setMines:function(){for(var a=this,c=0;c<this.settings.numberOfMines;c++){for(var d=!1;!d;){var e=this.getRandomTileCoords();b.inArray(e,this.mines)<0&&(d=e)}this.mines.push(d)}b.each(this.mines,function(){a.getTileByCoordsString(this).settings.isMine=!0})},showMines:function(){var a=this;b.each(this.mines,function(){a.getTileByCoordsString(this).$tile.addClass("mine")})},
getTileByCoordsString:function(a){a=a.split(",");return this.getTileByCoords(a[0],a[1])},getTileByCoords:function(a,b){return this.rows[a][b]},getRandomTileCoords:function(){return this.random(this.settings.size)+","+this.random(this.settings.size)},countAdjacentMines:function(a){var c=0;b.each(a,function(){this.settings.isMine&&c++});return c},getAdjacentTiles:function(a){for(var b=[],d=a.row,a=a.col,e=d+1>this.settings.size-1?d:d+1,g=a-1<0?a:a-1,j=a+1>this.settings.size-1?a:a+1,f=d-1<0?d:d-1;f<=
e;f++)for(var h=g;h<=j;h++)f===d&&h===a||this.rows[f][h].settings.exposed||b.push(this.rows[f][h]);return b},random:function(a){return~~(Math.random()*a)},trackInstance:function(){if(typeof this.constructor.instances==="undefined")this.constructor.instances=[];return this.instance=this.constructor.instances.push(this)-1}};Ease.Minesweeper.Tile=function(a,c){this.settings={flagClass:"flag",isMine:!1,exposed:!1,flagged:!1,value:null};b.extend(this.settings,c);this.superclass=a;this.col=this.row=0;this.$tile=
null;this.init()};Ease.Minesweeper.Tile.prototype={init:function(){var a=this;this.$tile=b("<div />").addClass("tile").click(function(b){return a.exposeTile.apply(a,arguments)}).bind("contextmenu",function(b){a.flagTile.apply(a,arguments);return!1});this.settings.exposed&&this.setTileAsExposed();this.settings.flagged&&this.flagTile()},flagTile:function(){if(this.settings.exposed||!this.superclass.inProgress)return!1;this.$tile.hasClass(this.settings.flagClass)?(this.settings.flagged=!1,this.$tile.removeClass(this.settings.flagClass),
this.superclass.counter++):(this.settings.flagged=!0,this.$tile.addClass(this.settings.flagClass),this.superclass.counter--);this.superclass.$counter.triggerHandler(Ease.Events.FLAG_CHANGE)},exposeTile:function(){if(this.settings.exposed||this.settings.flagged||!this.superclass.inProgress)return!1;if(this.settings.isMine)this.$tile.addClass("exposed"),this.settings.exposed=!0,this.superclass.$board.triggerHandler(Ease.Events.GAME_OVER);else{var a=this.superclass.getAdjacentTiles(this);this.settings.value=
this.superclass.countAdjacentMines(a);this.setTileAsExposed();this.settings.value===0&&b.each(a,function(){var a=this;setTimeout(function(){a.$tile.triggerHandler("click")},0)});a=null}},setTileAsExposed:function(){this.settings.exposed=!0;this.$tile.text(this.settings.value).removeClass(this.settings.flagClass).addClass("exposed adj"+this.settings.value)}}})(jQuery);(function(b){b(document).ready(function(){new Ease.Minesweeper({cont:"#main"})})})(jQuery);