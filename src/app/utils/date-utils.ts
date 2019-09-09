import * as moment from 'moment'


/**
 * Converts a UTC time string to W3C Date and Time Formats.
 * If the input is not parseable by "moment",
 * the function returns the original string.
 */
export function toUtcTimeString(source: string): string {
    if (!source) { return source }
    const wrapped: moment.Moment = moment.utc(source)
    return (wrapped.isValid() ? wrapped.format() : source)
}


/**
 * Wraps `source` in a Moment instance in UTC.
 * If `source` is not given, returns Moment instance of current time in UTC.
 */
export function momentify(source?: any): moment.Moment {
    return moment.utc(source)
}
