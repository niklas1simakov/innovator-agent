import { useConversation } from '@elevenlabs/react';
import { useState, useEffect } from 'react';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import type { Analysis } from '@/types/analysis';

// Helper function to format analysis data for the AI agent
function formatAnalysisContext(analysis: Analysis | null): string {
  if (!analysis) {
    return "No analysis data is currently available. The user hasn't run any research analysis yet.";
  }

  const { input, result } = analysis;
  
  let context = `# Current Research Analysis\n\n`;
  context += `**Research Topic:** ${input.title}\n`;
  context += `**Research Abstract:** ${input.abstract}\n\n`;

  // Overall Analysis
  context += `## Overall Analysis\n`;
  context += `**Novelty Percentage:** ${result.noveltyPercent}%\n`;
  context += `**Maximum Similarity Found:** ${result.maxSimilarity}%\n\n`;

  // Publications
  if (result.publications?.length > 0) {
    context += `## Publications Found (${result.publications.length} total)\n`;
    result.publications.slice(0, 3).forEach((pub: any, idx: number) => {
      context += `${idx + 1}. **${pub.title}** (${pub.year}) - ${pub.similarity}% similar\n`;
      context += `   - Authors: ${pub.authorsOrAssignee?.join(', ')}\n`;
      if (pub.similarities?.length > 0) {
        context += `   - Similarities: ${pub.similarities.join('; ')}\n`;
      }
      if (pub.differences?.length > 0) {
        context += `   - Key differences: ${pub.differences.join('; ')}\n`;
      }
      context += `\n`;
    });
  }

  // Patents
  if (result.patents?.length > 0) {
    context += `## Patents Found (${result.patents.length} total)\n`;
    result.patents.slice(0, 3).forEach((patent: any, idx: number) => {
      context += `${idx + 1}. **${patent.title}** (${patent.year}) - ${patent.similarity}% similar\n`;
      context += `   - Inventors: ${patent.authorsOrAssignee?.join(', ')}\n`;
      if (patent.similarities?.length > 0) {
        context += `   - Similarities: ${patent.similarities.join('; ')}\n`;
      }
      if (patent.differences?.length > 0) {
        context += `   - Key differences: ${patent.differences.join('; ')}\n`;
      }
      if (patent.patentWarning) {
        context += `   - ⚠️ HIGH SIMILARITY WARNING (≥85%)\n`;
      }
      context += `\n`;
    });
  }

  // Top Authors
  if (result.topAuthors?.length > 0) {
    context += `## Top Authors in this Field\n`;
    result.topAuthors.slice(0, 5).forEach((author, idx) => {
      context += `${idx + 1}. ${author.name} (score: ${author.score})\n`;
    });
    context += `\n`;
  }

  // Timeline
  if (result.timeline?.length > 0) {
    context += `## Research Timeline\n`;
    result.timeline.slice(-5).forEach((entry) => {
      context += `${entry.year}: ${entry.count} items`;
      if (entry.byType) {
        context += ` (${entry.byType.publication} publications, ${entry.byType.patent} patents)`;
      }
      context += `\n`;
    });
    context += `\n`;
  }

  context += `## Instructions for Assistant\n`;
  context += `You are a research assistant helping analyze this research data. `;
  context += `Answer questions about the publications, patents, similarities, differences, novelty analysis, top authors, and timeline. `;
  context += `Be conversational and helpful. Reference specific data points when relevant. `;
  context += `Pay special attention to high-similarity items and patent warnings.`;

  return context;
}

export function VoiceChat() {
  const conversation = useConversation();
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [conversationStatus, setConversationStatus] = useState<string>('Not connected');
  const { activeAnalysis, activeAnalysisId, analyses } = useAnalysisHistory();

  // Debug logging for activeAnalysis
  useEffect(() => {
    console.log('🔍 VoiceChat - activeAnalysis changed:', {
      exists: !!activeAnalysis,
      title: activeAnalysis?.input?.title,
      id: activeAnalysis?.input?.id,
      createdAt: activeAnalysis?.input?.createdAt,
      hasPublications: !!activeAnalysis?.result?.publications?.length,
      hasPatents: !!activeAnalysis?.result?.patents?.length,
      noveltyPercent: activeAnalysis?.result?.noveltyPercent
    });
  }, [activeAnalysis]);

  // Also log the useAnalysisHistory hook data
  useEffect(() => {
    console.log('🔍 VoiceChat - useAnalysisHistory data:', {
      activeAnalysisId,
      analysesCount: analyses.length,
      analysisIds: analyses.map(a => a.input.id),
      analysisFound: !!analyses.find(a => a.input.id === activeAnalysisId)
    });
  }, [activeAnalysisId, analyses]);

  // Monitor conversation status changes
  useEffect(() => {
    console.log('Conversation status changed to:', conversation.status);
    if (conversation.status) {
      setConversationStatus(conversation.status);
    }
  }, [conversation.status]);

  const requestMicrophoneAccess = async () => {
    try {
      // Explain to user why microphone access is needed
      console.log('Requesting microphone access for voice conversation...');
      
      // Call after explaining to the user why the microphone access is needed
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setMicrophonePermission('granted');
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      setMicrophonePermission('denied');
      return false;
    }
  };

  const handleStartConversation = async () => {
    // Request microphone access before starting conversation
    const hasAccess = await requestMicrophoneAccess();
    
    if (hasAccess) {
      try {
        // Debug: Log the raw activeAnalysis object
        console.log('🔍 Raw activeAnalysis object:', activeAnalysis);
        console.log('🔍 ActiveAnalysis type:', typeof activeAnalysis);
        console.log('🔍 ActiveAnalysis is null:', activeAnalysis === null);
        console.log('🔍 ActiveAnalysis is undefined:', activeAnalysis === undefined);
        
        // Prepare analysis context for the AI agent
        const analysisContext = formatAnalysisContext(activeAnalysis);
        console.log('🧪 Analysis context prepared:', analysisContext.substring(0, 200) + '...');
        console.log('🧪 Full analysis context length:', analysisContext.length, 'characters');
        console.log('🧪 FULL ANALYSIS CONTEXT:');
        console.log(analysisContext);
        
        // Client - Get signed URL from backend with analysis context
        console.log('📡 Fetching signed URL from backend...');
        const requestBody = activeAnalysis ? { context: analysisContext } : {};
        console.log('📡 Request body:', activeAnalysis ? 'Contains context' : 'No context');
        console.log('📡 ActiveAnalysis exists:', !!activeAnalysis);
        
        if (activeAnalysis) {
          console.log('📊 ActiveAnalysis details:', {
            title: activeAnalysis.input.title,
            publicationsCount: activeAnalysis.result.publications?.length || 0,
            patentsCount: activeAnalysis.result.patents?.length || 0,
            noveltyPercent: activeAnalysis.result.noveltyPercent
          });
        }
        
        const response = await fetch("http://localhost:8000/signed-url", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Backend error:', errorText);
          throw new Error(`Failed to get signed URL: ${response.status} ${errorText}`);
        }
        
        const responseData = await response.json();
        const signedUrl = responseData.signed_url;
        console.log('Received signed URL:', signedUrl.substring(0, 50) + '...');
        
        if (activeAnalysis) {
          console.log('Analysis context sent to voice agent successfully');
        } else {
          console.log('No analysis context available - voice agent will work without research data');
        }
        
        // Start session with signed URL and WebSocket connection
        console.log('Starting ElevenLabs session...');
        console.log('Using signedUrl:', signedUrl);
        
        setConversationStatus('Connecting...');
        
        let conversationResult;
        try {
          conversationResult = await conversation.startSession({
            signedUrl,
            connectionType: "websocket",
          });
          console.log('Conversation started successfully:', conversationResult);
          

        } catch (sessionError) {
          console.error('Session start error:', sessionError);
          setConversationStatus('Connection failed');
          throw sessionError;
        }
        console.log('Conversation status:', conversation.status);
        console.log('Is speaking:', conversation.isSpeaking);
        console.log('Full conversation object:', conversation);
        
        // Update status based on actual conversation state
        if (conversation.status === 'connected') {
          setConversationStatus('Connected - Ready to chat!');
        } else {
          setConversationStatus(conversation.status);
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
        alert('Failed to start conversation. Please try again.');
      }
    } else {
      alert('Microphone access is required for voice conversations');
    }
  };

  return (
    <div className="voice-chat">
      {/* Add your voice interaction UI here */}
      <div className="flex flex-col items-center gap-4">
        {microphonePermission === 'pending' && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 mb-2">
              🎙️ Voice conversations require microphone access to hear and respond to your questions.
            </p>
            <p className="text-sm text-blue-600">
              Your audio will be processed securely and used only for this conversation.
            </p>
          </div>
        )}
        
        {microphonePermission === 'denied' && (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800">
              ❌ Microphone access was denied. Please enable it in your browser settings to use voice chat.
            </p>
          </div>
        )}

        {/* Conversation Status */}
        <div className="text-center p-2 bg-gray-100 rounded border">
          <p className="text-sm font-medium">Status: {conversationStatus}</p>
          {conversation.isSpeaking && conversation.status === 'connected' && (
            <p className="text-green-600">🔊 Agent is speaking...</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleStartConversation}
            disabled={microphonePermission === 'denied'}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {microphonePermission === 'pending' ? 'Request Microphone & Start' : 'Start Conversation'}
          </button>
          <button 
            onClick={() => {
              conversation.endSession();
              setConversationStatus('Disconnected');
              // Force update the conversation status to ensure speaking state is cleared
              setTimeout(() => {
                if (conversation.status === 'disconnected') {
                  setConversationStatus('Disconnected - Ready to start again');
                }
              }, 100);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            End Conversation
          </button>
        </div>
      </div>
    </div>
  );
}