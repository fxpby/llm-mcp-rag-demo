import ChatOpenAI from "./ChatOpenAI";
import MCPClient from "./MCPClient";

async function testChatOpenAI() {
  const llm = new ChatOpenAI("glm-4.5");
  const { content, toolCalls } = await llm.chat("你好");

  console.log(content);
  console.log(toolCalls);
}

async function testMCPClient() {
  const fetchMcp = new MCPClient("fetch", "uvx", ["mcp-server-fetch"]);
  await fetchMcp.init();
  const tools = fetchMcp.getTools();
  console.log("tools: ", tools);
}

testMCPClient();
