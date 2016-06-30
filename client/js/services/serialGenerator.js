app.provider('serialGenerator', function() {
	this.$get = function() {
		return {
			generate: function(_length) {
				var serial = '';
				while(serial.length < _length) {
					serial += Math.floor(Math.random() * 64);
				}
				return serial;
			}
		}
	}
});