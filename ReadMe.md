# Project: transducer_len

This project was insipired by the YouTube video [Transducers Explained | JavaScript by NWCalvank](https://youtu.be/SJjOp0X_MVA?si=GrsoymtAIMtBgsg8) that references ["Transducers" by Rich Hickey](https://youtu.be/6mTbuzafcII?si=HvsGJLSZNwlFDGOF).

> Composition is to Functional Programming (FP) what Inheritance is to Object Orientation. However, the Gang of Four, in their book "Design Patterns: Elements of Reusable Object-Oriented Software" [ISBN 0-201-63361-2](), recommend [Favor "object composition" over "class inheritance"](https://en.wikipedia.org/wiki/Composition_over_inheritance)'. FP takes composition to a whole new level.

I have been familiar with the functional programming concept of lenses for years and made good use of them. Transducers are a more complicated concept but I was interested to see if they could be used to address a problem I had. This repository it the result of my investigation.

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

### Investigation

Initial exploration into transducers applied to an array of numbers (simple) and another of objects, that uses an enhanced form of lens (lensFn).

### Libraries

Three collections of functions along with complete unit tests.

#### lenses

**lens**: This function is used to produce a new function to locate a property in an object, supplied in a subsequent call, and return the properties value or _undefined_ if not found.

**lensFn**: This is an enhancement of the basic lens function that takes as its first parameter a callback function. If the lens finds a value for the property in an object, the value and object are passed to the callback function.

#### transducers

**mapper** is a _wrapper_ function that takes one or more transformation functions and returns a single transducer.

**filter** is another wrapper that takes aone or more predicate functions and returns a single transducer. Only objects that comply with all the predicates will remain in the output array.

**extract** is a specialised form of filter function that takes an array into which objects from the source array are copied, and an optional flag (Boolean) indicating if objects are to be removed or retained in the source array. The initial function returns another function that takes multiple predicate functions.

**conditional** is another specialised form of the filter function that takes a conditional function in the initial call, with (ideally) two or more transformers in the subsequent call. The conditional function returns either a Boolean (predicate) or number (0+). The Boolean is converted into a number (false = 0, true = 1) that is used as an index into the collection (array) of transformers.

**composeTransducers** is a function for composing transducers into a single function. The resultant function takes an array of objects, applies the functions wrapped in the transducers to each object to produce (return) a new array.

**flatten** is a wrapper of more than one transform function to which the input is passed to each. The output is an array of _defined_ values that is expanded and flattened into the output array. N.B. This function has to be the last in the sequence of transducers because it will change the structure of the output array.

#### utils

**append** is a _curried_ function that can be called with two arguments either separately (in subsequent calls) or together in a single call. The first parameter is the array to be appended with the appended array returned. The additional parameters (one or more) are added to the end of the initial array.

**compose** is a utility to combine multiple functions into one.

**logger** is a debugging tool to output the progres through the array processing.

**not** is a wrapper used to invert the output of a _predicate_ function.

**pipe** is an alternative to **compose** in that is also combines functions but in the opposite (reading) order.

**range** is an array generator function, used to produce test data.

### samplers

#### Lenses

**lensDemo** demonstrates the _lens_ and _lensFn_ function as described below.

#### Transducers One

**exampleOne** is a collection of _prediate_ and _transform_ functions used to perform the process that is the subject of the example. The functions are used by both implementations (_imperative_ and _declarative_) without alteration.

**imperative:** An example solved using conventional Array methods but incuring multiple passes over the array.

**declarative:** The same example problem as for
_imperative_ but resolved using transducers.

**temperatures.json:** A raw data file for the imperative and declarative examples.

#### Transducers Two

**exampleData.json:** A collection of several datesets, in JSON format, used to in the exampleSummary demonstration.

**exampleSummary:** An example with logging to demonstrate consolidating data from several sources (arrays and an object) using the transducer approach.

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

A transducer is a varient of the _reducer_ function that when called returns another transducer. Their purpose being to allow different function types such as _predicates_ and _transforms_ to be combined into a single _reducer_ function.

In the _transducers_ library there are two helper functions that enable _predicate_ and _transform_ functions to be wrapped into _transducers_ (`filter` and `mapper` respectively). These can them be composed into a new function using the _composeTransducers_ function. The new function takes a single argument of an array and through a single pass of the array, applies each of the transducers, where possible. A _transform_ transducer will not be executed on an item if the preceeding _predicate_ transducer returned false.

The _transducers_ library also contains the following functions:

- `extract` works a bit like `filter` but uses the _predicates_ to identify those items to be copied to an _extracted array_, which is the first parameter in the first call. The second parameter is an optional Boolean flag to indicate if the item is to be retained in the source array (defaulted to false). The subsequent call excpects to be provided with one or more _predicate_ function that it will wrap into transducers.

- `conditional` works a bit like `mapper` but only one (at most) of the _transforms_, supplied in the second call, will be performed, depending on the zero-based index output from the conditional function, supplied as the only argument of the first call.

- `flatten` expands an item from the original array into multiple new items accordign to the supplied _transforms_. Because this will change the length of the array, it needs to be the last operation. This function is not demonstrated in the _samplers_ example.

The following examples can be found in the _samplers_ folder

---

## Examples

### One: Temperature conversion

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

#### The Process

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

#### imperative

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

#### declarative

This implementation wraps the same _predicates_ and _transforms_ as the _imperative_ sampler but in this version we will wrap the functions in `logger` functions before converting them into _transducers_.

As well as the `filter` and `mapper` _transducers_ we will also use the `extract` and `conditional` _transducers_. The specialised _transducers_ enables us to preserve a copy of the array items being filtered out of the original array to form a new array. They also enales us to be selective as to which _transform_ to be applied based on a _predicate_.

#### The take-away

In the _imperative_ solution we passed through 4 arrays, or 5 when we include the filter to capture the invalid temperature strings, and the items in the output array will have been through as many functions.
Because the _predictes_ and _transforms_ functions are converted to _transducers_ and combined using the _composeTransducers_ function, the solution only passes through the array once.

---

### Two: Print run

In the second example we are going to perform a business-orientated process. We will be bringing together several data sets to produce a summary of completed customer orders.

The _exampleData.json_ file contains the following data sets:

**customers** is a list of customers who have placed orders of products to be printed. The details include a customer Id, name and their prefered method of dispatch.

| (index) | customerId  | companyName      | dispatchPreference  |
| ------- | ----------- | ---------------- | ------------------- |
| 0       | 'cust_0001' | 'Customer One'   | '1st Class Postage' |
| 1       | 'cust_0002' | 'Customer Two'   | '2nd Class Postage' |
| 2       | 'cust_0003' | 'Customer Three' | 'Collection'        |

**printJobs**: Each print job held in the system details a job Id, customer Id and the value of the order (price in pence).

| (index) | jobId      | customerId  | jobValue |
| ------- | ---------- | ----------- | -------- |
| 0       | 'job_0001' | 'cust_0001' | 47500    |
| 1       | 'job_0002' | ''          | 50000    |
| 2       | 'job_0003' | 'cust_0002' | 45000    |
| 3       | 'job_0004' | 'cust_0002' | 45000    |
| 4       | 'job_0005' | 'cust_0003' | 40000    |
| 5       | 'job_0006' | ''          | 50000    |
| 6       | 'job_0007' | 'cust_0001' | 47500    |
| 7       | 'job_0008' | 'cust_0001' | 47500    |
| 8       | 'job_0009' | 'cust_0002' | 45000    |
| 9       | 'job_0010' | ''          | 50000    |
| 10      | 'job_0011' | 'cust_0001' | 47500    |
| 11      | 'job_0012' | 'cust_0001' | 47500    |
| 12      | 'job_0013' | 'cust_0004' | 50000    |

**completionReports**: When a print job is complete a report is produced detailing the actual costs incured. Each report contains the job reference (job Id), how many items were printed (quantity) and the cost of the paper and ink used, in pence.

| (index) | jobRef     | quantity | paperCost | inkCost |
| ------- | ---------- | -------- | --------- | ------- |
| 0       | 'job_0001' | 100      | 11111     | 22222   |
| 1       | 'job_0003' | 100      | 11111     | 22222   |
| 2       | 'job_0005' | 100      | 11111     | 22222   |
| 3       | 'job_0007' | 100      | 11111     | 22222   |
| 4       | 'job_0009' | 100      | 11111     | 22222   |
| 5       | 'job_0011' | 100      | 11111     | 22222   |

**postageCosts** is an object containing a list of per unit costs (in pence) for differenc classes of postage. This includes an entry for when the customer has arrange collection (at zero cost) rather than paying for postage.

| (index)           | Values |
| ----------------- | ------ |
| 1st Class Postage | 100    |
| 2nd Class Postage | 80     |
| Collection        | 0      |

#### The Process

The general process involves combining the information from all four data sets to distil a list of completed print jobs with all associated costs. The processed array can then be reduced to a summary report with one entry for each cutomer.

In addition, we want to be made aware of print jobs for which the customer is either not specificed or cannot be determined.

1. We us the `extract` function to pull out the print job that cannot be linked to a customer.

2. Print jobs that have yet to be completed (i.e. do not have a completion report). This uses the `filter` function in conjunction with the _completionReports_ data set.

3. The completed print jobs are enhanced with details from the _customers_ and _completionReport_ data sets using the `mapper` function.

4. We then calculate the postage cost according to the customer's preferred method of dispatch. This uses the `conditional` function with the _postageCosts_ data set.

5. Once the array has been processed with use a reducer function to consolidate the information into a summary.

#### The Output

The output of the full process is too lengthy to be documented here so I suggest you try running the example yourself.

**Print Run Summary**

| (index) | jobId      | customerId  | jobValue | companyName      | dispatchPreference  | paperCost | inkCost | products | postageCost |
| ------- | ---------- | ----------- | -------- | ---------------- | ------------------- | --------- | ------- | -------- | ----------- |
| 0       | 'job_0001' | 'cust_0001' | 47500    | 'Customer One'   | '1st Class Postage' | 11111     | 22222   | 100      | 10000       |
| 1       | 'job_0003' | 'cust_0002' | 45000    | 'Customer Two'   | '2nd Class Postage' | 11111     | 22222   | 100      | 8000        |
| 2       | 'job_0005' | 'cust_0003' | 40000    | 'Customer Three' | 'Collection'        | 11111     | 22222   | 100      | 0           |
| 3       | 'job_0007' | 'cust_0001' | 47500    | 'Customer One'   | '1st Class Postage' | 11111     | 22222   | 100      | 10000       |
| 4       | 'job_0009' | 'cust_0002' | 45000    | 'Customer Two'   | '2nd Class Postage' | 11111     | 22222   | 100      | 8000        |
| 5       | 'job_0011' | 'cust_0001' | 47500    | 'Customer One'   | '1st Class Postage' | 11111     | 22222   | 100      | 10000       |

**Completed print job customer summary**

| (index)        | customer         | value  | paper | ink   | postage | totalCosts |
| -------------- | ---------------- | ------ | ----- | ----- | ------- | ---------- |
| Customer One   | 'Customer One'   | 142500 | 33333 | 66666 | 30000   | 129999     |
| Customer Two   | 'Customer Two'   | 90000  | 22222 | 44444 | 16000   | 82666      |
| Customer Three | 'Customer Three' | 40000  | 11111 | 22222 | 0       | 33333      |

**Print Jobs without customers**
| (index) | jobId | customerId | jobValue |
| --- | --- | --- | --- |
| 0 | 'job_0002' | '' | 50000 |
| 1 | 'job_0006' | '' | 50000 |
| 2 | 'job_0010' | '' | 50000 |
| 3 | 'job_0013' | 'cust_0004' | 50000 |

#### The take-away

1. Each printJob is only processes once.
2. Only those operations necessary are applied to each printJob.

## Bonus - Recursive Sort

Another diffrentiator of the Functional Programming style from imperative styles is the use of recursion in place of loops. A perfect example of this is how we can resolve multiple sort criteria using JS's `Array.sort` (or the ne `Array.sorted`) method(s).
