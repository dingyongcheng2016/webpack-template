import _ from 'lodash';
// Test import of a JavaScript module
import { example, Author, MyClass } from '@/js/example'

// Test import of an asset
import webpackLogo from '@/images/webpack-logo.svg'

// Test import of styles
import '@/styles/index.scss'

// Appending to the DOM
const logo = document.createElement('img')
logo.src = webpackLogo

const heading = document.createElement('h1')
heading.textContent = example()

// Test a background image url in CSS
const imageBackground = document.createElement('div')
imageBackground.classList.add('image')

// Test a public folder asset
const imagePublic = document.createElement('img')
imagePublic.src = '/assets/image/example.png'

const app = document.querySelector('#root')
app.append(logo, heading, imageBackground, imagePublic)

// 类的调用
const author = new Author();
author.info();


//  promise

function getData(id=0){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(id)
        }, 1000)
    })
}

getData().then(res=>{
    console.log('res', res)
})


//  装饰器
const mycall = new MyClass();
mycall.logger();

// 不解析lodash
_.delay(5000);


// 代码懒加载
// 按需加载
console.log('imageBackground', imageBackground)
imageBackground.addEventListener('click', () => {
    console.log('我出发了')
    import('./js/desc').then(({ default: element }) => {
      console.log(element)
      document.body.appendChild(element)
    })
  })

//这会生成 <link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部，指示着浏览器在闲置时间预取 login-modal-chunk.js 文件。
// import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
// 预先获取
// import(/* webpackPreload: true */ 'ChartingLibrary');