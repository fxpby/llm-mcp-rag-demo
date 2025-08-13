import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export default class MCPClient {
  private mcp: Client;
  // private anthropic: Anthropic;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];
  private command: string;
  private args: string[];

  constructor(name: string, command: string, args: string[], version?: string) {
    // Initialize Anthropic client and MCP client
    // this.anthropic = new Anthropic({
    //   apiKey: ANTHROPIC_API_KEY,
    // });
    this.mcp = new Client({
      name,
      command,
      version: version || "1.0.0",
    });
    this.command = command;
    this.args = args;
  }

  public async close() {
    await this.mcp.close();
  }

  public async init() {
    await this.connectToServer();
  }

  public getTools() {
    return this.tools;
  }

  private async connectToServer() {
    try {
      // Initialize transport and connect to server
      this.transport = new StdioClientTransport({
        command: this.command,
        args: this.args,
      });
      await this.mcp.connect(this.transport);

      // List available tools
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        };
      });
      console.log(
        "Connected to server with tools:",
        this.tools.map(({ name }) => name)
      );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }
}
