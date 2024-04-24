# Project: transducer_len

This project was insipired by the YouTube video [Transducers Explained | JavaScript by NWCalvank](https://youtu.be/SJjOp0X_MVA?si=GrsoymtAIMtBgsg8) that references ["Transducers" by Rich Hickey](https://youtu.be/6mTbuzafcII?si=HvsGJLSZNwlFDGOF).

I have been familiar with the functional programming concept of lenses for years and made good use of them. Transducers are a more complicated concept but I was interested to see if they could be used to address a problem I had.

The project is broken down over three folders:

- Investigation: Initial exploration into transducers applied to an array of numbers (simple) and another of objects, that uses an enhanced form of lens (lensFn).

- Libraries: Three collections of functions along with complete unit tests.

  - lenses

    - lens:
    - lensFn:

  - transducers

    - composeTransducers: is a function for composing transducers.
    - conditional:
    - extract:
    - filter:
    - mapper:

  - utils
    - append:
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
