var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({
		init : function () {
			console.log('Initializing mm-background module helper ...');
		},

		// Windows?
		win32: process.platform === 'win32',
		// Normalize \\ paths to / paths.
		unixifyPath: function(filepath) {
			var self = this;
			if (self.win32) {
				return filepath.replace(/\\/g, '/');
			} else {
				return filepath;
			}
		},

		// Recurse into a directory, executing callback for each file.
		walk: function(rootdir, callback, subdir) {
			var self = this;
			var fs = require('fs');
			var path = require('path');
			var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
			fs.readdirSync(abspath).forEach(function (filename) {
				var filepath = path.join(abspath, filename);
				if (fs.statSync(filepath).isDirectory()) {
					self.walk(rootdir, callback, self.unixifyPath(path.join(subdir || '', filename || '')));
				} else {
					callback(self.unixifyPath(filepath), rootdir, subdir, filename);
				}
			});
		},

		socketNotificationReceived : function (notification, payload) {
			if (notification === 'IMAGES_GET') {
				var self = this;

				var recursive = require('recursive-readdir');

				var images = {}
				images.photo = new Array();

				self.walk('./modules/MMM-RandomBackground/photos/', function(filepath, rootdir, subdir, filename) {
					images.photo.push({
						'photolink' : filepath
					});
				});
				
				if (images.photo.length == 0) {
					console.log('No photo\'s found, make sure there is a folder called \'photos\' in this directory');
				} else {				
					console.log('Loaded ' + images.photo.length + ' images.');
					self.sendSocketNotification('IMAGE_LIST', images);
				}
				
				/*recursive('modules/MMM-RandomBackground/photos/', function (err, data) {
					if (data !== undefined && data.length > 0) {
						for (i = 0; i < data.length; i++) {
							images.photo.push({
								'photolink' : data[i]
							});
						}
					} else {
						console.log('No photo\'s found, make sure there is a folder called \'photos\' in this directory');
					}

					console.log('Loaded ' + images.photo.length + ' images.');
					self.sendSocketNotification('IMAGE_LIST', images);
				});*/
			}
		}
	});
