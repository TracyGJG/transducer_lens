# Project: transducer_len

This project was insipired by the YouTube video [Transducers Explained | JavaScript by NWCalvank](https://youtu.be/SJjOp0X_MVA?si=GrsoymtAIMtBgsg8) that references ["Transducers" by Rich Hickey](https://youtu.be/6mTbuzafcII?si=HvsGJLSZNwlFDGOF).

I have been familiar with the functional programming concept of lenses for years and made good use of them. Transducers are a more complicated concept but I was interested to see if they could be used to address a problem I had.

## Terminology

**Predicate** is a function that takes one or more arguments and returns a Boolean value (true or false).

**Transform** is a function that takes a single argument, can creates a transformed version as its return value.

---

## Folder structure

The project is broken down into three folders:

**Investigation**: Initial exploration into transducers applied to an array of numbers (simple) and another of objects, that uses an enhanced form of lens (lensFn).

**Libraries**: Three collections of functions along with complete unit tests.

- lenses

  - **lens**: This function is used to produce a new function to locate a property in an object, supplied in a subsequent call, and return the properties value or _undefined_ if not found.
  - **lensFn**: This is an enhancement of the basic lens function that takes as its first parameter a callback function. If the lens finds a value for the property in an object, the value and object are passed to the callback function.

- transducers

  - **mapper** is a _wrapper_ function that takes one or more transformation functions and returns a single transducer.
  - **filter** is another wrapper that takes aone or more predicate functions and returns a single transducer. Only objects that comply with all the predicates will remain in the output array.
  - **extract** is a specialised form of filter function that takes an array into which objects from the source array are copied, and an optional flag (Boolean) indicating if objects are to be removed or retained in the source array. The initial function returns another function that takes multiple predicate functions.
  - **conditional** is another specialised form of the filter function that takes a conditional function in the initial call, with (ideally) two or more transformers in the subsequent call. The conditional function returns either a Boolean (predicate) or number (0+). The Boolean is converted into a number (false = 0, true = 1) that is used as an index into the collection (array) of transformers.
  - **composeTransducers** is a function for composing transducers into a single function. The resultant function takes an array of objects, applies the functions wrapped in the transducers to each object to produce (return) a new array.
  - **flatten** is a wrapper of more than one transform function to which the input is passed to each. The output is an array of _defined_ values that is expanded and flattened into the output array. N.B. This function has to be the last in the sequence of transducers because it will change the structure of the output array.

- utils
  - **append** is a _curried_ function that can be called with two arguments either separately (in subsequent calls) or together in a single call. The first parameter is the array to be appended with the appended array returned. The additional parameters (one or more) are added to the end of the initial array.
  - **compose** is a utility to combine multiple functions into one.
  - **logger** is a debugging tool to output the progres through the array processing.
  - **range** is an array generator function, used to produce test data.

**samplers**

- imperative: An example solved using conventional Array methods but incuring multiple passes over the array.
- declarative: The same example problem as for _imperative_ but resolved using transducers.
- exampleData: A collection of several datesets, in JSON format, used to in the exampleSummary demonstration.
- exampleSummary: An example with logging to demonstrate consolidating data from several sources (arrays and an object) using the transducer approach.
- lensDemo: Demonstrates the _lens_ and _lensFn_ function as described below.

## Lenses

lenses are functions that excepts an object and return the value of a property of the object, according to a predefined specification, or _undefined_ if not found.

The _lens_ function provided in the _lenses_ library accept a property specification and returns a lens function. The specification can be a property name or a series of property names (strings). I can also accept numbers that will be assumed to be array subscripts. Strings is double-quotes are expected to be 'complex' property names that need to use the bracket notation rather than the dot notation.

For example, if we have an object as follows:

```
{
  alpha: 'beta',
  gamma: {
    'delta': 'epsilon',
    'zeta eta': 'theta',
  },
  iota: [
    'kappa',
    {
      lambda: 'mu',
    },
  ],
}
```

We can use the following specifications to retrieve values.

| Specification         | value     |
| --------------------- | --------- |
| 'alpha'               | 'beta'    |
| 'gamma', 'delta'      | 'epsilon' |
| 'gamma.delta'         | 'epsilon' |
| 'gamma["zeta eta"]'   | 'theta'   |
| 'gamma', '"zeta eta"' | 'theta'   |
| 'iota[0]'             | 'kappa'   |
| 'iota', 0             | 'kappa'   |
| 'iota', 1, 'lambda'   | 'mu'      |

The _lenses_ library provides an enhanced version of the _lens_ function called _lensFn_ that works in a similar way but takes a call-back function as the first argument. If the property value is _defined_ (i.e. not undefined) the function will be called with the property value and the original object. The return value of the function will be output from the generated _lensFn_ function.

## Transducers
