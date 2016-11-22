/* global Module */

/* Magic Mirror
 * Module: MMM-Flickr
 *
 * By Jim Kapsalis https://github.com/kapsolas
 * MIT Licensed.
 */

Module.register('MMM-RandomBackground', {
	defaults: {
		position: 'fullscreen_below',
		animationSpeed: 1000,
		updateInterval: 6000,
		loadingText: 'Loading images...'
	},
	
	start: function() {
		console.log("Background module started!");
		this.imageIndex = 0;
		this.loaded = false;
		this.images = {}
		this.getImages();
	},
	
	getImages: function() {
		this.sendSocketNotification('IMAGES_GET');
	},
	
	getDom: function() {
		var wrapper = document.createElement('div');
		var imageDisplay = document.createElement('div');
		
		if (!this.loaded) {
			wrapper.innerHTML = this.config.loadingText;
			return wrapper;
		}
		
		var image = this.images.photo[this.imageIndex];
		var imageLink = document.createElement('div');
		imageLink.id = 'mmm-background-image';
		imageLink.innerHTML = '<img src="' + image.photolink + '" style="width: 100%; height: 100%">';
		
		imageDisplay.appendChild(imageLink);
		wrapper.appendChild(imageDisplay);
		
		return wrapper;
	},
	
	scheduleUpdateInterval: function() {
		var self = this;
		
		console.log('Scheduled update interval set up...');
		self.updateDom(self.config.animationSpeed);
		
		setInterval(function() {
			self.imageIndex = Math.round(Math.random() * (this.images.photo.length - 1))
			self.updateDom(self.config.animationSpeed);
		}, this.config.updateInterval);
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'IMAGE_LIST') {
			this.images = payload;
			
			if (!this.loaded && this.images.photos.length > 0) {
				this.updateDom(1000);
				this.scheduleUpdateInterval();
			}
			this.loaded = true;
		}
	}
});