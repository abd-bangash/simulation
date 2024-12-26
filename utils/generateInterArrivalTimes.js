function factorial(n) {
  return n === 0 ? 1 : n * factorial(n - 1);
}
function calculateCP(lambda, x) {
  return (Math.pow(lambda, x) * Math.exp(-lambda)) / factorial(x);
}
function generateInterarrivalTimes(lambda, numCustomers) {
  const interarrivalTimes = [0];
  for (let i = 0; i < numCustomers - 1; i++) {
    const rand = Math.random();
    let cumulativeProbability = 0;
    let x = 0;
    while (true) {
      cumulativeProbability += calculateCP(lambda, x);
      if (rand <= cumulativeProbability) {
        interarrivalTimes.push(x);
        break;
      }
      x++;
    }
  }
  return interarrivalTimes;
}

module.exports = { generateInterarrivalTimes };
