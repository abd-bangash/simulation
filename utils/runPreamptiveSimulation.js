function runPreamptiveSimulation(
  arrivals,
  serviceTimes,
  priorities,
  numServers
) {
  const servers = Array(numServers).fill(null); // Track which customer is being served on each server
  const serverServiceTimes = Array(numServers).fill(0); // Track total service time for each server
  const events = []; // Track events for debugging or analysis
  let time = 0; // Current simulation time

  let QueueCustomers = arrivals.map((arrivalTime, index) => ({
    id: index + 1,
    arrivalTime,
    serviceTime: serviceTimes[index],
    remainingServiceTime: serviceTimes[index],
    priority: priorities[index],
    waitTime: 0,
    totalWaitTime: 0, // Tracks cumulative wait time (including after preemption)
    startTime: undefined,
    endTime: undefined,
    isServiceComplete: false,
    serving: false, // Indicates if the customer is currently being served
    lastServedTime: null, // Tracks when the customer was last served (for preemption)
  }));

  while (true) {
    // Check if all services are complete
    if (QueueCustomers.every((customer) => customer.isServiceComplete)) {
      break;
    }

    // Check if any customers have arrived at the current time
    QueueCustomers.forEach((customer) => {
      if (customer.arrivalTime === time && !customer.isServiceComplete) {
        events.push({ time, type: "arrival", customerId: customer.id });
      }
    });

    // Free up servers for customers who completed service at the current time
    servers.forEach((server, index) => {
      if (server && server.remainingServiceTime === 0) {
        server.isServiceComplete = true;
        server.serving = false; // Mark the customer as no longer being served
        server.endTime = time; // Set the end time correctly
        events.push({ time, type: "serviceComplete", customerId: server.id });
        servers[index] = null; // Free the server
      }
    });

    // Get available customers who can be assigned to servers
    let availableCustomers = QueueCustomers.filter(
      (customer) =>
        !customer.isServiceComplete &&
        !customer.serving &&
        customer.arrivalTime <= time
    );
    availableCustomers.sort((a, b) => a.priority - b.priority); // Sort by priority (lower is higher priority)

    // Assign customers to free servers or handle preemption
    servers.forEach((server, index) => {
      if (!server) {
        // Assign a new customer to this free server
        const nextCustomer = availableCustomers.shift();
        if (nextCustomer) {
          nextCustomer.startTime = nextCustomer.startTime ?? time;
          nextCustomer.serving = true; // Mark the customer as being served
          servers[index] = nextCustomer;
          events.push({
            time,
            type: "serviceStart",
            customerId: nextCustomer.id,
            server: index,
          });
        }
      } else {
        // Preempt if a higher-priority customer is available
        const highestPriorityCustomer = availableCustomers[0];
        if (
          highestPriorityCustomer &&
          highestPriorityCustomer.priority < server.priority
        ) {
          availableCustomers.shift(); // Remove the highest-priority customer
          // Preempt the current customer
          server.serving = false; // Mark the preempted customer as not serving
          server.lastServedTime = time; // Update the last served time
          availableCustomers.unshift(server); // Put the preempted customer back in the queue
          availableCustomers.sort((a, b) => a.priority - b.priority); // Re-sort
          servers[index] = highestPriorityCustomer; // Assign the higher-priority customer
          highestPriorityCustomer.startTime =
            highestPriorityCustomer.startTime ?? time;
          highestPriorityCustomer.serving = true; // Mark as being served
          events.push({
            time,
            type: "preemption",
            customerId: highestPriorityCustomer.id,
            server: index,
          });
        }
      }
    });

    // Process service times for customers on servers
    servers.forEach((server, index) => {
      if (server) {
        server.remainingServiceTime -= 1; // Decrement remaining service time
        if (server.remainingServiceTime < 0) {
          server.remainingServiceTime = 0; // Ensure it doesn't go below 0
        }
        serverServiceTimes[index] += 1; // Increment service time for the server
      }
    });

    // Update total wait times for customers who are waiting
    QueueCustomers.forEach((customer) => {
      if (
        !customer.serving &&
        !customer.isServiceComplete &&
        customer.arrivalTime <= time
      ) {
        customer.totalWaitTime += 1;
      }
    });

    // Increment time
    time += 1;
  }

  // Calculate utilization for each server
  const totalSimulationTime = time;
  const serverUtilizations = serverServiceTimes.map(
    (serviceTime) => (serviceTime / totalSimulationTime) * 100
  );
  const totalUtilization = serverUtilizations.reduce(
    (sum, util) => sum + util,
    0
  );

  // Log results
  console.log("Simulation complete!");

  console.table(
    QueueCustomers.map((customer) => ({
      ID: customer.id,
      "Arrival Time": customer.arrivalTime,
      "Start Time": customer.startTime,
      "End Time": customer.endTime,
      "Service Time": customer.serviceTime,
      "Wait Time": customer.totalWaitTime, // Use totalWaitTime for correct results
      Priority: customer.priority,
      "Service Complete": customer.isServiceComplete,
    }))
  );

  console.table(
    events.map((event) => ({
      Time: event.time,
      Type: event.type,
      "Customer ID": event.customerId,
      Server: event.server !== undefined ? event.server : "-",
    }))
  );

  // Log server utilization
  console.log("Server Utilizations:");
  serverUtilizations.forEach((utilization, index) => {
    console.log(`Server ${index}: ${utilization.toFixed(2)}%`);
  });
  console.log(`Total Utilization: ${totalUtilization.toFixed(2)}%`);
}

module.exports = { runPreamptiveSimulation };
