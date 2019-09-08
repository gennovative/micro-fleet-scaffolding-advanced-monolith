import * as moment from 'moment'

/**
 * Wraps `source` in a Moment instance in UTC.
 * If `source` is not given, returns Moment instance of current time in UTC.
 */
export function momentify(source?: any): moment.Moment {
    return moment.utc(source)
}
