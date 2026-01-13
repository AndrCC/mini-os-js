class Task {
  constructor(name, logic, priority = 1, onOutput = console.log) {
    this.name = name;
    this.logic = logic; // generator
    this.done = false;
    this.sleep = 0;
    this.priority = priority; // prioridade maior roda primeiro
    this.onOutput = onOutput;
    this.cancelled = false;
  }

  cancel() {
    this.cancelled = true;
    this.done = true;
  }

  step() {
    if (this.done || this.cancelled) return;

    // Se ainda está dormindo, só decrementa e não roda nada
    if (this.sleep > 0) {
      this.sleep--;
      return;
    }

    let result;
    try {
      result = this.logic.next();
    } catch (error) {
      this.done = true;
      this.onOutput(`[${this.name}] Erro: ${error.message || error}`);
      return;
    }

    const { value, done } = result;
    this.done = done;

    if (done) return;

    // Se o generator pediu um sleep, configuramos e não imprimimos nada
    if (value && typeof value === "object" && value.type === "sleep") {
      this.sleep = value.cycles;
      return;
    }

    // Caso normal: imprime o valor produzido pela tarefa
    this.onOutput(`[${this.name}] ${value}`);
  }
}

class Kernel {
  constructor() {
    this.tasks = [];
    this.tick = 0;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  run() {
    const loop = () => {
      let alive = false;

      this.tasks.sort((a, b) => b.priority - a.priority);

      for (const task of this.tasks) {
        if (!task.done) {
          task.step();
          alive = true;
        }
      }

      this.tick++;
      if (alive) setTimeout(loop, 0);
    };
    loop();
  }
}

function sleep(cycles) {
  return { type: "sleep", cycles };
}

module.exports = { Kernel, Task, sleep };
