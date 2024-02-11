import fs from 'fs-extra'

const text = fs.readFileSync('api/test.txt', 'utf-8')

const regex = /\/film\/(\d+)\//g
let matches
const numbers = []

while ((matches = regex.exec(text)) !== null) {
  numbers.push(matches[1])
}

console.log(numbers, numbers.length)

fs.writeFileSync('api/numbers.txt', numbers.join(','))
