import { spawn } from "child_process";

// Запускаем Ganache CLI в режиме детерминированного деплоя и логирования в файл
const ganache = spawn("ganache-cli", ["-d", "--verbose"]);

ganache.stdout.on("data", (data) => {
  console.log(`Ganache Output: ${data}`);

  // Ищем строку, указывающую на создание контракта
  const output = data.toString();
  const contractCreationPattern = /Contract created: (.*) at transaction hash/;
  const match = contractCreationPattern.exec(output);

  if (match) {
    const contractAddress = match[1];
    console.log(`Deployed Contract Address: ${contractAddress}`);

    // Здесь можно выполнить дополнительные действия с адресом контракта
    // Например, сохранить адрес в файле или переменной окружения
  }
});

ganache.stderr.on("data", (data) => {
  console.error(`Ganache Error: ${data}`);
});

ganache.on("close", (code) => {
  console.log(`Ganache CLI process exited with code ${code}`);
});

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
