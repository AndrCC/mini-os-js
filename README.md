# Mini OS JS

Este projeto simula um **mini kernel cooperativo** em JavaScript usando
generators. A ideia é ter tarefas que "cedem" o controle para o kernel,
de forma parecida com um escalonador simples.

## Como rodar o exemplo

```bash
npm run demo
```

## Estrutura do projeto

- `src/scheduler.js`: implementação do kernel e das tarefas.
- `examples/demo.js`: exemplo de uso.

## Conceitos principais (explicação para iniciantes)

### 1) Task (tarefa)
Cada `Task` guarda:

- `name`: nome da tarefa (só para identificar).
- `logic`: o generator que produz os passos da tarefa.
- `priority`: prioridade (número maior roda primeiro).
- `sleep`: quantos ciclos ela deve esperar.
- `done`: se a tarefa terminou.

O método `step()` executa **um passo** da tarefa.  
Se a tarefa pediu `sleep`, ela não roda por alguns ciclos.

### 2) Kernel (escalonador)
O `Kernel` guarda uma lista de tarefas e chama `step()` em cada uma.
Ele ordena as tarefas por prioridade e roda um loop até todas terminarem.

### 3) sleep
O `sleep(cycles)` é um objeto especial.  
Quando uma tarefa "yielda" esse objeto, ela pausa por alguns ciclos.

## Melhorias sugeridas

- Adicionar testes automatizados.
- Criar uma versão com TypeScript.
- Incluir métricas de execução (tempo, ciclos).
