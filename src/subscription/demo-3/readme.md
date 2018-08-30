# RedisPubsub, GooglePubsub and pubsub

## pubsub

单机集群模式下启动多个服务器应用实例。

测试`pubsub`在多个服务器应用实例之间无法通信

```bash
(client1 and client2 can receive websocket message)   (client3 can not receive websocket message)
 client1                     client2                                 client3      client side
   |                           |                                       |
   | mutation/updateBook      /                                        |
   |        -----------------                                          |
---|------/------------------------------------------------------------|--------
|  |    /                                                              |       |
| worker1               worker2               worker3               worker4 ...|  server side
| pubsub.publish('BOOK', payload)                                              |
--------------------------------------------------------------------------------
```

需要使用`redis pubsub`或者`google pub/sub`，才能在多个服务器应用实例间传递消息

## redis pub/sub

列出`redis`的`pub/sub`的`channels`

```bash
127.0.0.1:6379> PUBSUB CHANNELS
1) "BOOK"
```

订阅`BOOK`频道，并通过`http://localhost:4000/graphiql`发送一个`updateBook` `mutation`，由于在该`mutation`的`resolver`中使用`pubsub.publish('BOOK', payload)`发布了一条消息，
所以`redis`交互式客户端这里会收到这条消息

```bash
127.0.0.1:6379> SUBSCRIBE BOOK
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "BOOK"
3) (integer) 1
1) "message"
2) "BOOK"
3) "{\"book\":{\"id\":\"rSJaAaXNcu\",\"title\":\"react\",\"authorId\":\"5Eh0evz9C\"}}"
```

## GCP pub/sub

开发测试：在当前终端`shell`配置好`GOOGLE_APPLICATION_CREDENTIALS`环境变量，用于认证，只有认证后才能调用`GCP pub/sub`的`api`
