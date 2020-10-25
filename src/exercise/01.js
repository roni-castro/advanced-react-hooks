// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

function Counter({initialCount = 0, step = 1}) {
  const [count, changeCount] = React.useReducer(countReducer, initialCount)

  function countReducer(state, action) {
    return state + action
  }

  const increment = () => changeCount(step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
