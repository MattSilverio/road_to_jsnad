import { Readable, Writable } from "stream";

// Streams são interessantes para arquivos grandes !!!

// Readable é uma classe onde você pode definir os métodos a serem lidos

// src readable.read() https://nodejs.org/docs/latest-v20.x/api/stream.html#readablereadsize

//The Readable stream API evolved across multiple Node.js versions and provides multiple methods of consuming stream data. In general, developers should choose one of the methods of consuming data and should never use multiple methods to consume data from a single stream. Specifically, using a combination of on('data'), on('readable'), pipe(), or async iterators could lead to unintuitive behavior.

const readableStream = Readable({
  read() {
    // this.push == this, pega o contexto. metodo push = process.stdout.write
    this.push("Hello world 1");
    this.push("Hello World 2");
    this.push("Hello World 3");

    // informa que os dados acabaram
    this.push(null);
  },
});

// saída de dados

// src writable.write() https://nodejs.org/docs/latest-v20.x/api/stream.html#writablewritechunk-encoding-callback

const writableStream = Writable({
  write(chunk, encoding, callback) {
    console.log("msg: ", chunk.toString());
    callback();
  },
});

// readableStream, informa o que há para ser lido , e executa uma pipe para rodar em paralelo com uma stream de escrita

// Writable = Saída, imprimir, salvar
readableStream.pipe(writableStream);

// desse jeito compensa se for arquivos menores
//readableStream.pipe(process.stdout);
