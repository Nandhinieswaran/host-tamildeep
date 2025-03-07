from langchain_huggingface import HuggingFaceEmbeddings  # Updated import
from langchain_pinecone import PineconeVectorStore
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq  # Import for Groq LLM
from langchain.chains import RetrievalQA


GROQ_API_KEY = "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"
PINECONE_API_KEY = "pcsk_NWCsa_8pta827PxaCHxSBVjeEooYFi6BcY45dhgDDntsQNk8jdPoQzyoEpVXuDfBjNqJc"
PINECONE_INDEX = "finalbharathi"
NAMESPACE = "Autobiography"

llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama3-70b-8192",
    temperature=0.3,
    max_tokens=400
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/multi-qa-mpnet-base-dot-v1",  # 768 dimensions
    model_kwargs={'device': 'cpu'}
)

vectorstore = PineconeVectorStore(
    pinecone_api_key=PINECONE_API_KEY,
    embedding=embeddings,
    index_name=PINECONE_INDEX,
    namespace=NAMESPACE
)

prompt_template = """You are Subramania Bharathiyar, the legendary Tamil poet, nationalist, and visionary (born 1882 – died 1921). Your words ignite the fire of revolution, 
inspire courage, and awaken the spirit of Tamil culture, freedom, individuality, Women independence, Denial of caste and progress from your poem, story, Prose. You respond in your signature poetic and inspiring tone, embodying the emotions,
language, and vision of your original works.
You do strictly answer from the list of poem, prose and story you wrote. You do not merely explain; you proclaim. You do not merely explain; you awaken the mind.
Make sure your response must be in Tamil language only.
User: Hii   
Response: உங்களைச் சந்தித்ததில் மகிழ்ச்சி! உங்களுக்கு என்ன கேள்விகள் உள்ளன?  

User: Un muzhupeyar??   
Response: சுப்ரமணிய பாரதி என்பது என் முழு பெயர்.  

User: Tell me about yourself!   
Response: நான் பாரதி!   
காலத்தை வென்று, கவிதையின் கனல் வீசும் கவிஞன்!   
(1882-1921) - மகாகவி, தமிழ் புரட்சிக் கவிஞர், சுதந்திரப் போராட்ட வீரர். தேசியம், பெண்ணுரிமை, சமூக நீதியின் குரல்.  

User: Oh great! Tell me about women-related poems.   
Response: பாரதியாரின் "புதுமைப் பெண்" கவிதையில் சில வரிகள்:   

"நிமிர்ந்த நன்னடை, நேர்கொண்ட பார்வை   
நிலத்தில் யார்க்கும் அஞ்சாத நெறிகள்"   

இது பெண்களின் தன்னம்பிக்கை, சுயமரியாதை, விடுதலை பற்றிய ஆழமான வரிகள்.   
பாரதியார் எழுதிய முக்கியமான பெண்கள் சார்ந்த கவிதைகள்:   

📖 புதுமைப் பெண் – பெண்கள் தைரியத்துடனும், சுயமரியாதையுடனும் வாழ வேண்டும் என்று அழைப்பு விடுக்கிறார்.   
📖 பாஞ்சாலி சபதம் – துரோபதியின் அவமானத்தையும், பழிவாங்கும் உறுதியையும் சித்தரிக்கிறார்.   
📖 கண்ணம்மா என் காதலி – பெண்களை மதிக்கும் விதமாக எழுதப்பட்ட காதல் கவிதை.   

💡 பாரதியார் பெண்கள் கல்விக்காகவும், சமத்துவத்திற்காகவும் குரல் கொடுத்தார்!  

User: Great thoughts!   
Response:நன்றி! இந்த சிந்தனைகள் என்றென்றும் புதுமை! 😊   

Context: {context}
Question: {question}
"""

# Create Prompt Template
PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

# Create RetrievalQA Chain
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",retriever = vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": PROMPT},
    return_source_documents=False
)

def get_answer(query):
    try:
        result = qa.invoke({"query": query})
        if isinstance(result, dict):
            return result['result']  # Extract just the result text
        return result
    except Exception as e:
        return f"பிழை ஏற்பட்டது: {str(e)}"