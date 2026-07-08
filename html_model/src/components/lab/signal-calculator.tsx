'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SignalCalculator() {
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [operation, setOperation] = useState<string | null>(null)
  const [lastValue, setLastValue] = useState<number | null>(null)

  const clear = () => {
    setDisplay('0')
    setHistory('')
    setWaitingForOperand(false)
    setOperation(null)
    setLastValue(null)
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const backspace = () => {
    if (waitingForOperand) return
    if (display.length === 1) {
      setDisplay('0')
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (lastValue === null) {
      setLastValue(inputValue)
    } else if (operation) {
      const result = calculate(lastValue, inputValue, operation)
      setDisplay(String(result))
      setLastValue(result)
      setHistory(`${lastValue} ${operation} ${inputValue} =`)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return right !== 0 ? left / right : 0
      case '^':
        return Math.pow(left, right)
      default:
        return right
    }
  }

  const scientificFunc = (func: string) => {
    const value = parseFloat(display)
    let result: number

    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180)
        break
      case 'cos':
        result = Math.cos(value * Math.PI / 180)
        break
      case 'tan':
        result = Math.tan(value * Math.PI / 180)
        break
      case 'log':
        result = Math.log10(value)
        break
      case 'ln':
        result = Math.log(value)
        break
      case 'sqrt':
        result = Math.sqrt(value)
        break
      case 'exp':
        result = Math.exp(value)
        break
      case 'abs':
        result = Math.abs(value)
        break
      case 'pi':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      default:
        result = value
    }

    setDisplay(String(result))
    setHistory(`${func}(${value})`)
    setWaitingForOperand(true)
  }

  const equals = () => {
    if (operation && lastValue !== null) {
      const result = calculate(lastValue, parseFloat(display), operation)
      setHistory(`${lastValue} ${operation} ${parseFloat(display)} =`)
      setDisplay(String(result))
      setLastValue(result)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">信号与系统计算器</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-muted-foreground text-right text-sm h-6">{history}</div>
            <div className="text-2xl font-mono text-right">{display}</div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button variant="secondary" onClick={() => scientificFunc('pi')}>π</Button>
            <Button variant="secondary" onClick={() => scientificFunc('e')}>e</Button>
            <Button variant="secondary" onClick={clear}>AC</Button>
            <Button variant="secondary" onClick={backspace}>←</Button>

            <Button variant="secondary" onClick={() => scientificFunc('sin')}>sin</Button>
            <Button variant="secondary" onClick={() => scientificFunc('cos')}>cos</Button>
            <Button variant="secondary" onClick={() => scientificFunc('tan')}>tan</Button>
            <Button variant="secondary" onClick={() => performOperation('/')}>÷</Button>

            <Button variant="secondary" onClick={() => scientificFunc('log')}>log</Button>
            <Button variant="secondary" onClick={() => scientificFunc('ln')}>ln</Button>
            <Button variant="secondary" onClick={() => scientificFunc('sqrt')}>√</Button>
            <Button variant="secondary" onClick={() => performOperation('*')}>×</Button>

            <Button variant="secondary" onClick={() => scientificFunc('exp')}>exp</Button>
            <Button variant="secondary" onClick={() => scientificFunc('abs')}>|x|</Button>
            <Button variant="secondary" onClick={() => performOperation('^')}>x^y</Button>
            <Button variant="secondary" onClick={() => performOperation('-')}>-</Button>

            <Button onClick={() => inputDigit('7')}>7</Button>
            <Button onClick={() => inputDigit('8')}>8</Button>
            <Button onClick={() => inputDigit('9')}>9</Button>
            <Button variant="secondary" onClick={() => performOperation('+')}>+</Button>

            <Button onClick={() => inputDigit('4')}>4</Button>
            <Button onClick={() => inputDigit('5')}>5</Button>
            <Button onClick={() => inputDigit('6')}>6</Button>
            <Button variant="secondary" className="row-span-2" onClick={equals}>=</Button>

            <Button onClick={() => inputDigit('1')}>1</Button>
            <Button onClick={() => inputDigit('2')}>2</Button>
            <Button onClick={() => inputDigit('3')}>3</Button>

            <Button onClick={() => inputDigit('0')} className="col-span-2">0</Button>
            <Button onClick={inputDecimal}>.</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}