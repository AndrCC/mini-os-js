const { Kernel, Task, sleep } = require("../src/scheduler");

// Exemplo de tarefa: conta até um número e faz uma pausa.
function* contagem(nome, ate) {
  for (let i = 1; i <= ate; i++) {
    yield `${nome} -> ${i}`;

    // Pausa depois do 2.
    if (i === 2) {
      yield sleep(2);
    }
  }
}

const kernel = new Kernel();
kernel.addTask(new Task("T1", contagem("T1", 3), 3));
kernel.addTask(new Task("T2", contagem("T2", 3), 2));
kernel.addTask(new Task("T3", contagem("T3", 3), 1));
kernel.run();
