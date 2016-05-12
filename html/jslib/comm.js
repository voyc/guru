
/**
	Server Communication
	creates one Xhr object for each server request.

	Usage:	
		Comm.request('getwisdom', 'this is input data', function(response) {
			prompt('I received this response: ' + response);
		});
**/
Comm = function(baseUrl) {
	this.baseUrl = baseUrl; // || 'http://login.hagstrand.com/svc/';
	this.seq = 1;
}

Comm.prototype = {
	/**
		svc - string name of the service
		data - javascript object, key-value pairs, all strings
			This data will be the $_POST object in the service.
		callback - a function with prototype (boolean ok,string response,object) 
	**/
	request: function(svc, data, callback) {
		var xhr = new Xhr();
		xhr.base = this.baseUrl;
		xhr.svc = svc;
		xhr.data = data;
		xhr.callback = callback;
		xhr.seq = this.seq++;
		xhr.callServer();
	}
}


/**
 * Wraps XMLHttpRequest object
 */
Xhr = function() {
	this.req = null;
	this.base = "http://guru.hagstrand.com/svc/";
	this.svc = "echo";
	this.data = "";
	this.method = "POST";   // GET, PUT, POST, DELETE
	this.callback = null;
	this.retries = 0;
	this.maxretries = 3;
	this.seq = 0;
	this.start = 0;
	this.end = 0;
	this.elapsed = 0;
	this.ok = true;
}

Xhr.prototype = {
	callServer :function() {
		if (!this.retries) {
			this.start = Date.now();
		}

		this.req = new XMLHttpRequest();

		var self = this;
		this.req.onreadystatechange = function() { self._callback() };

		var url = this.base + this.svc;
		this.req.open(this.method, url, true);

		this.req.onabort = function() {
			console.log(self.log('in onabort'));
		};

		this.req.onerror = function() {
			console.log(self.log('in onerror'));
		};

		// note: Chrome has its own timeout processing.
		// When Chrome times out, xhr returns status 0 and this callback is not called.
		this.req.ontimeout = function() {
			console.log(this.log('in ontimeout'));
		};
		//this.req.timeout = 5000;

		this.req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//	this.req.send("data="+escape(this.data));
		this.req.send(compose_str(this.data)); // do we need to escape this?
		console.log(this.log('request sent'));
	},
	/**
	 * Called on return from the server.
	 * @private
	 */
	_callback : function() {
		if (this.req.readyState != 4) {
			return;
		}
		
		// check results: ok or not
		this.ok = true;
		try {
			if (this.req.status != 200 && this.req.status != 0) {
				console.log(this.log('callback status='+this.req.status));
				this.ok = false;
			}
			else if (!this.req.responseText) {
				console.log(this.log('callback responseText is empty'));
				this.ok = false;
			}
		}
		catch(error) {
			console.log(this.log('caught callback error='+error));
			this.ok = false;
		}
	
		// retry if appropriate
		if (!this.ok) {
			if (this.retries < this.maxretries) {
				console.log(this.log('retrying'));
				this.retries++;
				delete this.req;  // delete the request with all its callbacks
				this.callServer();  // this will create a new req
			}
			else {
				if (this.callback) {
					this.end = Date.now();
					this.elapsed = this.end - this.start;
					this.callback(this.ok, "server error " + this.req.status, this);
				}
			}
		}

		// call the user's callback
		else {
			if (this.callback) {
				this.end = Date.now();
				this.elapsed = this.end - this.start;
				console.log(this.log('xhr response received'));
				var response = JSON.parse(this.req.responseText);
				this.callback(this.ok, response, this);
			}
		}
	},

	// compose log message	
	log: function(msg) {
		return 'xhr '+this.seq+'-'+this.retries+': ' + msg;
	}
}

/**
 * Compose a query string from a javascript object
 * This string will be undone by php parse_str().
 */
compose_str = function(params) {
	var s = '';
	var a = '';
	for (i in params) {
		s += i + '=' + params[i] + '&';
	}
	return s;
}
