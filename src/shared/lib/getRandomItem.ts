export const getRandomItem = <T>(arr: readonly T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}
