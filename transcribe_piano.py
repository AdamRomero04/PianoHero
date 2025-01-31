from piano_transcription_inference import PianoTranscription, sample_rate, load_audio
import mido

def midi_note_to_key(note):
    """Converts a MIDI note number to a human-readable piano key."""
    note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    octave = (note // 12) - 1
    return f"{note_names[note % 12]}{octave}"

# Load the audio
midi_name = "Homecoming_-_Kanye_West_Chris_Martin_-_Piano_Tutorial_+_SHEETS (1)"
(audio, _) = load_audio(f'resources/{midi_name}.mp3', sr=sample_rate, mono=True)

# Initialize the transcriptor
transcriptor = PianoTranscription(device='cpu')#cuda

# Transcribe and save to MIDI
transcribed_dict = transcriptor.transcribe(audio, f'{midi_name}.mid')

