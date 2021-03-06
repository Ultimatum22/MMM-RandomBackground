var NodeHelper = require('node_helper');
var request = require('request');
var ExifImage = require('exif').ExifImage;

module.exports = NodeHelper.create({
	
	init : function () {
		console.log('Initializing mm-background module helper ...');
	},

	socketNotificationReceived : function (notification, payload) {
		if (notification === 'RANDOM_IMAGES_GET') {
			var self = this;

			var photoDir = './modules/MMM-RandomBackground/photos/';
			var recursive = require('recursive-readdir');

			var images = {}
			images.photo = new Array();
			
			recursive(photoDir, function (err, data) {
				if (data !== undefined && data.length > 0) {
				
					for (i = 0; i < data.length; i++) {
						
						var photoLocation = data[i].substr(photoDir.length - 2); // Remove ./ at the start
						var photoData = photoLocation.split('/');
						var dateTaken = "00:00:00 00:00:00";
						
						try {
							new ExifImage({ image : data[i] }, function (error, exifData) {
								if (error) {
									console.log('Error: ' + error.message);
								} else {
									dateTaken = exifData.exif.DateTimeOriginal;
								}
							});
						} catch (error) {
							console.log('Error: ' + error.message);
						}

						images.photo.push({
							'photolink': data[i],
							'takenBy': photoData[photoData.length - 2],
							'dateTaken': dateTaken
						});
					}
				} else {
					console.log('No photo\'s found, make sure there is a folder called \'photos\' in this directory');
				}

				console.log('Loaded ' + images.photo.length + ' images.');
				self.sendSocketNotification('RANDOM_IMAGE_LIST', images);
			});
		}
	}
});