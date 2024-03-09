import { timeEnd } from "console";
import { createWriteStream } from "fs";
import { Readable, Writable, Transform } from "stream";

// Streams são interessantes para arquivos grandes !!!

// Readable é uma classe onde você pode definir os métodos a serem lidos

// src readable.read() https://nodejs.org/docs/latest-v20.x/api/stream.html#readablereadsize

//The Readable stream API evolved across multiple Node.js versions and provides multiple methods of consuming stream data. In general, developers should choose one of the methods of consuming data and should never use multiple methods to consume data from a single stream. Specifically, using a combination of on('data'), on('readable'), pipe(), or async iterators could lead to unintuitive behavior.

const readableStream = Readable({
  read() {
    console.time();
    // this.push == this, pega o contexto. metodo push = process.stdout.write
    for (let i = 0; i < 1e6; i++) {
      // 100 mil itens
      const person = {
        id: Date.now() + i,
        name: `Fulano - ${i}`,
      };

      const data = JSON.stringify(person);
      this.push(data);
    }

    // informa que os dados acabaram
    this.push(null);
  },
});

// processamento dos dados -- json to csv
// src transform.transform() : https://nodejs.org/docs/latest-v20.x/api/stream.html#transform_transformchunk-encoding-callback
const mapFields = Transform({
  transform(chunk, encoding, callback) {
    const data = JSON.parse(chunk);
    const result = `${data.id},${data.name.toUpperCase()}\n`;

    callback(null, result);
  },
});

const mapHeaders = Transform({
  transform(chunk, encoding, callback) {
    this.counter = this.counter ?? 0;
    if (this.counter) {
      return callback(null, chunk);
    }

    this.counter += 1;
    callback(null, "id,name\n".concat(chunk));
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
const pipeline = readableStream
  .pipe(mapFields)
  .pipe(mapHeaders)
  //.pipe(writableStream);
  .pipe(createWriteStream("myfile.csv"));

pipeline.on("end", () => console.timeEnd());
