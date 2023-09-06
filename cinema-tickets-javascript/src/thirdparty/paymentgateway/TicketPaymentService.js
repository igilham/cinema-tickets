/* eslint-disable */

export default class TicketPaymentService {
  /**
   *
   * @param {!string} accountId
   * @param {!number} totalAmountToPay
   */
  makePayment(accountId, totalAmountToPay) {
    if (!Number.isInteger(accountId)) {
      throw new TypeError("accountId must be an integer");
    }

    if (!Number.isInteger(totalAmountToPay)) {
      throw new TypeError("totalAmountToPay must be an integer");
    }
  }
}
