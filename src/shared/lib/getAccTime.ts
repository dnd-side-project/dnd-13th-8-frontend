export const getAccTime = (trackLengths: number[], trackIndex: number, currentTime: number) => {
  return trackLengths.slice(0, trackIndex).reduce((acc, len) => acc + len, 0) + currentTime
}
