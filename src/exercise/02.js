// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import React, {useCallback} from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useSafeDispatch(dispatch) {
  const isMountedRef = React.useRef(true)

  React.useLayoutEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return React.useCallback(
    (...args) => {
      isMountedRef.current ? dispatch(...args) : void 0
    },
    [dispatch],
  )
}

function useAsync(initialState) {
  const [state, unSafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const dispatch = useSafeDispatch(unSafeDispatch)

  const run = useCallback(
    promise => {
      if (!promise) {
        return
      }

      dispatch({type: 'pending'})
      promise.then(
        data => {
          dispatch({type: 'resolved', data})
        },
        error => {
          dispatch({type: 'rejected', error})
        },
      )
    },
    [dispatch],
  )

  return {state, run}
}

function PokemonInfo({pokemonName}) {
  const {state, run} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

  const {data: pokemon, status, error} = state

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
