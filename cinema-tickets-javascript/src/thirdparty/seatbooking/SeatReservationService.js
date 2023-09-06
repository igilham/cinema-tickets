/* eslint-disable */

export default class SeatReservationService {
  /**
   * @param {!number} accountId
   * @param {!number} totalSeatsToAllocate
   */
  reserveSeat(accountId, totalSeatsToAllocate) {
    if (!Number.isInteger(accountId)) {
      throw new TypeError("accountId must be an integer");
    }

    if (!Number.isInteger(totalSeatsToAllocate)) {
      throw new TypeError("totalSeatsToAllocate must be an integer");
    }
  }
}
