const { pipeline } = require('@xenova/transformers');

class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

async function getEmbedding(text) {
    try {
        const extractor = await PipelineSingleton.getInstance();
        const output = await extractor(text, { pooling: 'mean', normalize: true });

        return Array.from(output.data);
    } catch (error) {
        console.error("Error generating embedding locally:", error);
        return Array(384).fill(0);
    }
}

module.exports = { getEmbedding };