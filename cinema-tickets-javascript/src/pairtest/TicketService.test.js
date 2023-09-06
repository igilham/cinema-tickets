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

  test("should accept an adult with a child", () => {
    expect(() =>
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1)
      )
    ).not.toThrow();
  });

  test("should accept an adult with an infant", () => {
    expect(() =>
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 1)
      )
    ).not.toThrow();
  });

  test("should accept an adult with a child and an infant", () => {
    expect(() =>
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1),
        new TicketTypeRequest("INFANT", 1)
      )
    ).not.toThrow();
  });

  test.each([-235123563, -1, 0, "hello"])(
    "should reject purchse with invalid account ID %s",
    (id) => {
      // @ts-ignore - testing invalid input types
      expect(() => ticketService.purchaseTickets(id)).toThrow(
        new InvalidPurchaseException("Invalid account ID")
      );
    }
  );

  test("should reject purchase of more than 20 tickets in a single request", () => {
    const requests = [new TicketTypeRequest("ADULT", 21)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException("Too many tickets")
    );
  });

  test("should reject purchase of more than 20 tickets across multiple requests", () => {
    const requests = [
      new TicketTypeRequest("ADULT", 10),
      new TicketTypeRequest("CHILD", 10),
      new TicketTypeRequest("INFANT", 1),
    ];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException("Too many tickets")
    );
  });
});
