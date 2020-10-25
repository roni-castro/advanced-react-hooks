// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

function Counter({initialCount = 0, step = 1}) {
  const [state, setState] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state

  function countReducer(state, action) {
    if (typeof action === 'function') {
      return action(state)
    }
    return action
  }

  const increment = () =>
    setState(currentState => ({count: currentState.count + step}))
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
