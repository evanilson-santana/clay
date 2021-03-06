/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {default as formatDate} from 'date-fns/format';
import {default as parseDate} from 'date-fns/parse';

export {formatDate, parseDate};

export interface IDay {
	date: Date;
	outside?: boolean;
}

export type WeekDays = Array<IDay>;

export type Month = Array<WeekDays>;

/**
 * Clone a date object.
 */
export function clone(date: number | Date) {
	return new Date(date instanceof Date ? date.getTime() : date);
}

export function getDaysInMonth(d: Date) {
	const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1, 12);

	firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
	firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1);

	return firstDayOfMonth.getDate();
}

/**
 * Utility function to generate a table two days of the month.
 * Based on (This implementation does not have the fixation of
 * 6 weeks) https://github.com/gpbl/react-day-picker/blob/master/src/Helpers.js#L55
 *
 * @example
 * getWeekArray(new Date(), 0);
 *
 * [
 *   [
 *     {
 *       date: Sun Dec 30 2018 12:00:00 GMT-0300...
 *       outside: true
 * 	   },
 *     ...
 *   ]
 *   ...
 * ]
 *
 * The `outside` property references when a day
 * does not belong to the current month.
 */
export function getWeekArray(d: Date, firstDayOfWeek = 0): Month {
	const daysInMonth = getDaysInMonth(d);
	const dayArray: Array<IDay> = [];

	let week: WeekDays = [];
	const weekArray: Month = [];

	for (let i = 1; i <= daysInMonth; i += 1) {
		const genDay = new Date(d.getFullYear(), d.getMonth(), i, 12);
		dayArray.push({date: genDay});
	}

	dayArray.forEach((day) => {
		if (week.length > 0 && day.date.getDay() === firstDayOfWeek) {
			weekArray.push(week);
			week = [];
		}
		week.push(day);
		if (dayArray.indexOf(day) === dayArray.length - 1) {
			weekArray.push(week);
		}
	});

	// unshift days from start of the first week
	const firstWeek = weekArray[0];
	for (let i = 7 - firstWeek.length; i > 0; i -= 1) {
		const outsideDate = clone(firstWeek[0].date);
		outsideDate.setDate(firstWeek[0].date.getDate() - 1);
		firstWeek.unshift({date: outsideDate, outside: true});
	}

	// push days until the end of the last week
	const lastWeek = weekArray[weekArray.length - 1];
	for (let i = lastWeek.length; i < 7; i += 1) {
		const outsideDate = clone(lastWeek[lastWeek.length - 1].date);
		outsideDate.setDate(lastWeek[lastWeek.length - 1].date.getDate() + 1);
		lastWeek.push({date: outsideDate, outside: true});
	}

	return weekArray;
}

export function range({end, start}: {end: number; start: number}) {
	return Array.from(
		{
			length: end - start + 1,
		},
		(v, k) => k + start
	);
}

export function addMonths(date: number | Date, months: number) {
	date = clone(date);

	date.setMonth(date.getMonth() + months);

	return date;
}

export function setDate(
	date: Date,
	obj: {
		date?: number | string;
		seconds?: number | string;
		milliseconds?: number | string;
		hours?: number | string;
		minutes?: number | string;
		year?: number | string;
	}
) {
	date = clone(date);

	return Object.keys(obj).reduce((acc, key) => {
		const method = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
		// @ts-ignore
		acc[method](obj[key]);

		return acc;
	}, date);
}

export function isValid(date: Date) {
	return date instanceof Date && !isNaN(date.getTime());
}
