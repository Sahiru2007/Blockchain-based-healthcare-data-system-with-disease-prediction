from transformers import pipeline
import whisper
import sys

def load_whisper_model(model_name="base"):
    return whisper.load_model(model_name)

def transcribe_audio(model, audio_file_path):
    return model.transcribe(audio_file_path, fp16=False)["text"]

def summarize_text(text, summarizer, max_chunk_length=1024):
    # Split the text into manageable parts if it's too long
    parts = [text[i:i+max_chunk_length] for i in range(0, len(text), max_chunk_length)]
    summaries = [summarizer(part)[0]["summary_text"] for part in parts]
    # Combine the summaries of each part
    full_summary = " ".join(summaries)
    return full_summary

def main(audio_file_path):
    # Load the Whisper and summarization models
    whisper_model = load_whisper_model()
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    # Transcribe the audio file
    transcribed_text = transcribe_audio(whisper_model, audio_file_path)
    
    # Summarize the transcribed text
    summary = summarize_text(transcribed_text, summarizer)
    
    # Return the transcription and summary separated by the delimiter ###
    return f"{transcribed_text}###{summary}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <audio_file_path>")
        sys.exit(1)

    audio_file_path = sys.argv[1]
    output = main(audio_file_path)
    print(output)
