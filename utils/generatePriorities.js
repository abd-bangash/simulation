function calculateLcg(seed, A = 55, B = 9, M = 1994) {
  return (A * seed + B) % M;
}

function generatePriorities(numCustomers, a, b, m = 1994) {
  const priorities = [];
  let seed = Math.pow(1, 7);

  for (let i = 0; i < numCustomers; i++) {
    seed = calculateLcg(seed);
    const xi = seed;
    const priority = a + (b - a) * (xi / m);
    priorities.push(Math.round(priority));
  }
  return priorities;
}

module.exports = { generatePriorities };
