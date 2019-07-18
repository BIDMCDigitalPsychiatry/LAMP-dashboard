
/**
 * The Activity instance that represents an active measurement.
 */
export default class Activity {

	/**
	 * Internal slot-tracker for static objects.
	 */
	slots = {}

	/**
	 * Internal slice-tracker for temporal objects.
	 */
	slices = []

	/**
	 * Internal time-tracker for handling millisecond-precision timestamps.
	 */
	times = {
		start: null,
		emit: null,
		end: null
	}

	/**
	 * Creates the Activity record (represented as a Result) with the current timestamp.
	 */
	start() {
		if (this.times.start !== null || this.times.end !== null)
			return

		this.times.start = this.times.emit = (new Date() - new Date(0))
	}

	/**
	 * Set or get a static slot value.
	 * 
	 * @param slotName The slot name to manipulate.
	 * @param slotValue The value to set the slot; null to clear the slot; undefined to return the current value.
	 */
	slot(slotName, slotValue) {
		if (this.times.start === null || this.times.end !== null)
			return

		if (slotValue === undefined)
			return this.slots[slotName]
		else this.slots[slotName] = slotValue
	}

	/**
	 * Inserts a temporal event at the current timestamp.
	 * 
	 * @param item
	 * @param value
	 * @param type
	 * @param level
	 */
	emit(item, value, type, level) {
		if (this.times.start === null || this.times.end !== null)
			return

		this.slices.push({ item, value, type, level, duration: (new Date() - this.times.emit) })
		this.times.emit = (new Date() - new Date(0))
	}

	/**
	 * Closes and submits the Activity record (represented as a Result) with the current timestamp.
	 */
	stop() {
		if (this.times.start === null || this.times.end !== null)
			return

		this.times.end = (new Date() - new Date(0))
	}
}
