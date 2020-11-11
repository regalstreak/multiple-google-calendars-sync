# Multiple Google Calendars Sync
Sync multiple Google Calendars into one, seamlessly

## Why
* This is a simple **Google AppsScript** script which is used for syncing multiple Google Calendars into one.
* Imagine you had multiple Google Calendars, and you wanted to give your manager or your co-worker access to a merged version of a busy/free calendar to schedule meetings. This AppsScript provides you with an easy way to do so. 
* IFTTT and Zapier do not provide an easy way to do this, and AppsScript is a free and working alternative to the already existing paid services.
* All you need to do is follow the instructions below.

## Getting Starting
1. Make sure every Google Calendar you want synced is shared with the Google account that holds the shared calendar
2. Log into the account that holds the shared calendar and go to the [Google AppsScript](https://script.google.com)
3. Create a new project
4. Replace everything in `Code.gs` with the contents of `SyncCalendars.js` (the file extension is not important here)
5. Go to `View -> Show Manifest` and update its content with `appsScript.json` after saving the project (name doesn't matter here)
6. Update `calendarsToMerge`, `calendarToMergeInto`, and `daysToSync` in the `Code.gs` file there, instructions are documented in the code itself
7. Click on the `trigger-clock icon` to add a trigger (5th icon from the left below File/Edit/View/Run)
8. Click on `Add Trigger` and set it up with the following values and you should be good to go!
* Choose which function to run - `syncCalendars`
* Choose which deployment should run - `Head`
* Select event source - `Time-driven`
* Select type of time based trigger - `Hour timer`
* Select hour interval - `Every hour`
* Failure notification settings - `Notify me daily`

You can test this out by running the script with the run button (play icon in the code view) and check if you have recieved any new events in your shared calendar. It'll run automatically every hour.


## Notes
1. Google AppsScript has a daily limit of 5k calendar events created every day.
2. Make sure you turn off notifications in AppsScript and the shared calendar, or you'd be bombarded with event creation mails!

If you are facing a problem, feel free to contact me or create an issue over here, pull requests are welcome as well!
