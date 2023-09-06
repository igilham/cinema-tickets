/**
 * Placeholder class for pricing different classes of tickets
 */
export default class TicketPricingService {
  /**
   * Calculate the total cost of the tickets in pence
   * @param {import('./types.js').GroupedTickets} groupedTickets
   * @returns {number}
   */
  calculateTotalCost(groupedTickets) {
    const adultCost = groupedTickets.ADULT * 20 * 100;
    const childCost = groupedTickets.CHILD * 10 * 100;
    const infantCost = groupedTickets.INFANT * 0 * 100;
    return adultCost + childCost + infantCost;
  }
}
