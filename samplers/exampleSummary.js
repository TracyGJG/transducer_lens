import testData from './exampleData.json' assert { type: 'json' };
import { append, compose, logger } from '../libraries/utils.js';
import { extract, filter, mapper } from '../libraries/transducer.js';

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
const hasCustomer = listLookup('customerId');
const isComplete = listLookup('jobRef', 'jobId');

// transformations
const addCustomerDetails = dataList => subject => {
  const obj = itemLookup(dataList, 'customerId', subject);
  return {
    ...subject,
    companyName: obj.companyName,
    deploymentPreference: obj.deploymentPreference,
  };
};

const addJobCosts = (dataList, reference) => subject => {
  const obj = itemLookup(dataList, 'jobRef', subject, 'jobId');
  return {
    ...subject,
    paperCost: obj.paperCost,
    inkCost: obj.inkCost,
    postageCost: obj.quantity * (reference[subject.deploymentPreference] || 0),
  };
};

// reducer
const summarise = (summary, validPrintJob) => {
  const jobSummary = {
    customer: validPrintJob.companyName,
    value: validPrintJob.jobValue,
    paper: validPrintJob.paperCost,
    ink: validPrintJob.inkCost,
    postage: validPrintJob.postageCost,
  };
  jobSummary.totalCosts =
    validPrintJob.paperCost + validPrintJob.inkCost + validPrintJob.postageCost;
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
  extract(exceptions)(logger('hasCustomer', hasCustomer(customers))),
  filter(logger('isComplete', isComplete(completionReports))),
  mapper(
    logger('addDeploymentPreference', addCustomerDetails(customers)),
    logger('addJobCosts', addJobCosts(completionReports, postageCosts))
  )
);

// ==========================================================

const printRunSummary = transducer(printJobs);

console.log('\n%s', 'printRunSummary');
console.table(printRunSummary.reduce(summarise, {}));

console.log('\n%s', 'Print Jobs without customers');
console.table(exceptions);
