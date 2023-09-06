import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  /**
   * Purchase tickets
   * @param {!number} accountId
   * @param  {...TicketTypeRequest} ticketTypeRequests
   * @throws {InvalidPurchaseException} if the purchase is invalid
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validatePurchase(accountId, ...ticketTypeRequests);
  }

  /**
   * Validate ticket purchase
   * @param {!number} accountId
   * @param  {...TicketTypeRequest} ticketTypeRequests
   * @throws {InvalidPurchaseException} if the purchase is invalid
   */
  #validatePurchase(accountId, ...ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID");
    }

    const sumTickets = ticketTypeRequests.reduce(
      (acc, req) => acc + req.getNoOfTickets(),
      0
    );

    if (sumTickets > 20) {
      throw new InvalidPurchaseException("Too many tickets");
    }

    const groupedTickets = ticketTypeRequests.reduce(
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
