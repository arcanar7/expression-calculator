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

  const calc = () => {
    let [b, a] = [stackNumbers.pop(), stackNumbers.pop()]
    stackNumbers.push(operations[stackOperators.pop()](a, b))
  }

  for (item of exprArray) {
    if (!isNaN(item)) {
      stackNumbers.push(+item)
    } else {
      if (priority[item]) {
        if (priority[item] <= priority[lastItemInStack(stackOperators)]) {
          calc()
        }
      }
      if (item === ")") {
        while (stackOperators[stackOperators.length - 1] !== "(") {
          calc()
        }
        stackOperators.pop()
        continue
      }
      stackOperators.push(item)
    }
  }

  while (stackNumbers.length > 1) {
    calc()
  }

  return stackNumbers.pop()
}

module.exports = {
  expressionCalculator
}

let stackNumbers = []
let stackOperators = []

const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => (lastItemInStack(stackOperators) === "-" ? a + b : a - b),
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

const expr = " 100 - 60 / 38 + (  19 / 88 * 97 / 82 / 94  ) * 92 "
console.log(expressionCalculator(expr))
