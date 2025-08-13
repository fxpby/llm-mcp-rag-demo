export interface VectorStoreItem {
  embedding: number[];
  document: string;
}

export default class VetorStore {
  private vectorStore: VectorStoreItem[];

  constructor() {
    this.vectorStore = [];
  }

  async addItem(item: VectorStoreItem) {
    this.vectorStore.push(item);
  }

  async search(queryEmbedding: number[], topK: number = 3) {
    const scored = this.vectorStore.map((item) => ({
      document: item.document,
      store: this.consineSim(item.embedding, queryEmbedding),
    }));

    return scored.sort((a, b) => b.store - a.store).slice(0, topK);
  }

  private consineSim(v1: number[], v2: number[]) {
    // 点乘，对应位置元素的积，reduce 求和
    const dotProduct = v1.reduce((acc, val, index) => acc + val * v2[index], 0);
    // 向量 1 的模长，平方和再开根
    const magnitude1 = Math.sqrt(v1.reduce((acc, val) => acc + val * val, 0));
    // 向量 2 的模长，平方和再开根
    const magnitude2 = Math.sqrt(v2.reduce((acc, val) => acc + val * val, 0));
    // 余弦相似度，点乘/（向量 1 模长 * 向量 2 模长 ）
    return dotProduct / (magnitude1 * magnitude2);
  }
}
