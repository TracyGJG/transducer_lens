# Project: transducer_len

This project was insipired by the YouTube video [Transducers Explained | JavaScript by NWCalvank](https://youtu.be/SJjOp0X_MVA?si=GrsoymtAIMtBgsg8) that references ["Transducers" by Rich Hickey](https://youtu.be/6mTbuzafcII?si=HvsGJLSZNwlFDGOF).

I have been familiar with the functional programming concept of lenses for years and made good use of them. Transducers are a more complicated concept but I was interested to see if they could be used to address a problem I had.

The project is broken down over three folders:

- Investigation: Initial exploration into transducers applied to an array of numbers (simple) and another of objects, that uses an enhanced form of lens (lensFn).

- Libraries: Three collections of functions along with complete unit tests.

  - lenses

    - lens: This function is used to produce a new function to locate a property in an object, supplied in a subsequent call, and return the properties value or _undefined_ if not found.
    - lensFn: This is an enhancement of the basic lens function that takes as its first parameter a callback function. If the lens finds a value for the property in an object, the value and object are passed to the callback function.

  - transducers

    - mapper: A 'wrapper' function that takes one or more transformation functions and returns a single transducer.
    - filter: Another wrapper that takes aone or more predicate functions and returns a single transducer. Only objects that comply with all the predicates will remain in the output array.
    - extract: A specialised form of filter function that takes an array into which objects from the source array are copied, and an optional flag (Boolean) indicating if objects are to be removed or retained in the source array. The initial function returns another function that takes multiple predicate functions.
    - conditional: Another specialised form of the filter function that takes a conditional function in the initial call, with (ideally) two or more transformers in the subsequent call. The conditional function returns either a Boolean (predicate) or number (0+). The Boolean is converted into a number (false = 0, true = 1) that is used as an index into the collection (array) of transformers.
    - composeTransducers: is a function for composing transducers into a single function. The resultant function takes an array of objects, applies the functions wrapped in the transducers to each object to produce (return) a new array.

  - utils
    - append: A _curried_ function that can be called with two arguments either separately (in subsequent calls) or together in a single call. The first parameter is the array to be appended with the appended array returned. The additional parameters (one or more) are added to the end of the initial array.
    - compose: A utility to combine multiple functions into one.
    - logger: A debugging tool to output the progres through the array processing.
    - range: An array generator function, used to produce test data.

- samplers:
  - imperative:
  - declarative:
  - exampleData:
  - exampleSummary:

## Lenses

## Transducers

## The Problem
