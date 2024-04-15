import Bugsnag from '@bugsnag/js';
import BugsnagPluginAwsLambda from '@bugsnag/plugin-aws-lambda';
import BugsnagPluginKoa from '@bugsnag/plugin-koa';

function initializeBugSnag() {
	if (!Bugsnag.isStarted()) {
		Bugsnag.start({
			apiKey: process.env.BUGSNAG || '',
			plugins: [BugsnagPluginAwsLambda, BugsnagPluginKoa]
		});
	}

	return {
		handler: Bugsnag.getPlugin('awsLambda')!.createHandler(),
		bugsnagMiddlware: Bugsnag.getPlugin('koa'),
		Bugsnag
	};
}

export default initializeBugSnag;
