import TicketService from "./TicketService.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  test.each([-235123563, -1, 0, "hello"])(
    "should reject purchse with invalid account ID %s",
    (id) => {
      const ticketService = new TicketService();
      // @ts-ignore - testing invalid input types
      expect(() => ticketService.purchaseTickets(id)).toThrow(
        InvalidPurchaseException
      );
    }
  );
});
