function generateExponentialServiceTimes(mu, numCustomers) {
  const serviceTimes = [];
  for (let i = 0; i < numCustomers; i++) {
    const rand = Math.random();
    serviceTimes.push(Math.ceil(-mu * Math.log(rand)));
  }
  return serviceTimes;
}

function generateUniformServiceTimes(numCustomers, a, b) {
  const serviceTimes = [];
  for (let i = 0; i < numCustomers; i++) {
    const rand = Math.random(); // Rand# in [0, 1)
    const serviceTime = a + (b - a) * rand;
    serviceTimes.push(Math.ceil(serviceTime)); // Round up to ensure service times are integers
  }
  return serviceTimes;
}

function generateNormalServiceTimes(numCustomers, mu, sd) {
  const serviceTimes = [];
  for (let i = 0; i < numCustomers; i++) {
    const rand1 = Math.random(); // Rand#1 in [0, 1)
    const rand2 = Math.random(); // Rand#2 in [0, 1)
    const z = Math.sqrt(-2 * Math.log(rand1)) * Math.cos(2 * Math.PI * rand2); // Box-Muller transform
    const serviceTime = mu + sd * z;
    serviceTimes.push(Math.ceil(Math.abs(serviceTime))); // Ensure positive service times
  }
  return serviceTimes;
}

module.exports = {
  generateExponentialServiceTimes,
  generateUniformServiceTimes,
  generateNormalServiceTimes,
};
