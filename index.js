const express = require('express');
const multer = require('multer');
const pdfparse =  require('pdf-parse');
const fs = require('fs');
require('dotenv').config();
const {GoogleGenAI} = require( '@google/genai');
const { QdrantClient } =require('@qdrant/js-client-rest');


const app = express();
const upload = multer({dest: "uploads/"});
const ai = new  GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
})

async function createEmbedding(text) {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
        });
        
        console.log('=== Full API Response ===');
        console.log(JSON.stringify(response, null, 2));
        
        return response.embeddings?.[0]?.values ?? [];
    } catch (error) {
        console.error('Error in createEmbedding:', error);
        return [];
    }
}


const qdrant  = new QdrantClient({
  url:process.env.QUADRANT_URL,
  apiKey: process.env.QUADRANT_API_KEY
});


function cosineSimilarity(vecA , vecB){

    let dotproduct= 0;
    for (let i = 0 ; i <vecA.length ; i++){
           dotproduct+= vecA[i]*vecB[i];

    }
    return dotproduct;

}

app.get('/' , (req , res) => {
    res.send('hey i am aditya');
});

app.get('/create-collection', async (req,res) => {

try{
    await qdrant.createCollection(
        'pdf-docs', {
            vectors :{
                size :3072,
                distance : 'Cosine' ,           
            },
})  

res.send('collection is created')

}catch(err){
    if (err?.data?.status?.error?.includes('already exists')) {
        return res.send('collection already exists');
    }
    res.status(500).send(err);
}

})

app.post('/upload', upload.single("pdf") ,async(req, res) =>{
    console.log(req.file);
    //res.send('file uploaded successfully');

 try{

     const databuffer = fs.readFileSync(req.file.path);
     const pdfdata = await pdfparse(databuffer);
     const text = pdfdata.text ;
      const chunks = text.split('\n\n').filter((chunk) => chunk.trim() !='');
     // console.log(chunks);

      const chunkEmbeddings = []
      for (const chunk of chunks){
        const embedding = await createEmbedding(chunk);
        chunkEmbeddings.push({
          text : chunk,
          embedding   
        });
      }

      const points = chunkEmbeddings.map((item, index) => ({
    id : index+1,
    vector :item.embedding,
    payload : {
        text : item.text
    },
     
      }))

        await qdrant.upsert('pdf-docs', {
        points ,
        });

    const question = req.body.question   
    const questionEmbedding = await createEmbedding (question);
   // console.log('Question embedding length:', questionEmbedding.length);
    //const matchedchunks = chunks.filter(chunk => chunk.toLowerCase().includes('http'));

    // let bestChunk = null;

    // let bestScore= -Infinity;

    // for (const items of chunkEmbeddings){
    //     const Score = cosineSimilarity(questionEmbedding, items.embedding);
    //    if (Score > bestScore){
    //     bestChunk = items.text;
    //     bestScore = Score;

    //    }
    // }
    // console.log(bestChunk);
    // console.log(bestScore);


    const searchResult = await qdrant.search('pdf-docs', {
        vector: questionEmbedding,
        limit: 1,
    });
    const bestChunk = searchResult[0].payload.text;

     const response = await ai.models.generateContent({
        model :'gemini-3.6-flash',
        contents : `answer the question using the context: ${bestChunk} and question is ${question}`                        
    });
      res.send(response.text);

   



  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }


}); 






app.listen(3000, () => {
    console.log ('server is running on port 3000');
});
