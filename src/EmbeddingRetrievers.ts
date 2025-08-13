import VectorStore from "./VectorStore";

export default class EmbeddingRetrievers {
  private embeddingModel: string;
  private vectorStore: VectorStore;

  constructor(embeddingModel: string) {
    this.embeddingModel = embeddingModel;
    this.vectorStore = new VectorStore();
  }

  async embedQuery(query: string): Promise<number[]> {
    const embedding = await this.embed(query);
    return embedding;
  }

  async embedDocument(document: string): Promise<number[]> {
    const embedding = await this.embed(document);
    this.vectorStore.addItem({
      embedding: embedding,
      document,
    });
    return embedding;
  }

  private async embed(document: string): Promise<number[]> {
    const url = `${process.env.EMBEDDING_BASE_URL}/embeddings`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMBEDDING_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.embeddingModel,
        input: document,
      }),
    };
    const response = await fetch(url, options);

    const data = await response.json();
    console.log("data.data[0].embedding: ", data.data[0].embedding);
    return data.data[0].embedding;
  }

  async retrieve(query: string, topK: number = 3) {
    const queryEmbedding = await this.embedQuery(query);
    return this.vectorStore.search(queryEmbedding, topK);
  }
}
