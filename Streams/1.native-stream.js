// Processo de leitura e escrita de dados no console em um stream
//process.stdin
//  .pipe(process.stdout)
//  .on("data", (msg) => console.log("data: ", msg.toString()))
//  .on("error", (err) => console.log("error: ", err.toString()))
//  .on("end", () => console.log("end"))
//  .on("close", () => console.log("close"));

// Enviar mensagens entre diferentes portas
//// Terminal 1
//node -e "require('net').createServer(socket => socket.pipe(process.stdout)).listen(1337)"

//// Terminal 2
//node -e "process.stdin.pipe(require('net').connect(1337));"

// Processar arquivos e copiar para um arquivo
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > hello.txt

// Criando Api para executar um serviço assim

import http from "http";
import { createReadStream } from "fs";

http
  .createServer((req, res) => {
    // Má prática para arquivos grandes .. hello.txt tem 1gb
    //const file = readFileSync("hello.txt");
    //res.write(file);
    //res.end();

    createReadStream("hello.txt").pipe(res);
  })
  .listen(3000, () => console.log("Server running on port 3000"));
