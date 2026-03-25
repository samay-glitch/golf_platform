/**
 * Draw Engine Logic
 * Range: 1-45
 * Ticket Format: "01-12-23-34-45" (Sorted for consistency)
 */

export const DRAW_RANGE_MIN = 1
export const DRAW_RANGE_MAX = 45
export const NUMBERS_PER_TICKET = 5

export interface DrawSimulationResult {
  winningNumbers: string[]
  match5Count: number
  match4Count: number
  match3Count: number
  prizes: {
    match5: number
    match4: number
    match3: number
  }
}

/**
 * Generates 5 unique random numbers between 1 and 45
 */
export function generateNumbers(): string[] {
  const numbers = new Set<number>()
  while (numbers.size < NUMBERS_PER_TICKET) {
    const num = Math.floor(Math.random() * (DRAW_RANGE_MAX - DRAW_RANGE_MIN + 1)) + DRAW_RANGE_MIN
    numbers.add(num)
  }
  return Array.from(numbers).sort((a, b) => a - b).map(n => n.toString().padStart(2, '0'))
}

/**
 * Counts how many numbers match between a ticket and the winning set
 */
export function countMatches(ticket: string, winningNumbers: string[]): number {
  const ticketNumbers = ticket.split('-')
  let matches = 0
  ticketNumbers.forEach(num => {
    if (winningNumbers.includes(num)) matches++
  })
  return matches
}

/**
 * Calculates prize distribution based on match counts and total pool
 */
export function calculatePrizes(
  totalPool: number,
  counts: { match5: number; match4: number; match3: number }
) {
  const match5Total = totalPool * 0.40
  const match4Total = totalPool * 0.35
  const match3Total = totalPool * 0.25

  return {
    match5Individual: counts.match5 > 0 ? match5Total / counts.match5 : match5Total, // Rollover if 0
    match4Individual: counts.match4 > 0 ? match4Total / counts.match4 : 0,
    match3Individual: counts.match3 > 0 ? match3Total / counts.match3 : 0,
    rolledOver: counts.match5 === 0 ? match5Total : 0
  }
}
