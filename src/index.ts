import ChatOpenAI from "./ChatOpenAI";

async function main() {
  const llm = new ChatOpenAI("glm-4.5");
  const { content, toolCalls } = await llm.chat("你好");

  console.log(content);
  console.log(toolCalls);
}

main();
