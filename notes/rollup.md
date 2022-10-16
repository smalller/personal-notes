## rollup
基本原理：
- 打包代码时，会分为imports栈和exports栈
- 分别会将导出的模块的引入的模块放入这两个栈中
- 最后打包时，只会将引入了并且使用了的模块打包进bundle文件中，只是引入但未使用的模块不会被打包
- 其原理也是通过ast抽象语法树进行解析的，以及运用了treeshaking（树摇）原理，即把有用的代码留下