import { spawn } from "child_process";

let ganacheProcess; // Переменная для хранения процесса Ganache CLI

// Функция для завершения предыдущего процесса Ganache CLI, если он активен
const stopGanacheProcess = () => {
  if (ganacheProcess && !ganacheProcess.killed) {
    console.log("Stopping previous Ganache CLI process...");
    ganacheProcess.kill(); // Завершаем предыдущий процесс Ganache CLI
  }
};

// Запускаем новый процесс Ganache CLI
const startGanacheProcess = () => {
  // Запускаем Ganache CLI в режиме детерминированного деплоя и логирования в файл
  ganacheProcess = spawn("ganache-cli", ["-d", "--verbose"]);

  ganacheProcess.stdout.on("data", (data) => {
    console.log(`Ganache Output: ${data}`);

    // Ищем строку, указывающую на создание контракта
    const output = data.toString();
    const contractCreationPattern =
      /Contract created: (.*) at transaction hash/;
    const match = contractCreationPattern.exec(output);

    if (match) {
      const contractAddress = match[1];
      console.log(`Deployed Contract Address: ${contractAddress}`);

      // Здесь можно выполнить дополнительные действия с адресом контракта
      // Например, сохранить адрес в файле или переменной окружения
    }
  });

  ganacheProcess.stderr.on("data", (data) => {
    console.error(`Ganache Error: ${data}`);
  });

  ganacheProcess.on("close", (code) => {
    console.log(`Ganache CLI process exited with code ${code}`);
  });
};

// Завершаем предыдущий процесс Ganache CLI перед запуском нового
stopGanacheProcess();

// Задержка перед запуском нового процесса Ganache CLI
setTimeout(() => {
  startGanacheProcess();
}, 5000); // Подберите задержку исходя из вашей среды и условий работы

// Задержка для уверенности в запуске Ganache перед деплоем контрактов
setTimeout(() => {
  const migrate = spawn("truffle", ["migrate", "--reset"]);

  migrate.stdout.on("data", (data) => {
    console.log(`Truffle Output: ${data}`);
  });

  migrate.stderr.on("data", (data) => {
    console.error(`Truffle Error: ${data}`);
  });

  migrate.on("close", (code) => {
    console.log(`Truffle migrate process exited with code ${code}`);
  });
}, 5000); // Подберите задержку исходя из вашей среды и условий работы
