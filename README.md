# LLM-MCP-RAG playground

## 核心功能

- 大语言模型调用
- 通过 MCP（Model Context Protocol）实现 LLM 与外部工具的交互
- 实现基于向量检索的 RAG（检索增强生成）系统
- 支持文件系统操作和网页内容获取

## 环境准备

- 安装 node， 版本 > 18
- 安装 uv
- 大语言模型（不一定是 openAI）

## 开始运行

```js
pnpm install
pnpm run dev
```

## Reference

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - MCP 文档
- [OpenAI API 文档](https://platform.openai.com/docs/api-reference) - OpenAI API 文档
- [bigmodel 配置文档](https://docs.bigmodel.cn/cn/guide/develop/openai/introduction#%E5%9F%BA%E7%A1%80%E9%85%8D%E7%BD%AE) - bigmodel 配置文档
