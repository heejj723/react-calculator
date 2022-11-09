import "./styles.css";
import { useReducer } from "react"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import logo from "./logo192.png"

const OPERATIONS = {
  PLUS: '+',
  MINUS: '-',
  MULTI: '*',
  DIV: '/',
  SQUARED: '^',
}

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  VALUATE: 'valuate',
}

function reducer(state, { type, payload }) {

  switch (type) {
    case ACTIONS.ADD_DIGIT:

      // evalute 직후에 새로 값을 쓰도록 하기 위함
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: `${payload.digit === "."? "0." : payload.digit}`,
          overwrite: false
        }
      }

      // 0이 입력된 상태에서 또 0을 입력
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      // 초기상태에서 .일경우 앞에 0 추가
      if (payload.digit === "." && (state.currentOperand === null || state.currentOperand === undefined)) {
        return {
          ...state,
          currentOperand: "0."
        }
      }

      // 소숫점에는 .이 하나만 있을 수 있도록
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        // || "" 는, null 일 경우 빈문자열 처리한다는 뜻.
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:

      // 이전 계산값 없이 operation 누를 때
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      // 이전 계산값은 있는데 operation 만 바꾸고 싶을때
      if (state.currentOperand == null) {
        return {
          ...state,
          // previousOperand: state.previousOperand,
          operation: payload.operation,
          // currentOperand: null
        }
      }

      // currentOperand!=null, 즉 누른 숫자가 있을때 -> state 를 업데이트 한다!
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.VALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return {}
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      // 초기 상태에서 DEL 누르기
      if (state.currentOperand == null) {
        return state
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
      return {...state, currentOperand: 'something'}
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) {
    return ""
  }
  let computation = ""
  switch (operation) {
    case OPERATIONS.PLUS:
      computation = prev + current
      break
    case OPERATIONS.MINUS:
      computation = prev - current
      break
    case OPERATIONS.MULTI:
      computation = prev * current
      break
    case OPERATIONS.DIV:
      computation = prev / current
      break
    case OPERATIONS.SQUARED:
      computation = prev ** current
  }

  return computation.toString()
}

function App() {

  // state: 현재값, 직전값, 동작
  // payload: digit(숫자), operation(계산 -> +-*/%)
  const [ { currentOperand, previousOperand, operation }, dispatch] = useReducer(
      reducer, {}
  )

  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 }})

  return (
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">
            {formatOperand(currentOperand)}
          </div>
        </div>
        <button onClick={()=>dispatch( { type: ACTIONS.CLEAR })}
        > AC </button>
        <button onClick={() => dispatch( { type: ACTIONS.DELETE_DIGIT})}
        > DEL </button>
        <OperationButton operation="^" dispatch={dispatch}/>
        <OperationButton operation="/" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button
          className="span-two"
          onClick={()=>dispatch( { type: ACTIONS.VALUATE} )}
        >=</button>
      </div>
  )
}

export default App