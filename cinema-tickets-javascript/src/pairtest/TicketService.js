import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import {
  validateAccountId,
  validateMaximumTickets,
  validateChildrenWithAdult,
  validateInfantsWithAdult,
} from "./lib/validations.js";

export default class TicketService {
  /** @const {import('../thirdparty/paymentgateway/TicketPaymentService.js').default} */
  #paymentService;

  /** @const {import('../thirdparty/seatbooking/SeatReservationService.js').default} */
  #seatReservationService;

  /** @const {import('./lib/TicketPricingService.js').default} */
  #ticketPricingService;

  /**
   * @param {import('../thirdparty/paymentgateway/TicketPaymentService.js').default} paymentService
   * @param {import('../thirdparty/seatbooking/SeatReservationService.js').default} seatReservationService
   * @param {import('./lib/TicketPricingService.js').default} ticketPricingService
   */
  constructor(paymentService, seatReservationService, ticketPricingService) {
    this.#paymentService = paymentService;
    this.#seatReservationService = seatReservationService;
    this.#ticketPricingService = ticketPricingService;
  }

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

    const totalCost =
      this.#ticketPricingService.calculateTotalCost(groupedTickets);
    this.#paymentService.makePayment(accountId, totalCost);

    const seats = this.#calculateTotalSeats(groupedTickets);
    this.#seatReservationService.reserveSeat(accountId, seats);
  }

  /**
   * @param  {TicketTypeRequest[]} ticketTypeRequests
   * @returns {import('./lib/types.js').GroupedTickets}
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
   * Calculate the total number of seats required. Infants
   * do not require a seat.
   * @param {import('./lib/types.js').GroupedTickets} groupedTickets
   * @returns {number}
   */
  #calculateTotalSeats(groupedTickets) {
    return groupedTickets.ADULT + groupedTickets.CHILD;
  }

  /**
   * Validate ticket purchase. Validations are run in a fixed
   * order and only the first failure is reported.
   * @param {!number} accountId
   * @param  {TicketTypeRequest[]} ticketTypeRequests
   * @param {import('./lib/types.js').GroupedTickets} groupedTickets
   * @throws {InvalidPurchaseException} if the purchase is invalid
   * @returns {void}
   */
  #validatePurchase(accountId, ticketTypeRequests, groupedTickets) {
    validateAccountId(accountId, ticketTypeRequests, groupedTickets);
    validateMaximumTickets(accountId, ticketTypeRequests, groupedTickets);
    validateChildrenWithAdult(accountId, ticketTypeRequests, groupedTickets);
    validateInfantsWithAdult(accountId, ticketTypeRequests, groupedTickets);
  }
}
