interface Config {
	readonly oauth_url: string;
	redirect_url: string;
	client_id: string;
	client_secret: string;
}

const config: Config = {
	oauth_url: 'https://github.com/login/oauth/authorize',
	redirect_url: 'http://39.106.93.60/login',
	client_id: 'my-info',
	client_secret: 'my-secret'
};

//本地开发，测试数据
if (process.env.NODE_ENV === 'development') {
	(config.redirect_url = 'http://localhost:3001/login'),
		(config.client_id = '502176cec65773057a9e'),
		(config.client_secret = '65d444de381a026301a2c7cffb6952b9a86ac235');
}

export default config;
