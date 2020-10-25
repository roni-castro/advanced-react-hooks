// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

function Counter({initialCount = 0, step = 1}) {
  const [state, changeCount] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state

  function countReducer(state, action) {
    return {count: action}
  }

  const increment = () => changeCount(count + step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
