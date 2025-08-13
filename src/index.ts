import Agent from "./Agent";
import ChatOpenAI from "./ChatOpenAI";
import MCPClient from "./MCPClient";
import path from "path";
const outPath = path.join(process.cwd(), "output");

const currentDir = process.cwd();
const modelName = process.env.MODEL_NAME || "";

const fetchMcp = new MCPClient("fetch", "uvx", ["mcp-server-fetch"]);
const fileMcp = new MCPClient("file", "npx", [
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
  await fetchMcp.init();
  const tools = fetchMcp.getTools();
  console.log("tools: ", tools);
}

async function testAgent() {
  const agent = new Agent(modelName, [fetchMcp, fileMcp]);
  await agent.init();
  const URL = "https://jsonplaceholder.typicode.com/users";

  const question = `爬取 ${URL} 中的内容信息，在${currentDir}/knowledge 中，每个人创建一个 md 文件，保存基本信息`;
  const response = await agent.invoke(question);
  console.log("response: ", response);
}

testAgent();
