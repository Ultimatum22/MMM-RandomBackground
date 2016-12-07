/* global Module */

/* Magic Mirror
 * Module: MMM-RandomBackground
 */

Module.register('MMM-RandomBackground', {
	defaults: {
		position: 'fullscreen_below',
		animationSpeed: 2000,
		updateInterval: 60000, // Every minute
		loadingText: 'Loading images...',
		photoDirectories: [] // Additional folders to find photos in
	},
	
	loaded: false,
	
	start: function() {
		console.log("Background module started!");
		this.imageIndex = 0;
		this.images = {}
		this.sendSocketNotification('IMAGES_GET');
	},

    getStyles: function(){
        return ['random-background.css']
    },
	
	getDom: function() {
		var wrapper = document.createElement('div');
		var imageDisplay = document.createElement('div');
		
		if (!this.loaded) {
			wrapper.innerHTML = this.config.loadingText;
			return wrapper;
		}
		
		var image = this.images.photo[this.imageIndex];
		var backgroundImage = document.createElement('div');
		backgroundImage.className = 'background-image fullscreen';
		
		//backgroundImage.innerHTML = '<img src="' + image.photolink + '" style="width: 100%; height: 100%">';
		
		var backgroundPlaceholder1 = document.createElement('div');
		backgroundPlaceholder1.id = 'background-placeholder-1';
		backgroundPlaceholder1.className = 'fullscreen';
		
		var backgroundPlaceholder2 = document.createElement('div');
		backgroundPlaceholder2.id = 'background-placeholder-2';
		backgroundPlaceholder2.className = 'fullscreen';
		
		backgroundImage.appendChild(backgroundPlaceholder1);
		backgroundImage.appendChild(backgroundPlaceholder2);
		imageDisplay.appendChild(backgroundImage);
		
		var imageInfo = document.createElement('div');
		imageInfo.className = 'image-info';
		
		var imageTitle = document.createElement('div');
		imageTitle.className = 'image-title';
		imageTitle.innerHTML = 'Title!';
		
		var imageOwner = document.createElement('div');
		imageOwner.className = 'image-owner';
		imageOwner.innerHTML = 'Owner!';
		
		imageInfo.appendChild(imageTitle);
		imageInfo.appendChild(imageOwner);
		
		wrapper.appendChild(imageInfo);
		
		/*<div id="content" class="abs-zero">
	  <div id="background-placeholder-1" class="abs-zero" style="display: block; background: url(&quot;https://farm6.staticflickr.com/5651/30413489444_c61b20b155_h.jpg&quot;) center center / cover no-repeat rgb(0, 0, 0); z-index: 10;"></div>
	  <div id="background-placeholder-2" class="abs-zero" style="background: none; z-index: 9; display: none;"></div>
    </div>*/
		
		wrapper.appendChild(imageDisplay);
		
		return wrapper;
	},
	
	loadImage: function() {
		var self = this;
		
		var backgroundPlaceholder1 = $('#background-placeholder-1');
		var backgroundPlaceholder2 = $('#background-placeholder-2');
		
		if (backgroundPlaceholder1.is(':visible')) {
			var top = backgroundPlaceholder1;
			var bottom = backgroundPlaceholder2;
		} else {
			var top = backgroundPlaceholder2;
			var bottom = backgroundPlaceholder1;
		}
		
		var image = self.images.photo[self.imageIndex];
		console.log('Load image: ' + image.photolink);
		$('<img/>').attr('src', image.photolink).load(function() {
			
			bottom.css({
				background: '#000 url(' + image.photolink + ') center center',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat'
			});
			bottom.show();
			
			//top.animate({ opacity: 0 }, 500);
			//bottom.animate({ opacity: 0.8 }, 500);
			
			top.fadeOut(2500, function() {
				top.css({
					background: 'none',
			//		zIndex: 9,
				});
				bottom.css({
				//	zIndex: 10
				});
			});
		});
	},
	
	scheduleUpdateInterval: function() {
		var self = this;
		
		console.log('Scheduled update interval set up...');
		self.updateDom(self.config.animationSpeed);
		
		setInterval(function() {
			self.imageIndex = Math.round(Math.random() * (self.images.photo.length - 1));

			self.loadImage();
			
		}, this.config.updateInterval);
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'IMAGE_LIST') {
			this.images = payload;
			
			if (!this.loaded) {
				this.scheduleUpdateInterval();
			}
			
			this.loaded = true;
			this.updateDom();
			this.loadImage();
		}
	},
	
	getScripts: function() {
		return [ this.file('node_modules/jquery/dist/jquery.min.js') ];
	}
});