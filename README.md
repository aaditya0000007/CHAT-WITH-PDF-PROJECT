# Chat with PDF

A backend-based **Chat with PDF** application built entirely with JavaScript. The project allows users to upload PDF documents, process their content, store document data in **Qdrant**, and ask questions about the uploaded PDF using the **Gemini API**.

This project does not include a frontend. The APIs are tested using **Postman**.

## Features

* Upload PDF documents
* Extract text from PDF files
* Process PDF content into chunks
* Generate embeddings for document data
* Store and retrieve vector data using Qdrant
* Ask questions about uploaded PDFs
* Generate AI-powered answers using the Gemini API
* REST API-based backend
* API testing with Postman

## Technologies Used

* JavaScript
* Node.js
* Express.js
* Gemini API
* Qdrant
* Postman
* PDF processing libraries
* REST APIs

## How It Works

```text
PDF Upload
    ↓
Extract PDF Text
    ↓
Split Text into Chunks
    ↓
Generate Embeddings
    ↓
Store Vectors in Qdrant
    ↓
User Sends a Question
    ↓
Search Relevant PDF Content
    ↓
Send Relevant Context to Gemini API
    ↓
Generate Answer
```

## Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
```

**Never upload your `.env` file to GitHub.**

Add it to `.gitignore`:

```gitignore
node_modules/
.env
```

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Navigate to the project:

```bash
cd YOUR-REPOSITORY
```

Install dependencies:

```bash
npm install
```

Create your `.env` file and add your Gemini and Qdrant credentials.

## Running the Project

Start the server:

```bash
npm start
```

Or, if you are using Nodemon:

```bash
npm run dev
```

## API Testing

Since this project does not have a frontend, all APIs can be tested using **Postman**.

Typical workflow:

1. Upload a PDF using the PDF upload endpoint.
2. The server extracts and processes the PDF text.
3. The document embeddings are stored in Qdrant.
4. Send a question through the chat endpoint.
5. Relevant information is retrieved from Qdrant.
6. Gemini generates an answer using the retrieved PDF context.

## Project Purpose

This project was built to understand practical concepts involved in **Generative AI, embeddings, vector databases, RAG (Retrieval-Augmented Generation), API development, PDF processing, and LLM integration**.

## Author

**Your Name**
