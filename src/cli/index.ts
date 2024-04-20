import { setTimeout } from 'node:timers/promises';
import { intro, text, cancel, isCancel, spinner, outro } from '@clack/prompts';
import pc from 'picocolors';
import dayjs from 'dayjs';
import uniqId from 'uniqid';
import mongodbClient from '../mongodb/instance';

function stringNotEmpty(string: string) {
	if (string.length === 0) return false;
	return true;
}

function canceledExit() {
	cancel(pc.red('Exiting, see ya later!'));
	process.exit();
}

export async function cliTool() {
	console.clear();

	await setTimeout(1000);

	intro(`${pc.cyan('Welcome to Future-note!')}`);

	const message = await text({
		message: pc.magenta('Enter the message you wish to send'),
		placeholder: 'Happy Birthday Mom!',
		validate(value) {
			if (!stringNotEmpty(value)) return "You didn't enter in anything...";
		}
	});

	if (isCancel(message)) canceledExit();

	const date = await text({
		message: pc.magenta('What date?'),
		placeholder: 'example: 07/23/2024',
		validate(date) {
			if (!stringNotEmpty(date)) return "You didn't enter in anything...";
			if (!dayjs(date, 'YYYY/MM/DD').isValid())
				return 'Invalid date format, it must be in MM/DD/YYY';
		}
	});

	if (isCancel(date)) canceledExit();

	const hour = await text({
		message: pc.magenta('Hour?'),
		placeholder: 'Use 24 hour format i.e 13 = 1 PM',
		validate(hour) {
			if (!stringNotEmpty(hour)) return "You didn't enter in anything...";
			if (Number(hour) < 0 || Number(hour) > 24) return 'Invalid hour, valid hours are 0-24';
		}
	});

	if (isCancel(hour)) canceledExit();

	const minute = await text({
		message: pc.magenta('Minute?'),
		placeholder: '0-59',
		validate(minute) {
			if (!stringNotEmpty(minute)) return "You didn't enter in anything...";
			if (Number(minute) < 0 || Number(minute) > 59)
				return 'Invalid minute, valid minutes are 0-59';
		}
	});

	if (isCancel(minute)) canceledExit();

	const scheduleToSendAt = dayjs(
		`${String(date)} ${String(hour)}:${String(minute)}`,
		'MM/DD/YYYY H:mm'
	).unix();

	if (isCancel(scheduleToSendAt)) canceledExit();

	if (scheduleToSendAt <= dayjs().unix()) {
		cancel(
			pc.red('Message must be scheduled at least 5 minutes into the future. Please start again')
		);
	} else if (!message || !date || !hour || !minute) {
		cancel(pc.red('Either message, date, hour, or minute was missing'));
		process.exit();
	} else {
		const { start, stop } = spinner();

		try {
			start(pc.green('Scheduling Message'));
			const db = await mongodbClient({ database: 'prod' });
			const collection = db.collection('messages');

			const scheduledMessage = {
				type: 'MESSAGE',
				id: uniqId(),
				message,
				date,
				isSent: false,
				createdAt: dayjs().unix(),
				isDeleted: false
			};

			const { acknowledged } = await collection.insertOne(scheduledMessage);

			if (!acknowledged) {
				stop(pc.red('Failed to schedule message, please restart.'));
			} else {
				await setTimeout(3000);
				stop();
				outro(pc.green('Succesfully scheduled message, thanks!'));
			}

			process.exit();
		} catch (error) {
			stop(pc.red(`Caught an error while trying to schedule your message:\n${error}`));
			process.exit();
		}
	}
}

cliTool();
