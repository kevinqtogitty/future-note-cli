import { setTimeout } from 'node:timers/promises';
import { intro, outro, text, group, cancel, isCancel } from '@clack/prompts';
import dayjs from 'dayjs';

function stringNotEmpty(string: string) {
	if (string.length === 0) return false;
	return true;
}

export async function cliTool() {
	console.clear();

	await setTimeout(1000);

	intro('Welcome to Future-note!');
	const message = await text({
		message: 'Enter the message you wish to send',
		placeholder: 'Happy Birthday Mom!',
		validate(value) {
			if (!stringNotEmpty(value)) return "You didn't enter in anything...";
		}
	});

	const date = await text({
		message: 'What date?',
		placeholder: 'example: 07/23/2024',
		validate(date) {
			if (!stringNotEmpty(date)) return "You didn't enter in anything...";
			if (!dayjs(date, 'YYYY/MM/DD').isValid())
				return 'Invalid date format, it must be in MM/DD/YYY';
		}
	});

	const hour = await text({
		message: 'Hour?',
		placeholder: 'Use 24 hour format i.e 13 = 1 PM',
		validate(hour) {
			if (!stringNotEmpty(hour)) return "You didn't enter in anything...";
			if (Number(hour) < 0 || Number(hour) > 24) return 'Invalid hour, valid hours are 0-24';
		}
	});

	const minute = await text({
		message: 'Minute?',
		placeholder: '0-59',
		validate(minute) {
			if (!stringNotEmpty(minute)) return "You didn't enter in anything...";
			if (Number(minute) < 0 || Number(minute) > 59)
				return 'Invalid minute, valid minutes are 0-59';
		}
	});

	const scheduleToSendAt = dayjs(
		`${String(date)} ${String(hour)}:${String(minute)}`,
		'MM/DD/YYYY H:mm'
	).unix();

	if (scheduleToSendAt <= dayjs().unix()) {
		cancel('Message must be scheduled at least 5 minutes into the future. Please start again');
	}
}

cliTool();
