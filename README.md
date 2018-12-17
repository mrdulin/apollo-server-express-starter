# GraphQL, apollo-server, express.js 教学项目

This project introduces the important concepts and usage of `GraphQL` and `apollo`, as well as some typical issues such as `pagination` and `N+1 query`.

这个项目介绍了`GraphQL`和`apollo`的重要概念和用法, 包含一些典型例子：

- N+1 查询优化
- graphql-subscription
  - 多用户消息频道
  - 多`nodejs server instances`下通过`GCP pub/sub`进行消息通讯
  - `websocket`安全链接，基于`jwt`的用户认证
- 文件上传
- 内置`directive`，自定义`directive`
- 批量查询
- 自定义`scalar`类型
- 分页
  ...

这些例子涵盖了`GraphQL`, `apollo-server`最常用，最重要的功能，欢迎交流。

## Usage

- `npm i` to install dependencies
- If you use vscode, select `typescript` version to local version
- Take a look at `.vscode/launch.json` file, you will find how to launch program for each sample
