import InvalidPurchaseException from "./InvalidPurchaseException.js";
import TicketTypeRequest from "./TicketTypeRequest.js";

/**
 * @param {!number} accountId
 * @param  {TicketTypeRequest[]} _ticketTypeRequests
 */
export function validateAccountId(accountId, _ticketTypeRequests) {
  if (!Number.isInteger(accountId) || accountId <= 0) {
    throw new InvalidPurchaseException("Invalid account ID");
  }
}

/**
 * @param {!number} _accountId
 * @param  {TicketTypeRequest[]} ticketTypeRequests
 */
export function validateMaximumTickets(_accountId, ticketTypeRequests) {
  const sumTickets = ticketTypeRequests.reduce(
    (acc, req) => acc + req.getNoOfTickets(),
    0
  );

  if (sumTickets > 20) {
    throw new InvalidPurchaseException("Too many tickets");
  }
}
