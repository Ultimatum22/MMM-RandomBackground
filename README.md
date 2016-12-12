# MagicMirror Module: MMM-RandomBackground
A MagicMirror Module to show random backgrounds from a local folder on the Mirror.

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
git clone https://github.com/Ultimatum22/MMM-RandomBackground.git
npm install
````

Configure the module in the `config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module : 'MMM-RandomBackground',
		position : 'fullscreen_below', // Any region but this one makes the most sense
		config : {
			animationSpeed : 2000,
			updateInterval : 5000
		}
	}
]
````

## Configuration options
The following properties can be configured:

<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>animationSpeed</code></td>
			<td>How fast the new image fades into the old one (in milliseconds). A higher value means a slower animation. Default is 1000 ms.</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>How often a new photo is displayed, default is 10 minutes.</td>
		</tr>
		<tr>
			<td><code>photoDirectories</code></td>
			<td>[Functionality not yet implemented]</td>
		</tr>
	</tbody>
</table>
