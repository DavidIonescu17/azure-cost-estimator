# React Hooks — A Practical Guide

> Illustrated through the **Azure Cost Estimator** — a PoC app that estimates Azure VM costs using modern React hooks.

---

## Table of Contents

1. [What are hooks?](#1-what-are-hooks)
2. [useState — tracking async state](#2-usestate--tracking-async-state)
3. [useReducer — managing complex state](#3-usereducer--managing-complex-state)
4. [useEffect — reacting to changes](#4-useeffect--reacting-to-changes)
5. [useMemo — optimizing expensive calculations](#5-usememo--optimizing-expensive-calculations)
6. [useRef — accessing DOM elements](#6-useref--accessing-dom-elements)
7. [useCallback — stable function references](#7-usecallback--stable-function-references)
8. [Custom hooks — composing logic](#8-custom-hooks--composing-logic)
9. [How the hooks work together](#9-how-the-hooks-work-together)

---

## 1. What are hooks?

Before hooks (introduced in React 16.8), stateful logic could only live inside class components. This led to verbose, hard-to-reuse code. Hooks let you use state and other React features inside **function components**.

```jsx
// Before hooks — class component
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>;
  }
}

// After hooks — function component
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Hooks follow two rules:
- Only call hooks **at the top level** of a function component (never inside loops or conditions)
- Only call hooks **inside React function components** or other custom hooks

---

## 2. useState — tracking async state

`useState` is the most fundamental hook. It lets a component remember a value between renders and trigger a re-render when it changes.

```js
const [value, setValue] = useState(initialValue);
```

- `value` — the current state
- `setValue` — a function to update it (triggers a re-render)
- `initialValue` — what the state is set to on first render

### In this app

Inside `useAzurePricing`, three separate `useState` calls track the result of the pricing calculation and its async lifecycle:

```js
// src/hooks/useAzurePricing.js
const [priceData, setPriceData] = useState(null);  // the calculated result
const [loading, setLoading]     = useState(false);  // is a calculation in progress?
const [error, setError]         = useState(null);   // did something go wrong?
```

Each piece of state is kept separate because they change independently — `loading` flips on and off around every calculation, while `error` only changes when something fails.

---

## 3. useReducer — managing complex state

`useReducer` is an alternative to `useState` for state that has multiple fields which always change together. Instead of calling a setter directly, you dispatch an **action** that describes what changed, and a **reducer function** decides how to update the state.

```js
const [state, dispatch] = useReducer(reducerFn, initialState);
```

- `state` — the current state object
- `dispatch` — a function to send an action to the reducer
- `reducerFn(state, action)` — a pure function that returns the new state

### In this app

The configuration form has six fields. Managing them with six separate `useState` calls would be noisy and harder to maintain. Instead, all six live in one `useReducer`:

```js
// src/App.jsx
const initialConfig = {
  vmSize: 'Standard_D2s_v3',
  region: 'West Europe',
  os: 'Linux',
  hours: 730,
  storageGb: 0,
  bandwidthGb: 0
};

function configReducer(state, action) {
  return { ...state, [action.field]: action.value };
}

const [config, dispatch] = useReducer(configReducer, initialConfig);
```

When the user changes a form field, a single dispatch call updates exactly that field without touching the others:

```js
dispatch({ field: 'vmSize', value: 'Standard_B2s' });
```

This also makes loading saved config from `sessionStorage` clean — each saved field is dispatched one by one:

```js
// src/App.jsx
const parsed = JSON.parse(savedConfig);
Object.entries(parsed).forEach(([field, value]) => {
  dispatch({ field, value });
});
```

---

## 4. useEffect — reacting to changes

`useEffect` runs a side effect after a render. A side effect is anything that reaches outside React — fetching data, writing to storage, or touching the DOM.

```js
useEffect(() => {
  // side effect logic here

  return () => {
    // optional cleanup (runs before the next effect or on unmount)
  };
}, [dependency1, dependency2]);
```

The **dependency array** controls when the effect runs:
- `[]` — runs once on mount only
- `[a, b]` — runs whenever `a` or `b` changes
- no array — runs after every render (rarely what you want)

### In this app

`useEffect` is used in three places:

**1. Recalculate costs when any config value changes:**

```js
// src/hooks/useAzurePricing.js
useEffect(() => {
  const fetchPricingData = async () => {
    setLoading(true);
    setError(null);
    try {
      // pricing calculation logic
      setPriceData({ hourly, monthly, annual, breakdown });
    } catch (err) {
      setError(err.message || 'Failed to calculate pricing');
    } finally {
      setLoading(false);
    }
  };
  fetchPricingData();
}, [vmSize, region, os, hours, storageGb, bandwidthGb]);
```

Every time any config field changes, this effect fires and recalculates the estimate.

**2. Load saved config on first render:**

```js
// src/App.jsx
useEffect(() => {
  const savedConfig = sessionStorage.getItem('azureConfig');
  if (savedConfig) {
    const parsed = JSON.parse(savedConfig);
    Object.entries(parsed).forEach(([field, value]) => {
      dispatch({ field, value });
    });
  }
}, []); // empty array — runs once on mount only
```

**3. Persist config whenever it changes:**

```js
// src/App.jsx
useEffect(() => {
  sessionStorage.setItem('azureConfig', JSON.stringify(config));
}, [config]); // runs every time config changes
```

This keeps the form filled in if the user refreshes the page.

---

## 5. useMemo — optimizing expensive calculations

`useMemo` memoizes a computed value — it only recalculates when its dependencies change, not on every render.

```js
const result = useMemo(() => expensiveCalculation(a, b), [a, b]);
```

Without `useMemo`, the calculation runs on every render even if `a` and `b` haven't changed. With it, React returns the cached result instead.

### In this app

The final result object returned by `useAzurePricing` is memoized so it only rebuilds when `priceData`, `loading`, or `error` actually change:

```js
// src/hooks/useAzurePricing.js
const result = useMemo(() => {
  if (!priceData) {
    return { hourly: null, monthly: null, annual: null, breakdown: [], loading, error };
  }
  return {
    hourly: priceData.hourly,
    monthly: priceData.monthly,
    annual: priceData.annual,
    breakdown: priceData.breakdown,
    loading,
    error
  };
}, [priceData, loading, error]);

return result;
```

Without `useMemo`, this object would be a new reference on every render, causing `Results` to re-render even when the numbers haven't changed.

---

## 6. useRef — accessing DOM elements

`useRef` returns a mutable object whose `.current` property holds a value. Unlike `useState`, updating a ref does **not** trigger a re-render. Its main use case is holding a direct reference to a real DOM element.

```js
const ref = useRef(null);
// later:
ref.current.focus();
```

### In this app

When the page loads, the VM Size dropdown is automatically focused so the user can start interacting immediately without clicking first:

```js
// src/components/ConfigForm.jsx
const vmSizeRef = useRef(null);

useEffect(() => {
  vmSizeRef.current?.focus();
}, []); // empty array — runs once on mount

<select ref={vmSizeRef} id="vmSize" ...>
```

This is the right tool here because we want to *imperatively touch a DOM node* — not update state. Using `useState` for this would be the wrong approach since no re-render is needed.

---

## 7. useCallback — stable function references

`useCallback` returns a memoized version of a function. Without it, every render creates a new function object. When that function is passed as a prop to a child component, the child sees a "new" function every render and re-renders unnecessarily.

```js
const stableFunction = useCallback(() => {
  // function body
}, [dependencies]);
```

### In this app

`handleConfigChange` is passed down to `ConfigForm` as a prop. Wrapping it in `useCallback` ensures `ConfigForm` only re-renders when it actually needs to — not on every parent render:

```js
// src/App.jsx
const handleConfigChange = useCallback((field, value) => {
  dispatch({ field, value });
}, []); // no dependencies — dispatch is always stable
```

The empty dependency array is intentional: `dispatch` from `useReducer` is guaranteed by React to never change, so this function is created once and reused forever.

---

## 8. Custom hooks — composing logic

A custom hook is a function whose name starts with `use` that calls other hooks. It lets you extract and reuse stateful logic across components.

```js
function useMyHook(param) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(fetchSomething(param));
  }, [param]);

  return data;
}
```

Custom hooks are the most powerful pattern in the hooks model — they let you separate *what* a component renders from *how it gets its data*.

### In this app — `useAzurePricing`

All pricing logic lives in a single custom hook. `App.jsx` has no idea how costs are calculated — it just passes config in and gets numbers out:

```js
// src/hooks/useAzurePricing.js
const useAzurePricing = ({ vmSize, region, os, hours, storageGb, bandwidthGb }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    // fetch and calculate pricing...
  }, [vmSize, region, os, hours, storageGb, bandwidthGb]);

  const result = useMemo(() => ({ ...priceData, loading, error }), [priceData, loading, error]);

  return result;
};
```

Consumed in `Results.jsx` with a single call:

```js
const { hourly, monthly, annual, breakdown, loading, error } = useAzurePricing(config);
```

If you wanted to show costs in a second page or component, you'd just call `useAzurePricing` again — no copy-pasting logic.

---

## 9. How the hooks work together

Here is the full data flow through the app:

```
User changes a form field
        │
        ▼
useCallback (handleConfigChange) fires → dispatch({ field, value })
        │
        ▼
useReducer (configReducer) updates config in App.jsx
        │
        ├──▶ useEffect([config]) → saves config to sessionStorage
        │
        └──▶ config passed to useAzurePricing(config)
                │
                ├──▶ useEffect([...config fields]) → recalculates pricing → useState (priceData)
                │
                └──▶ useMemo([priceData, loading, error]) → builds result object
                                │
                                ▼
                        Results component re-renders with new values
```

On first load:

```
Page mounts
    │
    ├──▶ useEffect([]) in App → loads config from sessionStorage → dispatch each field
    │
    └──▶ useEffect([]) in ConfigForm → useRef focuses the VM Size dropdown
```

Each hook has a single responsibility:

| Hook | Where | Responsibility |
|---|---|---|
| `useState` | `useAzurePricing` | Track pricing result, loading, and error state |
| `useReducer` | `App.jsx` | Manage all six config fields as one unit |
| `useEffect([config fields])` | `useAzurePricing` | Recalculate costs when config changes |
| `useEffect([config])` | `App.jsx` | Persist config to sessionStorage |
| `useEffect([])` | `App.jsx` | Load config from sessionStorage on mount |
| `useEffect([])` | `ConfigForm.jsx` | Auto-focus the first input on mount |
| `useMemo` | `useAzurePricing` | Memoize result object to avoid unnecessary re-renders |
| `useRef` | `ConfigForm.jsx` | Hold a reference to the VM Size DOM element |
| `useCallback` | `App.jsx` | Keep `handleConfigChange` stable across renders |
| `useAzurePricing` | `hooks/` | Compose all pricing logic into one reusable unit |

---

## Further reading

- [React docs — Hooks overview](https://react.dev/reference/react)
- [React docs — Building your own hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Azure Retail Prices API](https://prices.azure.com/api/retail/prices)