import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer()

server.on('request', (request: IncomingMessage, response: ServerResponse) => { // 通过添加request的实际类型，来使得我们不需要看文档，因为一些历史原因使得我们的提示不够智能
  console.log('有人请求了')
  const array = []
  request.on('data',(chunk: Buffer)=>{ // 每上传一点内容就会触发这个事件,每次上传的报文的大小是固定几k
    array.push(chunk); // 只要服务器内存够内存够，上传1g也行
  })
  request.on('end',()=>{ // 传输结束触发
    const body = Buffer.concat(array).toString();
    console.log('body')
    console.log(body)
    response.statusCode = 404
    response.setHeader('x-ories',`I'am ories`) // 这里设置响应头
    response.write('1\n') // 用write去修改响应体
    response.write('2\n') // 也可以在write脸写二进制的图片，但是 需要设置contentType
    response.write('3\n')
    response.write('4\n')
    response.end() // 这里设置响应体,整个响应都是nodejs控制,
  })
})

server.listen(8888)
