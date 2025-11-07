import React, { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Loader from '@/components/ui/Loader';
import {
  Play,
  Square,
  Volume2,
  Users,
  FileText,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff,
} from 'lucide-react';

const DEFAULT_SCRIPT = `Character 1: Welcome to our TTS Conversation Studio!
Character 2: This is where your scripts come to life with realistic voices.
Character 1: Simply edit this text or write your own dialogue.
Character 2: Then choose voices and hit play to hear the conversation!`;

type Status = 'idle' | 'playing';
type SpeakingCharacter = 'none' | 'character1' | 'character2';

const playConversation = (script, voices, voice1URI, voice2URI, textareaRef, onCharacterSpeaking, onEnd) => {
  window.speechSynthesis.cancel();
  const lines = script.split('\n').filter(line => line.trim() !== '');
  if (!lines.length) {
    onEnd();
    return;
  }

  let charIndexOffset = 0;
  const utterances = lines.map(line => {
    const trimmedLine = line.trim();
    let textToSpeak = null, voiceURI = null, character = 'none';

    if (trimmedLine.toLowerCase().startsWith('character 1:')) {
      voiceURI = voice1URI;
      textToSpeak = trimmedLine.substring('character 1:'.length).trim();
      character = 'character1';
    } else if (trimmedLine.toLowerCase().startsWith('character 2:')) {
      voiceURI = voice2URI;
      textToSpeak = trimmedLine.substring('character 2:'.length).trim();
      character = 'character2';
    }

    if (textToSpeak && voiceURI) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
      if (selectedVoice) utterance.voice = selectedVoice;

      const lineStartIndex = script.indexOf(line, charIndexOffset);
      const textStartIndex = line.indexOf(textToSpeak) + lineStartIndex;

      utterance.onstart = () => {
        onCharacterSpeaking(character);
      };

      utterance.onboundary = event => {
        if (textareaRef.current && event.name === 'word') {
          const start = textStartIndex + event.charIndex;
          const end = start + event.charLength;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start, end);
        }
      };

      charIndexOffset += line.length + 1;
      return { utterance, character };
    }
    return null;
  }).filter(u => u !== null);

  if (utterances.length > 0) {
    let currentIndex = 0;
    
    const speakNext = () => {
      if (currentIndex < utterances.length) {
        const { utterance, character } = utterances[currentIndex];
        utterance.onend = () => {
          currentIndex++;
          if (currentIndex < utterances.length) {
            speakNext();
          } else {
            onCharacterSpeaking('none');
            if (textareaRef.current) textareaRef.current.setSelectionRange(0, 0);
            onEnd();
          }
        };
        window.speechSynthesis.speak(utterance);
      }
    };
    
    speakNext();
  } else {
    onEnd();
  }
};

const TTSPlayer = () => {
  const [voices, setVoices] = useState([]);
  const [character1Voice, setCharacter1Voice] = useState('');
  const [character2Voice, setCharacter2Voice] = useState('');
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [status, setStatus] = useState<Status>('idle');
  const [speakingCharacter, setSpeakingCharacter] = useState<SpeakingCharacter>('none');
  const [error, setError] = useState('');

  const scriptTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
          if (englishVoices.length > 0) {
            setCharacter1Voice(v => v || englishVoices[0].voiceURI);
            setCharacter2Voice(v => v || (englishVoices[1] || englishVoices[0]).voiceURI);
          }
        }
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        handleStop();
      };
    }
  }, []);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setStatus('idle');
    setSpeakingCharacter('none');
  }, []);

  const handlePlay = () => {
    if (status !== 'idle') return;
    setError('');
    setStatus('playing');
    playConversation(
      script, 
      voices, 
      character1Voice, 
      character2Voice, 
      scriptTextareaRef,
      setSpeakingCharacter,
      () => {
        setStatus('idle');
        setSpeakingCharacter('none');
      }
    );
  };

  const resetAll = () => {
    setScript(DEFAULT_SCRIPT);
    setError('');
    handleStop();
  };

  const disableControls = status !== 'idle';

  // Helper function to get character card styles based on speaking state
  const getCharacterCardStyles = (character: 'character1' | 'character2') => {
    const baseStyles = "bg-storiq-card-bg/80 rounded-2xl shadow-lg p-6 border transition-all duration-300";
    
    if (speakingCharacter === character) {
      return `${baseStyles} border-storiq-purple bg-storiq-purple/10 shadow-lg shadow-storiq-purple/20`;
    }
    
    if (character === 'character1' && character1Voice) {
      return `${baseStyles} border-green-400/50`;
    }
    
    if (character === 'character2' && character2Voice) {
      return `${baseStyles} border-blue-400/50`;
    }
    
    return `${baseStyles} border-storiq-border`;
  };

  // Helper function to get status indicator styles
  const getStatusIndicator = (character: 'character1' | 'character2') => {
    if (speakingCharacter === character) {
      return (
        <div className="flex items-center text-storiq-purple animate-pulse">
          <Mic className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Speaking...</span>
        </div>
      );
    }
    
    if (character === 'character1' ? character1Voice : character2Voice) {
      return (
        <div className="flex items-center text-green-400">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Ready</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-white/40">
        <MicOff className="mr-2 h-5 w-5" />
        <span className="text-sm">Select voice</span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-storiq-purple" />
              TTS Conversation Studio
            </span>
          </h1>
          <p className="text-white/60 text-lg">
            Create realistic conversations with text-to-speech technology
          </p>
        </div>

        {/* Voice Settings */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Character 1 */}
          <div className={getCharacterCardStyles('character1')}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold flex items-center text-white">
                <Volume2 className="mr-2 text-storiq-purple" /> 
                Character 1
              </h3>
              {getStatusIndicator('character1')}
            </div>
            <select
              value={character1Voice}
              onChange={e => setCharacter1Voice(e.target.value)}
              disabled={disableControls}
              className="w-full h-12 rounded-xl border border-storiq-border bg-black/30 px-4 py-3 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-storiq-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="" className="text-white/60">Select a voice...</option>
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI} className="text-white">{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>

          {/* Character 2 */}
          <div className={getCharacterCardStyles('character2')}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold flex items-center text-white">
                <Users className="mr-2 text-storiq-blue" /> 
                Character 2
              </h3>
              {getStatusIndicator('character2')}
            </div>
            <select
              value={character2Voice}
              onChange={e => setCharacter2Voice(e.target.value)}
              disabled={disableControls}
              className="w-full h-12 rounded-xl border border-storiq-border bg-black/30 px-4 py-3 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-storiq-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="" className="text-white/60">Select a voice...</option>
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI} className="text-white">{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Script Editor */}
        <div className="bg-storiq-card-bg/80 rounded-2xl shadow-lg p-6 mb-8 border border-storiq-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center text-white">
              <FileText className="mr-2 text-storiq-purple" /> Conversation Script
            </h3>
            <div className="flex items-center gap-3">
              {speakingCharacter !== 'none' && (
                <div className="flex items-center px-3 py-1 bg-storiq-purple/20 border border-storiq-purple rounded-lg">
                  <div className="w-2 h-2 bg-storiq-purple rounded-full animate-pulse mr-2"></div>
                  <span className="text-storiq-purple text-sm font-medium">
                    {speakingCharacter === 'character1' ? 'Character 1 Speaking' : 'Character 2 Speaking'}
                  </span>
                </div>
              )}
              <Button
                onClick={resetAll}
                variant="outline"
                className="flex items-center px-4 py-2 text-white/60 hover:text-white transition border-white/20"
                type="button"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
          <Textarea
            ref={scriptTextareaRef}
            rows={12}
            value={script}
            onChange={e => setScript(e.target.value)}
            disabled={disableControls}
            placeholder="Character 1: Your line here...&#10;Character 2: Another line here..."
            className="bg-black/40 border border-storiq-border text-white placeholder:text-white/40 min-h-[120px] text-base rounded-xl focus:ring-2 focus:ring-storiq-purple/50 focus:border-storiq-purple transition resize-none px-4 py-3 font-mono"
          />
          <p className="text-xs text-white/60 mt-2">
            Start each line with "Character 1:" or "Character 2:" followed by dialogue.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-4 mb-8">
            <div className="p-3 bg-red-500/10 rounded-full">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="text-red-400 text-center font-medium flex items-center gap-2 mt-2">
              <AlertCircle className="mr-2 h-5 w-5" /> {error}
            </div>
          </div>
        )}

        {/* Control buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePlay}
            disabled={disableControls || !script.trim() || !character1Voice || !character2Voice}
            className="px-8 py-3 bg-gradient-to-r from-storiq-purple to-storiq-purple/80 text-white font-semibold rounded-xl shadow-lg hover:from-storiq-purple/90 hover:to-storiq-purple/70 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
          >
            <Play className="h-5 w-5 mr-2" />
            {status === 'playing' ? 'Playing...' : 'Play Conversation'}
          </Button>

          <Button
            onClick={handleStop}
            disabled={status !== 'playing'}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            <Square className="h-5 w-5 mr-2" /> Stop
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TTSPlayer;