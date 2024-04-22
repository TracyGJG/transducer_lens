import testData from './exampleData.json' assert { type: 'json' };
import { append, compose, logger } from '../libraries/utils.js';
import {
  conditional,
  extract,
  filter,
  mapper,
} from '../libraries/transducer.js';

export function composeTransducers(...transducerFns) {
  const xf = compose(...transducerFns);
  return xs =>
    xs.reduce((__, _, ___) => {
      console.log(`transduce[${___}]:`, _);
      return xf(append)(__, _);
    }, []);
}

const { customers, printJobs, completionReports, postageCosts } = testData;
const show_test_data = false;

console.log('\nTest Data');
if (show_test_data) {
  console.table(customers);
  console.table(printJobs);
  console.table(completionReports);
  console.table(postageCosts);
}

// ==========================================================

const listLookup = (primaryProp, secondaryProp) => data => {
  const datumList = data.map(obj => obj[primaryProp]);
  return subject => datumList.includes(subject[secondaryProp ?? primaryProp]);
};

const itemLookup = (dataList, primaryProp, subject, secondaryProp) =>
  dataList.find(
    datum => datum[primaryProp] === subject[secondaryProp ?? primaryProp]
  );

// predicates
const hasMissingCustomer = prop => data =>
  !listLookup('customerId')(prop)(data);
const isComplete = listLookup('jobRef', 'jobId');
const mapDispatchPreference = _postageCosts => job =>
  Object.keys(_postageCosts).findIndex(
    postageOption => postageOption === job.dispatchPreference
  );

// transformations
const addCustomerDetails = dataList => subject => {
  const obj = itemLookup(dataList, 'customerId', subject);
  return {
    ...subject,
    companyName: obj.companyName,
    dispatchPreference: obj.dispatchPreference,
  };
};

const addJobCosts = dataList => subject => {
  const obj = itemLookup(dataList, 'jobRef', subject, 'jobId');
  return {
    ...subject,
    paperCost: obj.paperCost,
    inkCost: obj.inkCost,
    products: obj.quantity,
  };
};

const applyPostageCost = (reference, preference) => {
  const unitPrice = reference[preference];
  return job => ({
    ...job,
    postageCost: job.products * unitPrice,
  });
};

// reducer
const summarise = (summary, validPrintJob) => {
  const { companyName, jobValue, paperCost, inkCost, postageCost } =
    validPrintJob;
  const jobSummary = {
    customer: companyName,
    value: jobValue,
    paper: paperCost,
    ink: inkCost,
    postage: postageCost,
    totalCosts: paperCost + inkCost + postageCost,
  };

  const customerSummary = summary[validPrintJob.companyName];
  if (customerSummary) {
    customerSummary.value += jobSummary.value;
    customerSummary.paper += jobSummary.paper;
    customerSummary.ink += jobSummary.ink;
    customerSummary.postage += jobSummary.postage;
    customerSummary.totalCosts += jobSummary.totalCosts;
  } else {
    summary[validPrintJob.companyName] = jobSummary;
  }
  return summary;
};

// ==========================================================

const exceptions = [];

const transducer = composeTransducers(
  extract(exceptions)(
    logger('hasMissingCustomer', hasMissingCustomer(customers))
  ),
  filter(logger('isComplete', isComplete(completionReports))),
  mapper(
    logger('addCustomerDetails', addCustomerDetails(customers)),
    logger('addJobCosts', addJobCosts(completionReports))
  ),
  conditional(logger('mapDispatch', mapDispatchPreference(postageCosts)))(
    logger(
      'applyPostageCost: 1st Class',
      applyPostageCost(postageCosts, '1st Class Postage')
    ),
    logger(
      'applyPostageCost: 2nd Class',
      applyPostageCost(postageCosts, '2nd Class Postage')
    ),
    logger(
      'applyPostageCost: Collection',
      applyPostageCost(postageCosts, 'Collection')
    )
  )
);

// ==========================================================

const printRunSummary = transducer(printJobs);

console.log('\n%s', 'printRunSummary');
console.table(printRunSummary.reduce(summarise, {}));

console.log('\n%s', 'Print Jobs without customers');
console.table(exceptions);
