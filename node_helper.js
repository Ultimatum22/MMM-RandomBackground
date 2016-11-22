 var NodeHelper = require("node_helper");
 var request = require('request');
 
module.exports = NodeHelper.create({
	init: function() {
		console.log('Initializing mm-background module helper ...');
	},
	
	socketNotificationReceived: function(notification, payload) {
		console.log('getImagesFromDirectory');
		
		if (notification === 'IMAGES_GET') {
			var self = this;
			
			console.log('getImagesFromDirectory');
			//var fs = require('fs');
			var recursive = require('recursive-readdir');
			var images = {}
			images.photo = new Array();
			
			recursive('modules/mmm-background/photos/', function (err, data) {
				console.log('Loaded1 ' + data.length + ' images.');
				for (i = 0; i < data.length; i++) {
					console.log('Data: ' + data[i]);
					
					images.photo.push({
						'photolink': data[i]
					});
				}
				
				console.log('Loaded2 ' + images.photo.length + ' images.');
				self.sendSocketNotification('IMAGE_LIST', images);
			});
			
			/*fs.readdir('modules/mmm-background/photos/Roadtrip-2014/Dave', (err, data) => {
				
				console.log('Loaded1 ' + data.length + ' images.');
				for (i = 0; i < data.length; i++) {
					//console.log('Data: ' + data[i]);
					
					images.photo.push({
						'photolink': 'modules/mmm-background/photos/Roadtrip-2014/Dave/' + data[i]
					});
				}
				
				console.log('Loaded2 ' + images.photo.length + ' images.');
				self.sendSocketNotification('IMAGE_LIST', images);
			});*/		
		}
	}
});