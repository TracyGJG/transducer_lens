# Project: transducer_len

This project was insipired by the YouTube video [Transducers Explained | JavaScript by NWCalvank](https://youtu.be/SJjOp0X_MVA?si=GrsoymtAIMtBgsg8) that references ["Transducers" by Rich Hickey](https://youtu.be/6mTbuzafcII?si=HvsGJLSZNwlFDGOF).

I have been familiar with the functional programming concept of lenses for years and made good use of them. Transducers are a more complicated concept but I was interested to see if they could be used to address a problem I had.

---

## Terminology

**Declarative** can be considered to be an alternative style of processing to _imperative_. In the _declarative_ style, the process is defined in terms of what needs to be achieved and the data is passed through the process.

**Imperative** is a style of processing that applies changes to data step by step. It is sometimes described as defining the process by how the changes are to be performed. It can be considered to be an alternative to the _declarative_ style of processing.

**Predicate** is a function that takes one or more arguments and returns a Boolean value (_true_ or _false_). They are very often used to define filter criteria.

**Reducer** is a function that combines two input values into one output value. It is often used with arrays where the first argument is a new array and the second argument is a value from the original array. In this case the output would be an extended new array.

**Transform** is a function that takes a single argument from which a new value is created and output. This is the form of function expected by the `Array.map` method.

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
  - **not** is a wrapper used to invert the output of a _predicate_ function.
  - **pipe** is an alternative to **compose** in that is also combines functions but in the opposite (reading) order.
  - **range** is an array generator function, used to produce test data.

**samplers**

- lensDemo: Demonstrates the _lens_ and _lensFn_ function as described below.

- exampleOne: is a collection of _prediate_ and transform* functions used to perform the process that is the subject of the example. The functions are used by both implementations (*imperative* and *declarative\*) without alteration.
- imperative: An example solved using conventional Array methods but incuring multiple passes over the array.
- declarative: The same example problem as for _imperative_ but resolved using transducers.
- temperatures.json: A raw data file for the imperative and declarative examples.

- exampleSummary: An example with logging to demonstrate consolidating data from several sources (arrays and an object) using the transducer approach.
- exampleData.json: A collection of several datesets, in JSON format, used to in the exampleSummary demonstration.

---

## Lenses

Lenses are functions that excepts an object and return the value of a property of the object, according to a predefined specification, or _undefined_ if not found.

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

The above example can be found in the _samplers_ folder.

---

## Transducers

A transducer is a varient of the _reducer_ function that when called returns another transducer. There purpose being to allow different function types such as _predicates_ and _transforms_ to be combined into a single _reducer_ function.

In the _transducers_ library there are two helper functions that enable _predicate_ and _transform_ functions to be wrapped into _transducers_ (`filter` and `mapper` respectively). These can them be composed into a new function using the _composeTransducers_ function. The new function takes a single argument of an array and through a single pass of the array, applies each of the transducers, where possible. A _transform_ transducer will not be executed on an item if the preceeding _predicate_ transducer returned false.

The _transducers_ library also contains the following functions:

- `extract` works a bit like `filter` but uses the _predicates_ to identify those items to be copied to an _extracted array_, which is the first parameter in the first call. The second parameter is an optional Boolean flag to indicate if the item is to be retained in the source array (defaulted to false). The subsequent call excpects to be provided with one or more _predicate_ function that it will wrap into transducers.

- `conditional` works a bit like `mapper` but only one (at most) of the _transforms_, supplied in the second call, will be performed, depending on the zero-based index output from the conditional function, supplied as the only argument of the first call.

The following examples can be found in the _samplers_ folder

---

### Example one: Temperature conversion

In this example we will be converting an array of values (_see below_) into an array of objects containing temperatures in both Celsius and Fahrenheit. It is not important to know how to convert the temperatures. The purpose of this example is to demonstrate the difference between using a conventional imperative style verses the more declarative style provided through transducers. In both cases the inputData is supplied via the temperatures.json file as shown below.

```
const inputData = [
  '0°C',
  '',
  'Invalid String',
  0,
  '-40°F',
  null,
  '273.15K',
  false,
  '100°C',
];
```

### The Process

1. Remove all invalid items, keeping all those that are [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

Result: `[ '0°C', 'Invalid String', '-40°F', '273.15K', '100°C' ]`.

2. Remove all items (strings) that do not match the expected pattern for a temperature in celsius or fahrenheit. Copy the invalid strings into a new array to report the exceptions.

Valid strings: `[ '0°C', '-40°F', '100°C' ]`

Invalid strings: `[ 'Invalid String', '273.15K' ]`

3. Convert each valid (temperature) string into an object with the following properties: numeric (as string) and unit properties. Convert by first splitting the string at the degree symbol and assigning each element to the appropriate property.

```
[
  { numeric: '0', unit: 'C'},
  { numeric: '-40', unit: 'F'},
  { numeric: '100', unit: 'C'},
]
```

4. For each temperature object, create a replacement object with a property for each scale (celsius and fahrenheit) and assigned a value, converted to a number (integer), in the appropriate scale.

```
[
  { celsius: 0, fahrenheit: 32},
  { celsius: -40, fahrenheit: -40},
  { celsius: 100, fahrenheit: 212},
]
```

**imperative**

In this example we will be using the `Array.map` and `Array.filter` methods to process the inputData. However, as we shall see, there are consequence from processing in this manner, that the _declarative_ approach overcomes.

For each of the steps of the process (1-4) we need to travers an array. As a result of each traversal a new array will be produced. In addition, step 1 has to be run twice, onece to extract the invalid data for error reporting and again to isolate the valid data for further processing.

| step | input                    | output                    |
| ---- | ------------------------ | ------------------------- |
| 1    | inputData                | validInputData            |
| 2a   | validInputData           | invalidTemperatures       |
| 2b   | validInputData           | validTemperatures         |
| 3    | validTemperatures        | temperatureSimpleObjects  |
| 4    | temperatureSimpleObjects | temperatureComplexObjects |

Note, the output array from a step becomes the input for the next step, with the exception of the last step and step 2a.

**declarative**

This implementation wraps the same _predicates_ and _transforms_ as the _imperative_ sampler but in this version we will wrap the functions in `logger` functions before converting them into _transducers_.

As well as the `filter` and `mapper` _transducers_ we will also use the `extract` and `conditional` _transducers_. The specialised _transducers_ enables us to preserve a copy of the array items being filtered out of the original array to form a new array. They also enales us to be selective as to which _transform_ to be applied based on a _predicate_.

**The take-away**

In the _imperative_ solution we passed through 4 arrays, or 5 when we include the filter to capture the invalid temperature strings, and the items in the output array will have been through as many functions.
Because the _predictes_ and _transforms_ functions are converted to _transducers_ and combined using the _composeTransducers_ function, the solution only passes through the array once.

---

### Example two: Object processing
