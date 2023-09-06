import TicketService from "./TicketService.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketTypeRequest from "./lib/TicketTypeRequest.js";

describe("TicketService", () => {
  /** @type TicketService */
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  test("should accept a simple purchase", () => {
    expect(() =>
      ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1))
    ).not.toThrow();
  });

  test.each([-235123563, -1, 0, "hello"])(
    "should reject purchse with invalid account ID %s",
    (id) => {
      // @ts-ignore - testing invalid input types
      expect(() => ticketService.purchaseTickets(id)).toThrow(
        InvalidPurchaseException
      );
    }
  );
});
