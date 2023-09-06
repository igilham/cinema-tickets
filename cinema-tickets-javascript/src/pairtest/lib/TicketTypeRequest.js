/**
 * @typedef {'ADULT' | 'CHILD' | 'INFANT'} TicketType
 */

/**
 * Immutable Object.
 */
export default class TicketTypeRequest {
  /**  @const {!TicketType} */
  #type;

  /**@const {!number} */
  #noOfTickets;

  /**
   * @param {!TicketType} type the type of the tickets in the request
   * @param {!number} noOfTickets the number of tickets in the request
   */
  constructor(type, noOfTickets) {
    if (!this.#Type.includes(type)) {
      throw new TypeError(
        `type must be ${this.#Type
          .slice(0, -1)
          .join(", ")}, or ${this.#Type.slice(-1)}`
      );
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError("noOfTickets must be an integer");
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  /**
   * @returns {!number} the number of tickets in the request
   */
  getNoOfTickets() {
    return this.#noOfTickets;
  }

  /**
   * @returns {!TicketType} the type of the tickets in the request
   */
  getTicketType() {
    return this.#type;
  }

  #Type = ["ADULT", "CHILD", "INFANT"];
}
