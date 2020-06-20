import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const server = http.createServer()

// server.on('request', (request: IncomingMessage, response: ServerResponse) => { // 通过添加request的实际类型，来使得我们不需要看文档，因为一些历史原因使得我们的提示不够智能
//   const array = []
//   request.on('data',(chunk: Buffer)=>{ // 每上传一点内容就会触发这个事件,每次上传的报文的大小是固定几k
//     array.push(chunk); // 只要服务器内存够内存够，上传1g也行
//   })
//   request.on('end',()=>{ // 传输结束触发
//     const body = Buffer.concat(array).toString();
//     console.log('body')
//     console.log(body)
//     response.statusCode = 404
//     response.setHeader('x-ories',`I'am ories`) // 这里设置响应头
//     response.write('1\n') // 用write去修改响应体
//     response.write('2\n') // 也可以在write脸写二进制的图片，但是 需要设置contentType
//     response.write('3\n')
//     response.write('4\n')
//     response.end() // 这里设置响应体,整个响应都是nodejs控制,
//   })
// })

const publicDir = p.resolve(__dirname,'public') // public所在的绝对路径
// 任务一,根据url返回不同的文件
server.on('request', (request: IncomingMessage, response: ServerResponse) => { // 通过添加request的实际类型，来使得我们不需要看文档，因为一些历史原因使得我们的提示不够智能
  const {method, url:path, headers} = request // 从request中读取url，并且重新命名为path
  console.log(path)
  const {pathname, search} = url.parse(path)
  // switch(pathname){
    // case '/index.html':
    //   response.setHeader('Content-Type','text/html; charset=utf-8') // 要告诉浏览器内容的类型，否则都是HTML
    //   fs.readFile(p.resolve(publicDir, 'index.html'), (error, data)=>{
    //     if(error) throw error;
    //     response.end(data.toString()) // data是一个buffer
    //   })
    //   break;
    // case '/style.css':
    //   response.setHeader('Content-Type','text/css; charset=utf-8') // 要告诉浏览器内容的类型，否则都是HTML
    //   fs.readFile(p.resolve(publicDir, 'style.css'), (error, data)=>{
    //     if(error) throw error;
    //     response.end(data.toString()) // data是一个buffer
    //   })
    //   break;
    // case '/main.js':
    //   response.setHeader('Content-Type','text/javascript; charset=utf-8') // 要告诉浏览器内容的类型，否则都是HTML
    //   fs.readFile(p.resolve(publicDir, 'main.js'), (error, data)=>{
    //     if(error) throw error;
    //     response.end(data.toString()) // data是一个buffer
    //   })
    //   break;
    //   response.setHeader('Content-Type','text/html; charset=utf-8') // 要告诉浏览器内容的类型，否则都是HTML
    // }

    // /index.html => index.html
  const filename = pathname.substr(1);
  fs.readFile(p.resolve(publicDir, filename), (error, data)=>{
    if(error) {
      response.statusCode = 404;
      response.end('你要的文件不存在');
    } else {
      response.end(data.toString()) // data是一个buffer
    }
  })
})

server.listen(8888)
