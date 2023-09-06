import { jest } from "@jest/globals";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketService from "./TicketService.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketTypeRequest from "./lib/TicketTypeRequest.js";

describe("TicketService", () => {
  /** @type {TicketService} */
  let ticketService;

  /** @type {jest.Spied<typeof TicketPaymentService.prototype.makePayment>} */
  let makePaymentSpy;

  /** @type {jest.Spied<typeof SeatReservationService.prototype.reserveSeat>} */
  let reserveSeatSpy;

  beforeEach(() => {
    // use the stub classes provided
    const paymentService = new TicketPaymentService();
    const seatReservationService = new SeatReservationService();
    ticketService = new TicketService(paymentService, seatReservationService);

    makePaymentSpy = jest.spyOn(paymentService, "makePayment");
    reserveSeatSpy = jest.spyOn(seatReservationService, "reserveSeat");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should accept a simple purchase", () => {
    expect(() =>
      ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1))
    ).not.toThrow();
    expect(makePaymentSpy).toHaveBeenCalledTimes(1);
    expect(makePaymentSpy).toHaveBeenCalledWith(1, 20 * 100);
    expect(reserveSeatSpy).toHaveBeenCalledTimes(1);
    expect(reserveSeatSpy).toHaveBeenCalledWith(1, 1);
  });

  test("should accept an adult with a child", () => {
    expect(() =>
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1)
      )
    ).not.toThrow();
    expect(makePaymentSpy).toHaveBeenCalledTimes(1);
    expect(makePaymentSpy).toHaveBeenCalledWith(1, 30 * 100);
    expect(reserveSeatSpy).toHaveBeenCalledTimes(1);
    expect(reserveSeatSpy).toHaveBeenCalledWith(1, 2);
  });

  test("should accept an adult with an infant", () => {
    expect(() =>
      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 1)
      )
    ).not.toThrow();
    expect(makePaymentSpy).toHaveBeenCalledTimes(1);
    expect(makePaymentSpy).toHaveBeenCalledWith(1, 20 * 100);
    expect(reserveSeatSpy).toHaveBeenCalledTimes(1);
    expect(reserveSeatSpy).toHaveBeenCalledWith(1, 1);
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
    expect(makePaymentSpy).toHaveBeenCalledTimes(1);
    expect(makePaymentSpy).toHaveBeenCalledWith(1, 30 * 100);
    expect(reserveSeatSpy).toHaveBeenCalledTimes(1);
    expect(reserveSeatSpy).toHaveBeenCalledWith(1, 2);
  });

  test.each([-235123563, -1, 0, "hello"])(
    "should reject purchse with invalid account ID %s",
    (id) => {
      // @ts-ignore - testing invalid input types
      expect(() => ticketService.purchaseTickets(id)).toThrow(
        new InvalidPurchaseException("Invalid account ID")
      );
      expect(makePaymentSpy).not.toHaveBeenCalled();
      expect(reserveSeatSpy).not.toHaveBeenCalled();
    }
  );

  test("should reject purchase of more than 20 tickets in a single request", () => {
    const requests = [new TicketTypeRequest("ADULT", 21)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException("Too many tickets")
    );
    expect(makePaymentSpy).not.toHaveBeenCalled();
    expect(reserveSeatSpy).not.toHaveBeenCalled();
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
    expect(makePaymentSpy).not.toHaveBeenCalled();
    expect(reserveSeatSpy).not.toHaveBeenCalled();
  });

  test("should reject purchase of child tickets without an adult", () => {
    const requests = [new TicketTypeRequest("CHILD", 1)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException(
        "Child tickets must be purchased with an adult ticket"
      )
    );
    expect(makePaymentSpy).not.toHaveBeenCalled();
    expect(reserveSeatSpy).not.toHaveBeenCalled();
  });

  test("should reject purchase of infant tickets without an adult", () => {
    const requests = [new TicketTypeRequest("INFANT", 1)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException(
        "Infant tickets must be purchased with an adult ticket"
      )
    );
    expect(makePaymentSpy).not.toHaveBeenCalled();
    expect(reserveSeatSpy).not.toHaveBeenCalled();
  });
});
