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

const publicDir = p.resolve(__dirname, 'public') // public所在的绝对路径
// 任务一,根据url返回不同的文件
server.on('request', (request: IncomingMessage, response: ServerResponse) => { // 通过添加request的实际类型，来使得我们不需要看文档，因为一些历史原因使得我们的提示不够智能
  const {method, url: path, headers} = request // 从request中读取url，并且重新命名为path
  const {pathname, search} = url.parse(path)

  if (method !== 'GET') {
    // response.statusCode = 405;
    // response.end()
    response.statusCode = 200
    response.end('this is a fake response')
    return
  }

  let filename = pathname.substr(1)
  if (filename === '') {
    filename = 'index.html'
  }
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      console.log(error)
      if (error.errno === -2) {
        response.statusCode = 404
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.end(data)
        })
      } else if (error.errno === -21) {
        response.statusCode = 403 // 403没全县
        response.end('no authority')
      } else {
        response.statusCode = 500 // 5开头服务器问题
        response.end('server is busy')
      }
    } else {
      response.end(data) // data是一个buffer
    }
  })
})

server.listen(8888)
