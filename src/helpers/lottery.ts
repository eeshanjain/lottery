export const getLineResult = (numA: number, numB: number, numC: number) => {
  if (numA + numB + numC === 2) {
    return 10
  } else if (numA === numB && numB === numC) {
    return 5
  } else if (numA !== numB && numA !== numC) {
    return 1
  }

  return 0
}

export const getNewLine = () => {
  const numberA = Math.floor(Math.random() * 3)
  const numberB = Math.floor(Math.random() * 3)
  const numberC = Math.floor(Math.random() * 3)
  const total = getLineResult(numberA, numberB, numberC)

  return { numberA, numberB, numberC, total }
}
