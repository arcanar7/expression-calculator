function eval() {
  // Do not use eval!!!
  return
}

function expressionCalculator(expr) {
  const openBrackets = expr.match(/[(]/g)
  const closeBrackets = expr.match(/[)]/g)
  let exprArray = expr.match(/[()\*\/+-]|\d+/g)

  if ((!openBrackets && closeBrackets) || (openBrackets && !closeBrackets))
    throw "ExpressionError: Brackets must be paired"
  if (openBrackets && closeBrackets) {
    if (openBrackets.length !== closeBrackets.length) {
      throw "ExpressionError: Brackets must be paired"
    }
  }

  let stackNumbers = []
  let stackOperators = []

  for (item of exprArray) {
    if (!isNaN(item)) {
      stackNumbers.push(+item)
    } else {
      if (priority[item]) {
        if (priority[item] <= priority[lastItemInStack(stackOperators)]) {
          let [b, a] = [stackNumbers.pop(), stackNumbers.pop()]
          stackNumbers.push(
            operations[lastItemInStack(stackOperators.pop())](a, b)
          )
        }
      }
      stackOperators.push(item)
    }
  }

  while (stackNumbers.length > 1) {
    let [b, a] = [stackNumbers.pop(), stackNumbers.pop()]
    stackNumbers.push(operations[lastItemInStack(stackOperators)](a, b))
  }

  return stackNumbers.pop()
}

module.exports = {
  expressionCalculator
}

const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b === 0) throw new TypeError("TypeError: Division by zero.")
    return a / b
  }
}

const priority = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "0": 0
}

function lastItemInStack(stack) {
  return stack ? stack[stack.length - 1] : 0
}

const expr = " 49 * 63 / 58 * 36"
console.log(expressionCalculator(expr))
