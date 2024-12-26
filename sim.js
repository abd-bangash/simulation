const {
  generateInterarrivalTimes,
} = require("./utils/generateInterArrivalTimes");
const { generatePriorities } = require("./utils/generatePriorities");
const {
  generateExponentialServiceTimes,
  generateUniformServiceTimes,
  generateNormalServiceTimes,
} = require("./utils/generateServiceTimes");

const { runPreamptiveSimulation } = require("./utils/runPreamptiveSimulation");
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
  const serviceTimes = generateNormalServiceTimes(customersCount, a, b);
  const priorities = generatePriorities(customersCount, 1, lowestPriority);

  runPreamptiveSimulation(arrivals, serviceTimes, priorities, serversCount);
}
simulationMMExponnetial(10, 2, 1.5, 6, 3);
simulationMGNormal(10, 2, 1.5, 6, 0.5, 3);
simulationMGUniform(10, 2, 1.5, 6, 0.5, 3);
