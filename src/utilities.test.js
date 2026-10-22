import { execFileSync } from "child_process"
import { getLocalDayBounds } from "./utilities"

// Start a new Node process for each zone: changing TZ inside Jest's environment
// does not reliably change the timezone used by Date on every supported runtime.
function boundsInTimezone(timezone, year, month, day) {
  const script = `
    const getLocalDayBounds = ${getLocalDayBounds.toString()};
    const date = new Date(${year}, ${month - 1}, ${day}, 12, 34, 56, 789);
    const originalTime = date.getTime();
    const { startTime, endTime } = getLocalDayBounds(date);
    process.stdout.write(JSON.stringify({
      start: new Date(startTime).toISOString(),
      end: new Date(endTime).toISOString(),
      hours: (endTime - startTime) / 3600000,
      inputUnchanged: date.getTime() === originalTime
    }));
  `
  return JSON.parse(
    execFileSync(process.execPath, ["-e", script], { env: { ...process.env, TZ: timezone } }).toString()
  )
}

describe("getLocalDayBounds", () => {
  test.each([
    ["Europe/Madrid", 2026, 3, 29, "2026-03-28T23:00:00.000Z", "2026-03-29T22:00:00.000Z", 23],
    ["Europe/Madrid", 2026, 10, 25, "2026-10-24T22:00:00.000Z", "2026-10-25T23:00:00.000Z", 25],
    ["America/New_York", 2026, 3, 8, "2026-03-08T05:00:00.000Z", "2026-03-09T04:00:00.000Z", 23],
    ["America/New_York", 2026, 11, 1, "2026-11-01T04:00:00.000Z", "2026-11-02T05:00:00.000Z", 25],
    ["Europe/Madrid", 2026, 2, 10, "2026-02-09T23:00:00.000Z", "2026-02-10T23:00:00.000Z", 24],
    ["Europe/Madrid", 2026, 12, 31, "2026-12-30T23:00:00.000Z", "2026-12-31T23:00:00.000Z", 24],
    ["Europe/Madrid", 2028, 2, 29, "2028-02-28T23:00:00.000Z", "2028-02-29T23:00:00.000Z", 24],
    ["Asia/Kathmandu", 2026, 7, 9, "2026-07-08T18:15:00.000Z", "2026-07-09T18:15:00.000Z", 24],
    ["UTC", 2026, 3, 29, "2026-03-29T00:00:00.000Z", "2026-03-30T00:00:00.000Z", 24],
  ])("uses consecutive local midnights in %s on %i-%i-%i", (timezone, year, month, day, start, end, hours) => {
    expect(boundsInTimezone(timezone, year, month, day)).toEqual({ start, end, hours, inputUnchanged: true })
  })
})
