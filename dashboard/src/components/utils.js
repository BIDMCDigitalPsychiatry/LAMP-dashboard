
// Produces an array of integers from 0 until the specified max number.
export const rangeTo = (max) => [...Array(max).keys()]

// Stubbed code for .flat() which is an ES7 function...
Object.defineProperty(Array.prototype, 'flat', {
	value: function(depth = 1) {
		return this.reduce(function (flat, toFlatten) {
			return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? toFlatten.flat(depth-1) : toFlatten);
		}, []);
	}
})

// Easier Date-string formatting using Date.formatUTC
Object.defineProperty(Date, 'formatUTC', {
	value: function(timestampUTC, formatObj) {
		formatObj.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
		return (new Date(timestampUTC).toLocaleString('en-US', formatObj))
	}
})
