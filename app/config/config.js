const env = process.env.NODE_ENV || 'local';
console.log(env);
let config = Object.assign({}, require('./default'), require(`./env/${env}`));

Object.keys(config.urls).forEach((name) => {
	const ref = config.urls[name];
	let url = '';
	url += (typeof ref.protocol === 'undefined' ? 'http' : ref.protocol) + '://';
	url += ref.host;
	if (typeof ref.port !== 'undefined')
		url += `:${ref.port}`;
	ref.domain = url;
});

module.exports = config;
