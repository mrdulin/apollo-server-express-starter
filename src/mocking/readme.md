# mocking unit test

## 参考链接：

* https://www.apollographql.com/docs/graphql-tools/mocking.html

## 注意

* 如果在 schema.js 文件中使用 makeExecutableSchema 创建可执行的 schema，然后 mockList.spec.js 和 mockServer.spec.js
  导入该 schema，这两个文件的单元测试会出现问题，现象是 mockList.spec.js 中的 mockserver.query()会查询到 mockServer.spec.js 中的 mock 数据
