from langchain_google_genai import ChatGoogleGenerativeAI

_model = None

def get_model():
    global _model

    if _model is None:
        _model = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.8,
        )

    return _model