/**
 * EventBus - Central Event Dispatcher for Modular Decoupling
 * Allows systems (Economy, Transfers, Simulation, Infrastructure) to publish events
 * and UI/other systems to subscribe without direct dependencies.
 */
class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error executing event listener for ${event}:`, err);
      }
    });
  }
}

export const eventBus = new EventBus();
