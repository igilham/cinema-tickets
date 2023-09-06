import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import {
  validateAccountId,
  validateMaximumTickets,
} from "./lib/validations.js";

/**
 * @typedef {Object} GroupedTickets
 * @property {!number} ADULT
 * @property {!number} CHILD
 * @property {!number} INFANT
 */

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  /**
   * Purchase tickets
   * @param {!number} accountId
   * @param  {...TicketTypeRequest} ticketTypeRequests
   * @throws {InvalidPurchaseException} if the purchase is invalid
   * @returns {void}
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    const groupedTickets = this.#groupTicketsByType(ticketTypeRequests);
    this.#validatePurchase(accountId, ticketTypeRequests, groupedTickets);
  }

  /**
   * @param  {TicketTypeRequest[]} ticketTypeRequests
   * @returns {GroupedTickets}
   */
  #groupTicketsByType(ticketTypeRequests) {
    return ticketTypeRequests.reduce(
      (acc, req) => {
        const type = req.getTicketType();
        acc[type] += req.getNoOfTickets();
        return acc;
      },
      {
        ADULT: 0,
        CHILD: 0,
        INFANT: 0,
      }
    );
  }

  /**
   * Validate ticket purchase. Validations are run in a fixed
   * order and only the first failure is reported.
   * @param {!number} accountId
   * @param  {TicketTypeRequest[]} ticketTypeRequests
   * @param {GroupedTickets} groupedTickets
   * @throws {InvalidPurchaseException} if the purchase is invalid
   * @returns {void}
   */
  #validatePurchase(accountId, ticketTypeRequests, groupedTickets) {
    validateAccountId(accountId, ticketTypeRequests);
    validateMaximumTickets(accountId, ticketTypeRequests);

    if (groupedTickets.CHILD > 0 && groupedTickets.ADULT === 0) {
      throw new InvalidPurchaseException(
        "Child tickets must be purchased with an adult ticket"
      );
    }

    if (groupedTickets.INFANT > 0 && groupedTickets.ADULT === 0) {
      throw new InvalidPurchaseException(
        "Infant tickets must be purchased with an adult ticket"
      );
    }
  }
}
