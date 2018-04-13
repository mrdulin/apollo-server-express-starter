# 测试

## 使用 `curl` 测试

运行 `main.js`

```bash
curl \
 -X POST \
 -H "Content-Type: application/json" \
 --data '{"query": "{author(firstName: \"du\", lastName: \"lin\") {id}}"}' http://localhost:3000/graphql
```
