const {
  generateInterarrivalTimes,
} = require("./services/generateInterArrivalTimes");
const { generatePriorities } = require("./services/generatePriorities");
const {
  generateExponentialServiceTimes,
  generateUniformServiceTimes,
  generateNormalServiceTimes,
} = require("./services/generateServiceTimes");

const {
  runPreamptiveSimulation,
} = require("./services/runPreamptiveSimulation");

function simulationMMExponnetial(
  customersCount,
  serversCount,
  lambda,
  mu,
  lowestPriority
) {
  const interarrivalTimes = generateInterarrivalTimes(lambda, customersCount);
  const arrivals = interarrivalTimes.reduce((acc, curr, idx) => {
    acc.push((idx === 0 ? 0 : acc[idx - 1]) + curr);
    return acc;
  }, []);
  const serviceTimes = generateExponentialServiceTimes(mu, customersCount);
  const priorities = generatePriorities(customersCount, 1, lowestPriority);

  runPreamptiveSimulation(arrivals, serviceTimes, priorities, serversCount);
}

function simulationMGNormal(
  customersCount,
  serversCount,
  lambda,
  mu,
  sd,
  lowestPriority
) {
  const interarrivalTimes = generateInterarrivalTimes(lambda, customersCount);
  const arrivals = interarrivalTimes.reduce((acc, curr, idx) => {
    acc.push((idx === 0 ? 0 : acc[idx - 1]) + curr);
    return acc;
  }, []);
  const serviceTimes = generateNormalServiceTimes(customersCount, mu, sd);
  const priorities = generatePriorities(customersCount, 1, lowestPriority);

  runPreamptiveSimulation(arrivals, serviceTimes, priorities, serversCount);
}

function simulationMGUniform(
  customersCount,
  serversCount,
  lambda,
  a,
  b,
  lowestPriority
) {
  const interarrivalTimes = generateInterarrivalTimes(lambda, customersCount);
  const arrivals = interarrivalTimes.reduce((acc, curr, idx) => {
    acc.push((idx === 0 ? 0 : acc[idx - 1]) + curr);
    return acc;
  }, []);
  const serviceTimes = generateUniformServiceTimes(customersCount, a, b);
  const priorities = generatePriorities(customersCount, 1, lowestPriority);

  runPreamptiveSimulation(arrivals, serviceTimes, priorities, serversCount);
}

module.exports = {
  simulationMMExponnetial,
  simulationMGNormal,
  simulationMGUniform,
};
