import "./styles.css";
import { useReducer } from "react"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

const OPERATIONS = {
  PLUS: '+',
  MINUS: '-',
  MULTI: '*',
  DIV: '/',
  REMAIN: '%'
}

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  VALUATE: 'valuate'

}

function reducer(state, { type, payload }) {

  console.log(`state.currentOperand: ${state.currentOperand}`)
  console.log(`state.previousOperand: ${state.previousOperand}`)
  console.log(`state.operation: ${state.operation}`)

  console.log(`type: ${type}`)
  console.log(`payload.digit: ${payload.digit}`)
  console.log(`payload.operation: ${payload.operation}`)

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.currentOperand === "0") {
        if (payload.digit === "0") return state;
        else if (payload.digit !==".") return {currentOperand: payload.digit}
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:

      // 최초 상태에서 operation 누를 때
      if (state.currentOperand === null && state.previousOperand === null) {
        return state
      }

      if (state.previousOperand === null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }

      }
    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperand: "0"
      }
    default:
      return state
  }
}

function App() {

  // state: 현재값, 직전값, 동작
  // payload: digit(숫자), operation(계산)
  const [ { currentOperand, previousOperand, operation }, dispatch] = useReducer(
      reducer, {currentOperand: "0"}
  )

  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 }})

  return (
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {previousOperand} {operation}
          </div>
          <div className="current-operand">
            {currentOperand}
          </div>
        </div>
        <button className="span-two" onClick={()=>dispatch({type: ACTIONS.CLEAR})}> AC </button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation="%" dispatch={dispatch}/>
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
        <button className="span-two">=</button>
      </div>
  )
}

export default App