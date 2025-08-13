import MCPClient from "./MCPClient";
import ChatOpenAI from "./ChatOpenAI";
import { logTitle } from "./utils";

export default class Agent {
  private mcpClients: MCPClient[];
  private llm: ChatOpenAI | null = null;
  private model: string;
  // 系统提示词
  private systemPrompt;
  // RAG context
  private context: string;

  constructor(
    model: string,
    mcpClients: MCPClient[],
    systemPrompt: string = "",
    context: string = ""
  ) {
    this.mcpClients = [];
    this.model = model;
    this.systemPrompt = systemPrompt;
    this.context = context;
  }

  public async init() {
    logTitle("🛫 初始化 LLM 和 Tools 🛫");
    this.llm = new ChatOpenAI(this.model, this.systemPrompt);
    for (const mcpClient of this.mcpClients) {
      await mcpClient.init();
    }
    const tools = this.mcpClients.flatMap((mcpClient) => mcpClient.getTools());
    this.llm = new ChatOpenAI(
      this.model,
      this.systemPrompt,
      tools,
      this.context
    );
  }

  public async close() {
    logTitle("⚡️ 关闭 MCP Clients ⚡️");
    for await (const client of this.mcpClients) {
      await client.close();
    }
  }

  async invoke(prompt: string) {
    if (!this.llm) {
      throw new Error("LLM 尚未初始化");
    }
    let response = await this.llm.chat(prompt);

    while (true) {
      // 工具调用
      if (response.toolCalls.length > 0) {
        for (const toolCall of response.toolCalls) {
          const mcp = this.mcpClients.find((mcpClient) =>
            mcpClient.getTools().find((t) => t.name === toolCall.function.name)
          );

          if (mcp) {
            logTitle("使用 Tool 名称：" + toolCall.function.name);
            console.log(`Calling tool name: ${toolCall.function.name}`);
            console.log(
              `Calling tool arguments: ${toolCall.function.arguments}`
            );

            const result = await mcp.callTool(
              toolCall.function.name,
              JSON.parse(toolCall.function.arguments)
            );
            console.log("result: ", result);
            this.llm.appendToolResult(toolCall.id, JSON.stringify(result));
          } else {
            this.llm.appendToolResult(toolCall.id, "Tool 未找到");
          }
        }
        response = await this.llm.chat();
        continue;
      }
      await this.close();
      return response.content;
    }
  }
}
