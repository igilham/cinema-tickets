import InvalidPurchaseException from "./InvalidPurchaseException.js";
import TicketTypeRequest from "./TicketTypeRequest.js";

/**
 * @param {!number} accountId
 * @param  {TicketTypeRequest[]} _ticketTypeRequests
 * @param {import('../TicketService.js').GroupedTickets} _groupedTickets
 */
export function validateAccountId(
  accountId,
  _ticketTypeRequests,
  _groupedTickets
) {
  if (!Number.isInteger(accountId) || accountId <= 0) {
    throw new InvalidPurchaseException("Invalid account ID");
  }
}

/**
 * @param {!number} _accountId
 * @param  {TicketTypeRequest[]} ticketTypeRequests
 * @param {import('../TicketService.js').GroupedTickets} _groupedTickets
 */
export function validateMaximumTickets(
  _accountId,
  ticketTypeRequests,
  _groupedTickets
) {
  const sumTickets = ticketTypeRequests.reduce(
    (acc, req) => acc + req.getNoOfTickets(),
    0
  );

  if (sumTickets > 20) {
    throw new InvalidPurchaseException("Too many tickets");
  }
}

/**
 * @param {!number} _accountId
 * @param  {TicketTypeRequest[]} _ticketTypeRequests
 * @param {import('../TicketService.js').GroupedTickets} groupedTickets
 */
export function validateChildrenWithAdult(
  _accountId,
  _ticketTypeRequests,
  groupedTickets
) {
  if (groupedTickets.CHILD > 0 && groupedTickets.ADULT === 0) {
    throw new InvalidPurchaseException(
      "Child tickets must be purchased with an adult ticket"
    );
  }
}

/**
 * @param {!number} _accountId
 * @param  {TicketTypeRequest[]} _ticketTypeRequests
 * @param {import('../TicketService.js').GroupedTickets} groupedTickets
 */
export function validateInfantsWithAdult(
  _accountId,
  _ticketTypeRequests,
  groupedTickets
) {
  if (groupedTickets.INFANT > 0 && groupedTickets.ADULT === 0) {
    throw new InvalidPurchaseException(
      "Infant tickets must be purchased with an adult ticket"
    );
  }
}
