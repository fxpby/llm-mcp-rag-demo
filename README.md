# LLM-MCP-RAG playground

## 核心功能

- 大语言模型调用
- 通过 MCP（Model Context Protocol）实现 LLM 与外部工具的交互
- 实现基于向量检索的 RAG（检索增强生成）系统
- 支持文件系统操作和网页内容获取

## 环境准备

- 安装 node.js， 版本 18+
- 安装 pnpm 包管理器
- 安装 uv
- LLM 模型（不一定是 openAI，免费的 glm-4.5 等也很香）
- RAG 模型（自己用的是硅基流动免费的 BAAI/bge-m3）

根目录`.env` 文件:

```env
# LLM api key
OPENAI_API_KEY=xxxxxx
# LLM base url
OPENAI_BASE_URL=https://openrouter.ai/api/v1
# LLM model
LLM_MODEL=openai/gpt-4o-mini
# RAG api key
EMBEDDING_KEY=xxxxxx
# RAG base url
EMBEDDING_BASE_URL=https://api.siliconflow.cn/v1
# RAG model
EMBEDDING_MODEL=BAAI/bge-m3
```

硅基流动邀请码：qh4aiuos

## 开始运行

```js
pnpm install
pnpm run dev
```

## Reference

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - MCP 文档
- [OpenAI API 文档](https://platform.openai.com/docs/api-reference) - OpenAI API 文档
- [bigmodel 配置文档](https://docs.bigmodel.cn/cn/guide/develop/openai/introduction#%E5%9F%BA%E7%A1%80%E9%85%8D%E7%BD%AE) - bigmodel 配置文档
- [BAAI/bge-m3 API 文档](https://docs.siliconflow.cn/cn/api-reference/embeddings/create-embeddings) - RAG 模型文档
