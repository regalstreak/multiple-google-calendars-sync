// ----------------------------------------------------------------------------
// Put your own values below
// ----------------------------------------------------------------------------

// Calendars to merge from.

// "[X]" is what is placed in front of your calendar event in the shared calendar.
// Use "" if you want none.
// You can remove or add more calendars if you want
// Make sure that you have shared these calendars to the Google account this AppsScript will run from 
const CALENDARS_TO_MERGE = {
	"[CalendarName1]": "calendar1@yourGsuiteDomain.com",
	"[CalendarName2]": "calendar2@yourGsuiteDomain.com",
	"[CalendarName3]": "calendar3@yourGsuiteDomain.com",
};


// The ID of the shared calendar
// Get it from calendar settings
const CALENDAR_TO_MERGE_INTO =
	"somealphanumericstringhere@group.calendar.google.com";


// Number of days in the future to run.
// The more you have, the more likely Google AppsScript would fail (free limits)
// 15 just works good if you have around 8-10 events a day
const DAYS_TO_SYNC = 15;



// ----------------------------------------------------------------------------
// DO NOT TOUCH FROM HERE ON
// ----------------------------------------------------------------------------

// Delete any old events that have been already cloned over.
// This is basically a sync w/o finding and updating. Just deleted and recreate.
function deleteEvents(startTime, endTime) {
	const sharedCalendar = CalendarApp.getCalendarById(CALENDAR_TO_MERGE_INTO);
	const events = sharedCalendar.getEvents(startTime, endTime);

	const requests = events.map((e, i) => ({
		method: "DELETE",
		endpoint: `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_TO_MERGE_INTO}/events/${e
			.getId()
			.replace("@google.com", "")}`,
	}));

	if (requests && requests.length) {
		const result = BatchRequest.EDo({
			useFetchAll: true,
			batchPath: "batch/calendar/v3",
			requests: requests,
		});
		console.log(`${requests.length} deleted events.`);
	} else {
		console.log("No events to delete.");
	}
}

function createEvents(startTime, endTime) {
	let requests = [];

	for (let calenderName in CALENDARS_TO_MERGE) {
		const calendarId = CALENDARS_TO_MERGE[calenderName];
		const calendarToCopy = CalendarApp.getCalendarById(calendarId);

		if (!calendarToCopy) {
			console.log("Calendar not found: '%s'.", calendarId);
			continue;
		}

		// Find events
		const events = Calendar.Events.list(calendarId, {
			timeMin: startTime.toISOString(),
			timeMax: endTime.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		// If nothing find, move to next calendar
		if (!(events.items && events.items.length > 0)) {
			continue;
		}

		events.items.forEach((event) => {
			// Don't copy "free" events.
			if (event.transparency && event.transparency === "transparent") {
				return;
			}

			if (!event.summary || event.summary === "undefined") {
				event.summary = "Busy";
			}

			requests.push({
				method: "POST",
				endpoint: `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_TO_MERGE_INTO}/events`,
				requestBody: {
					summary: `${calenderName} ${event.summary}`,
					location: event.location,
					description: event.description,
					start: event.start,
					end: event.end,
				},
			});
		});
	}

	if (requests && requests.length) {
		const result = BatchRequest.EDo({
			batchPath: "batch/calendar/v3",
			requests: requests,
		});
		console.log(`${requests.length} events created via BatchRequest`);
	} else {
		console.log("No events to create.");
	}
}

function syncCalendars() {
	// Midnight today
	const startTime = new Date();
	startTime.setHours(0, 0, 0, 0);

	const endTime = new Date(startTime.valueOf());
	endTime.setDate(endTime.getDate() + DAYS_TO_SYNC);

	deleteEvents(startTime, endTime);
	createEvents(startTime, endTime);
}
