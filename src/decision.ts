

import * as async from 'async';




const decisionQueue = async.queue(async (task) => {

	await new Promise((res) => {
		setTimeout(res, 1000);
	});

	return 'somedata';

}, 1);

