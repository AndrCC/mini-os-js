class Task {
  constructor(name, logic, priority = 1) {
    this.name = name;
    this.logic = logic; // generator
    this.done = false;
    this.sleep = 0;
    this.priority = priority;     // ciclos restantes de "sono"
  }

  step() {
    if (this.done) return;

    // Se ainda está dormindo, só decrementar e não roda nada
    if (this.sleep > 0) {
      this.sleep--;
      return;
    }

    const { value, done } = this.logic.next();
    this.done = done;

    if (done) return;

    // Se o generator pediu um sleep, configuramos e não imprimimos nada
    if (value && typeof value === 'object' && value.type === 'sleep') {
      this.sleep = value.ciclos;
      return;
    }

    // Caso normal: imprime o valor produzido pela tarefa
    console.log(`[${this.name}]`, value);
  }
}

class Kernel {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  run() {
    const loop = () => {
      let alive = false;

      this.tasks.sort((a, b) => b.priority - a.priority);

      for (const t of this.tasks) {
        if (!t.done) {
          t.step();
          alive = true;
        }
      }
      if (alive) setTimeout(loop, 0);
    };
    loop();
  }
}

function sleep(ciclos) {
  return { type: 'sleep', ciclos };
}

// Exemplo de uso:
function* contagem(nome, ate) {
  for (let i = 1; i <= ate; i++) {
    yield `${nome} -> ${i}`;

    // pausa depois do 2
    if (i === 2) {
      yield sleep(2);
    }
  }
}

const k = new Kernel();
k.addTask(new Task("T1", contagem("T1", 1), 3));
k.addTask(new Task("T2", contagem("T2", 1), 2));
k.addTask(new Task("T3", contagem("T3", 1), 1));
k.run();

