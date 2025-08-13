import Agent from "./Agent";
import ChatOpenAI from "./ChatOpenAI";
import EmbeddingRetrievers from "./EmbeddingRetrievers";
import MCPClient from "./MCPClient";
import path from "path";
import fs from "fs";
import { logTitle } from "./utils";
const outPath = path.join(process.cwd(), "output");

const currentDir = process.cwd();
const modelName = process.env.LLM_MODEL || "";

const fetchMCP = new MCPClient("fetch", "uvx", ["mcp-server-fetch"]);
const fileMCP = new MCPClient("file", "npx", [
  "-y",
  "@modelcontextprotocol/server-filesystem",
  outPath,
]);

async function testChatOpenAI() {
  const llm = new ChatOpenAI(modelName);
  const { content, toolCalls } = await llm.chat("你好");

  console.log(content);
  console.log(toolCalls);
}

async function testMCPClient() {
  await fetchMCP.init();
  const tools = fetchMCP.getTools();
  console.log("tools: ", tools);
}

async function testAgent() {
  const agent = new Agent(modelName, [fetchMCP, fileMCP]);
  await agent.init();
  const URL = "https://jsonplaceholder.typicode.com/users";

  const question = `爬取 ${URL} 中的内容信息，在${currentDir}/knowledge 中，每个人创建一个 md 文件，保存基本信息`;
  const response = await agent.invoke(question);
  console.log("response: ", response);
  await agent.close();
}

async function testRAG() {
  const prompt = `告诉我 Bert 的信息,先从我给你的 context 中找到相关信息,创作一个故事，并且把这个故事保存到${outPath}/Bret.md，要包含其基本信息和故事`;
  const context = await retrieveContext(prompt);
  const agent = new Agent(modelName, [fetchMCP, fileMCP], "", context);
  await agent.init();
  const response = await agent.invoke(prompt);
  console.log("response: ", response);
}

async function retrieveContext(prompt: string) {
  // RAG
  const modelName = process.env.EMBEDDING_MODEL || "";
  const knowledgeDir = path.join(process.cwd(), "knowledge");
  const embeddingRetriver = new EmbeddingRetrievers(modelName);

  const files = fs.readdirSync(knowledgeDir);

  for (const file of files) {
    const content = fs.readFileSync(path.join(knowledgeDir, file), "utf-8");
    await embeddingRetriver.embedDocument(content);
  }

  const context = (await embeddingRetriver.retrieve(prompt)).join("\n");
  logTitle("🍀 CONTEXT 🍀");
  console.log("context: ", context);
  return context;
}

testRAG();
