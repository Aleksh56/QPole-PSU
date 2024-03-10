import path from 'path';
import Hapi from '@hapi/hapi';
import inert from '@hapi/inert';

const port = process.env.PORT || 3000;

const FILES = /\.(js|js.map|woff|woff2|svg|bmp|jpg|jpeg|gif|png|ico|css)(\?v=\d+\.\d+\.\d+)?$/;

const init = async () => {
  const server = Hapi.server({
    port,
    host: '0.0.0.0',
  });

  await server.register(inert);

  server.route({
    method: 'GET',
    path: '/{path*}',
    // handler: (request, h) => {
    //   if (FILES.test(request.path)) {
    //     return h.file(path.join(process.cwd(), 'dist', request.path));
    //   }

    //   return h.file(path.join(process.cwd(), 'dist', 'index.html'));
    // },
    handler: (request, h) => {
      const filePath = FILES.test(request.path)
        ? path.join(__dirname, 'dist', request.path)
        : path.join(__dirname, 'dist', 'index.html');
      return h.file(filePath).code(FILES.test(request.path) ? 200 : 404);
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
