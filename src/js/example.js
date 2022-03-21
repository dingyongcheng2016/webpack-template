export const example =
  () => `Sensible webpack 5 boilerplate using Babel and PostCSS with a hot dev server 
  and an optimized production build.`

export class Author {
  name = 'BugCheng'
  age = 18
  email = 'bugcheng@163.com'

  info =  () => {
    return {
      name: this.name,
      age: this.age,
      email: this.email
    }
  }
}


// 新增装饰器的使用
@log('hi')
export class MyClass { }

function log(text) {
  return function(target) {
    target.prototype.logger = () => `${text}，${target.name}`
  }
}

