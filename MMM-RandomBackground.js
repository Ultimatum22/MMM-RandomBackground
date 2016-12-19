/* global Module */

/* Magic Mirror
 * Module: MMM-RandomBackground
 */

Module.register('MMM-RandomBackground', {

	defaults: {
		animationSpeed: 1000,
		updateInterval: 10 * 60 * 1000, // Update every 10 minutes.
		showAdditionalInfo: false,
		randomOrder: true,
		photoDirectories: [] // Additional folders to find photos in
	},
	
	loaded: false,
	
	start: function() {
		console.log('Background module started!');
		console.log('Display in order: ' + (this.config.randomOrder ? 'Yes' : 'No'));
		this.imageIndex = 0;
		this.images = {}

		this.sendSocketNotification('RANDOM_IMAGES_GET');
	},
	
	getDom: function() {
		var wrapper = document.createElement('div');
		
		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");

			return wrapper;
		}
		
		var image = this.images.photo[this.imageIndex];
		var backgroundImage = document.createElement('div');
		backgroundImage.className = 'background-image fullscreen';
		
		var backgroundPlaceholder1 = document.createElement('div');
		backgroundPlaceholder1.id = 'background-placeholder-1';
		backgroundPlaceholder1.className = 'fullscreen';
		
		var backgroundPlaceholder2 = document.createElement('div');
		backgroundPlaceholder2.id = 'background-placeholder-2';
		backgroundPlaceholder2.className = 'fullscreen';
		
		backgroundImage.appendChild(backgroundPlaceholder1);
		backgroundImage.appendChild(backgroundPlaceholder2);

		wrapper.appendChild(backgroundImage);
		
		var imageInfo = document.createElement('div');
		imageInfo.className = 'image-info';
		
		var imageTitle = document.createElement('div');
		imageTitle.className = 'image-title';
		
		var imageOwner = document.createElement('div');
		imageOwner.className = 'image-owner';
		imageOwner.id = 'image-owner';
		
		imageInfo.appendChild(imageTitle);
		imageInfo.appendChild(imageOwner);
		
		if (this.config.showAdditionalInfo) {
			wrapper.appendChild(imageInfo);
		}
		
		return wrapper;
	},
	
	loadImage: function() {
		var self = this;
		
		// Refactor this code
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
		$('<img/>').attr('src', image.photolink).load(function() {
			$('#background-placeholder-1').css({
					background: '#000 url("' + image.photolink + '") center center',
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat'
				}).animate({
				opacity: 1.0
			}, self.config.animationSpeed, function() {
				$(this).attr('id', 'background-placeholder-2');
				$('#image-owner').html('Taken by ' + image.takenBy + ' on ' + image.dateTaken);
			});

			$('#background-placeholder-2').animate({
				opacity: 0
			}, self.config.animationSpeed, function() {
				$(this).attr('id', 'background-placeholder-1');
			});
		});
	},
	
	scheduleUpdateInterval: function() {
		var self = this;
		
		console.log('Scheduled update interval set up...');
		self.updateDom(self.config.animationSpeed);
		
		setInterval(function() {
			// Get random photo from array
			self.nextImageIndex();

			self.loadImage();
			
		}, this.config.updateInterval);
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'RANDOM_IMAGE_LIST') {
			this.images = payload;
			
			if (!this.loaded) {
				this.scheduleUpdateInterval();
			}
			
			this.loaded = true;
			this.updateDom();
			this.loadImage();
		}
	},
	
	nextImageIndex: function() {
		var self = this;
		var imageCount = self.images.photo.length;
		
		if (this.config.randomOrder) {
			this.imageIndex = Math.round(Math.random() * (imageCount - 1));
		} else {
			this.imageIndex++;
			if (this.imageIndex == imageCount) { // last image, reset counter
				this.imageIndex = 0;
			}
		}
	},

    getStyles: function(){
        return [ 'random-background.css' ]
    },

	getScripts: function() {
		return [ this.file('node_modules/jquery/dist/jquery.min.js') ];
	}
});