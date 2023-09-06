import TicketTypeRequest from "./TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
  test("should allow creating valid requests", () => {
    expect(() => new TicketTypeRequest("ADULT", 1)).not.toThrow();
  });

  test("should not allow creating requests with invalid ticket type", () => {
    // @ts-ignore -- deliberate invalid input
    expect(() => new TicketTypeRequest("INVALID", 1)).toThrow(
      new TypeError("type must be ADULT, CHILD, or INFANT")
    );
  });

  test("should not allow creating requests with invalid ticket number", () => {
    // @ts-ignore -- deliberate invalid input
    expect(() => new TicketTypeRequest("ADULT", "five")).toThrow(
      new TypeError("noOfTickets must be an integer")
    );
  });
});
