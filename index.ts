import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public') // public所在的绝对路径
let cacheAge = 3600 * 24 * 265


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
      //返回文件内容
      response.setHeader('Cache-Control',`public, max-age=${cacheAge}`)
      response.end(data) // data是一个buffer
    }
  })
})

server.listen(8888)
