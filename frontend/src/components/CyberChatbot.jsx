import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import {
  Bot,
  X,
  Send,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Trash2,
  AlertTriangle,
  Wrench,
  Calendar,
  Activity,
  Radio,
  Cpu,
  ChevronRight,
  ExternalLink,
  Flame,
  ShieldAlert,
} from 'lucide-react';

// Web Audio API futuristic sound effects synthesizer (no external audio files needed!)
const playCyberSound = (type = 'click') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'open') {
      // Futuristic ascending chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'send') {
      // Cyber laser blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'receive') {
      // AI response pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    }
  } catch (e) {
    // Audio context not allowed or unsupported
  }
};

const PROTOCOLS = [
  { id: 'black_smoke', label: '⛽ Black Smoke Diagnostic', icon: Flame },
  { id: 'crdi_calibration', label: '🔧 CRDI Injector Calibration', icon: Wrench },
  { id: 'hard_start', label: '⚡ Hard Starting / Low Pressure', icon: AlertTriangle },
  { id: 'cost_estimate', label: '💰 Service Cost Estimator', icon: Cpu },
  { id: 'book_service', label: '📅 Instant Service Booking', icon: Calendar },
  { id: 'emergency_sos', label: '🚨 Emergency Roadside SOS', icon: ShieldAlert },
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-init-1',
    sender: 'bot',
    timestamp: '00:00:01',
    text: 'DIESEL NEURAL CORE v4.8 ONLINE. Greetings! I am Ganpati AI Assistant, New Shree Ganpati Diesel Service\'s intelligent cyber-mechanic. What symptom is your vehicle exhibiting today?',
    diagnosis: null,
    quickActions: [
      { text: 'Analyze Black Smoke', query: 'My engine is blowing black smoke and losing power' },
      { text: 'Check Injector Noise', query: 'I hear knocking and injector clicking sound' },
      { text: 'Service Cost Inquiry', query: 'How much does CRDI pump and injector overhaul cost?' },
    ],
  },
];

export const CyberChatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping]);

  // Hide initial greeting tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    setShowTooltip(false);
    if (nextState && soundEnabled) {
      playCyberSound('open');
    }
  };

  // Automated intelligent diesel diagnostics engine
  const processQuery = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. Black Smoke
    if (q.includes('black smoke') || q.includes('smoke') && (q.includes('black') || q.includes('dark'))) {
      return {
        text: 'Telemetry analysis indicates incomplete diesel combustion. Fuel injection exceeds available oxygen charge in cylinder.',
        diagnosis: {
          title: 'Combustion Fault: High Fuel-Air Ratio',
          severity: 'HIGH',
          severityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          causes: [
            'Worn injector nozzles leaking excess diesel (75% confidence)',
            'Turbocharger boost pressure drop or intercooler leak (60%)',
            'Clogged high-flow air filter or EGR valve stuck open (50%)',
          ],
          recommendation: 'Calibrate Common Rail injectors on our automated Bosch EPS 205 test bench and inspect nozzle spray atomization.',
          actions: [
            { label: 'Schedule Injector Scan', action: () => navigate('/book-service') },
            { label: 'Call Diesel Specialist', action: () => window.open('tel:+919876543210') },
          ],
        },
      };
    }

    // 2. White or Blue Smoke
    if (q.includes('white smoke') || q.includes('blue smoke')) {
      const isBlue = q.includes('blue');
      return {
        text: isBlue
          ? 'Blue smoke indicates engine oil burning in combustion chambers, often caused by turbocharger oil seals or valve guides.'
          : 'White smoke indicates unburned raw diesel mist or coolant entering cylinders due to retarded injection timing or cold cylinders.',
        diagnosis: {
          title: isBlue ? 'Lube Oil Ingestion / Turbo Leak' : 'Unburnt Diesel / Timing Retardation',
          severity: 'CRITICAL',
          severityColor: 'text-red-400 bg-red-500/10 border-red-500/30',
          causes: isBlue
            ? ['Turbocharger shaft seal leakage (80%)', 'Piston oil ring wear (55%)', 'Defective PCV crankcase breather (40%)']
            : ['Faulty CRDI injector timing or cold glow plug (70%)', 'Low cylinder compression pressure (60%)', 'Head gasket coolant seepage (40%)'],
          recommendation: 'Immediate engine shutdown and computerized fuel pump timing inspection recommended to avoid catalytic converter damage.',
          actions: [
            { label: 'Book Immediate Inspection', action: () => navigate('/book-service') },
            { label: 'Emergency Hotline', action: () => window.open('tel:+919876543210') },
          ],
        },
      };
    }

    // 3. Injector knocking / noise
    if (q.includes('knocking') || q.includes('injector') || q.includes('noise') || q.includes('sound') || q.includes('vibrat')) {
      return {
        text: 'Acoustic telemetry suggests hydraulic pressure spikes or sticking injector needles causing erratic pilot injection.',
        diagnosis: {
          title: 'Injector Needle Chattering / Rail Fluctuation',
          severity: 'MODERATE',
          severityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          causes: [
            'Micro-debris deposit in solenoid / piezo valve (85%)',
            'Pressure sensor calibration drift (55%)',
            'Fuel pump delivery valve cavitation (45%)',
          ],
          recommendation: 'Ultrasonic nozzle chemical bath cleaning followed by multi-point digital calibration.',
          actions: [
            { label: 'Book Injector Calibration', action: () => navigate('/book-service') },
            { label: 'Explore Products & Parts', action: () => navigate('/products') },
          ],
        },
      };
    }

    // 4. Hard Starting / Cranking
    if (q.includes('start') || q.includes('crank') || q.includes('stall') || q.includes('pressure')) {
      return {
        text: 'Rail pressure insufficient during starter cranking. Common Rail systems mandate a minimum of 250-300 Bar rail pressure before ECU triggers injection.',
        diagnosis: {
          title: 'Low Cranking Fuel Rail Pressure',
          severity: 'HIGH',
          severityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          causes: [
            'Excessive injector back-leakage returning fuel to tank (75%)',
            'High-pressure pump metering unit (IMV/SCV) sluggish (65%)',
            'Choked primary diesel fuel filter (55%)',
          ],
          recommendation: 'Perform injector back-leak bottle test and test SCV valve duty cycle.',
          actions: [
            { label: 'Book Pressure Diagnostic', action: () => navigate('/book-service') },
          ],
        },
      };
    }

    // 5. Cost / Pricing / Quote
    if (q.includes('cost') || q.includes('price') || q.includes('quote') || q.includes('how much') || q.includes('rate')) {
      return {
        text: 'Here is our standard transparent service and calibration fee matrix:',
        diagnosis: {
          title: 'New Shree Ganpati Pricing Matrix',
          severity: 'ESTIMATE',
          severityColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          causes: [
            'CRDI Injector Testing & Digital Calibration: ₹400 - ₹800 / piece',
            'Injector Complete Rebuilding & Nozzle Overhaul: ₹1,500 - ₹3,500 / piece',
            'High Pressure CRDI Pump Complete Servicing: ₹3,500 - ₹8,500',
            'Electronic Turbocharger Testing & Core Replacement: ₹4,000 - ₹12,000',
          ],
          recommendation: 'Final quotation provided after computerized bench diagnostic scan.',
          actions: [
            { label: 'Book Service with Free Estimate', action: () => navigate('/book-service') },
            { label: 'Inquire on WhatsApp', action: () => window.open('https://wa.me/919876543210') },
          ],
        },
      };
    }

    // 6. Emergency / Breakdown / Contact
    if (q.includes('emergency') || q.includes('breakdown') || q.includes('phone') || q.includes('contact') || q.includes('location') || q.includes('where')) {
      return {
        text: 'Emergency roadside technical assistance and direct workshop dispatch details:',
        diagnosis: {
          title: 'Workshop Dispatch Telemetry',
          severity: '24/7 SUPPORT',
          severityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          causes: [
            '📍 Workshop: New Shree Ganpati Diesel Service, Industrial Area',
            '⏰ Operational Hours: Mon - Sat 9:00 AM - 8:30 PM (Emergency on-call)',
            '📞 Mobile Dispatch: +91 98765 43210',
            '✉️ Direct Support: support@ganpatidiesel.com',
          ],
          recommendation: 'Call directly for immediate towing or on-site pump technician dispatch.',
          actions: [
            { label: 'Call Dispatch Desk', action: () => window.open('tel:+919876543210') },
            { label: 'Open Google Map', action: () => navigate('/contact') },
          ],
        },
      };
    }

    // 7. General diesel query / Default response
    return {
      text: `Telemetry analysis for query: "${userQuery}". Our EPS-205 computerized diagnostic bench can identify microscopic wear in pumps, nozzles, and rail sensors with 99.4% precision. Would you like to schedule an inspection or speak with a senior technician?`,
      diagnosis: {
        title: 'Diagnostic Protocol Active',
        severity: 'TELEMETRY READY',
        severityColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        causes: [
          'Vehicles Serviced: Scorpio, Innova, Swift, Bolero, Fortuner, Trucks, JCB, Generators',
          'Supported Systems: Bosch, Delphi, Denso, Continental VDO CRDI',
        ],
        recommendation: 'Select a quick protocol below or schedule an inspection at the workshop.',
        actions: [
          { label: 'Book Diagnostic Scan', action: () => navigate('/book-service') },
          { label: 'Explore Our Services', action: () => navigate('/services') },
        ],
      },
    };
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    if (soundEnabled) playCyberSound('send');

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await api.post('/chatbot/message', {
        message: query.trim(),
        history: messages.slice(-4).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        })),
      });

      const data = res.data?.data || res.data;
      const reply = data?.reply || data?.text;

      if (reply) {
        const localDiag = processQuery(query).diagnosis;
        const botMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: reply,
          diagnosis: localDiag,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('No reply from Gemini API');
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local diagnostic engine:', err);
      const fallbackResponse = processQuery(query);
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: fallbackResponse.text,
        diagnosis: fallbackResponse.diagnosis,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
      if (soundEnabled) playCyberSound('receive');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-clear-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: 'DIESEL NEURAL CORE RESET. Telemetry memory cleared. Ready for new diagnostic input.',
        diagnosis: null,
      },
    ]);
  };

  return (
    <>
      {/* Floating Holographic Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 select-none">
        {/* Futuristic Hover / Auto Tooltip */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0e0d1a]/95 border border-cyan-500/40 text-white rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl max-w-xs hidden sm:block relative cursor-pointer"
              onClick={toggleOpen}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                  AI TELEMETRY ONLINE
                </span>
              </div>
              <p className="text-xs text-gray-200 font-medium">
                Engine trouble or smoke issues? Click to consult <span className="text-primary font-bold">Ganpati AI Assistant</span>!
              </p>
              {/* Arrow */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0e0d1a] border-r border-b border-cyan-500/40 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cyber Hologram Orb Trigger */}
        <div className="relative group">
          {/* Pulsing Outer Energy Rings */}
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-primary to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 animate-pulse transition duration-500"></div>

          {/* Rotating Cyber Ring */}
          <div className="absolute -inset-1 border border-cyan-400/40 rounded-full animate-spin-slow pointer-events-none"></div>

          <button
            onClick={toggleOpen}
            aria-label="Toggle Ganpati AI Assistant"
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0a0914] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
          >
            {/* Hologram scanline effect inside button */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6 text-cyan-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="bot-icon"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center px-1"
                >
                  <Bot className="w-6 h-6 text-cyan-400 group-hover:text-primary transition-colors" />
                  <span className="text-[7.5px] font-mono font-black text-cyan-300 tracking-tight uppercase leading-none mt-0.5">
                    GANPATI AI
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Futuristic Holographic Chat Window (Cyber-HUD) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 flex flex-col bg-[#090813]/95 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden transition-all duration-300 max-h-[calc(100dvh-6.5rem)] ${
              isWide
                ? 'w-[calc(100vw-1.5rem)] sm:w-[660px] h-[min(580px,calc(100dvh-7rem))]'
                : 'w-[calc(100vw-1.5rem)] sm:w-[410px] h-[min(510px,calc(100dvh-6.5rem))]'
            }`}
          >
            {/* Animated Cyber Grid / Scanline Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse pointer-events-none"></div>

            {/* Sci-Fi HUD Header */}
            <div className="relative z-10 px-4 py-3 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-black flex items-center justify-between">
              {/* Left: AI Reactor Core & Status */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black animate-ping"></span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-1.5 font-mono">
                      GANPATI <span className="text-cyan-400">AI</span>
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      ASSISTANT
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-emerald-400" /> ONLINE
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-cyan-400/80">LATENCY: 12ms</span>
                  </div>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-1">
                {/* Audio FX Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Wide Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setIsWide(!isWide)}
                  title={isWide ? 'Compact Mode' : 'Widescreen Command Mode'}
                  className="hidden sm:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isWide ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Clear Log */}
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear Telemetry Log"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={toggleOpen}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Diagnostic Protocol Strip */}
            <div className="relative z-10 px-4 py-2 bg-black/40 border-b border-cyan-500/10 overflow-x-auto no-scrollbar flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/70 font-bold whitespace-nowrap flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> PROTOCOLS:
              </span>
              {PROTOCOLS.map((proto) => {
                const IconComponent = proto.icon;
                return (
                  <button
                    key={proto.id}
                    onClick={() => handleSendMessage(proto.label.replace(/^[^\w]+/, '').trim())}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/40 whitespace-nowrap transition-all cursor-pointer"
                  >
                    <IconComponent className="w-3 h-3 text-primary" />
                    <span>{proto.label.replace(/^[^\w]+/, '').trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat Stream Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative z-10">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Metadata */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 mb-1 px-1">
                    {msg.sender === 'bot' ? (
                      <>
                        <span className="text-cyan-400 font-bold">GANPATI AI</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <span>YOU</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-primary/90 to-amber-500 text-black font-semibold rounded-br-xs shadow-primary/10'
                        : 'bg-[#121124]/90 text-gray-200 border border-cyan-500/30 rounded-bl-xs shadow-cyan-950/50'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Rich Diagnostic Card for Bot Responses */}
                    {msg.diagnosis && (
                      <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-2.5 bg-black/40 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white text-xs flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            {msg.diagnosis.title}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border ${msg.diagnosis.severityColor}`}
                          >
                            {msg.diagnosis.severity}
                          </span>
                        </div>

                        {/* Causes List */}
                        {msg.diagnosis.causes && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                              Telemetry Findings:
                            </div>
                            {msg.diagnosis.causes.map((cause, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-1.5 text-xs text-gray-300"
                              >
                                <ChevronRight className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <span>{cause}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Recommendation */}
                        {msg.diagnosis.recommendation && (
                          <div className="text-xs bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-2 text-cyan-200">
                            <span className="font-bold text-cyan-400 font-mono text-[10px] block uppercase">
                              Recommendation:
                            </span>
                            {msg.diagnosis.recommendation}
                          </div>
                        )}

                        {/* Interactive Buttons inside Card */}
                        {msg.diagnosis.actions && (
                          <div className="pt-1 flex flex-wrap gap-2">
                            {msg.diagnosis.actions.map((act, idx) => (
                              <button
                                key={idx}
                                onClick={act.action}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-black shadow-md transition-all cursor-pointer"
                              >
                                <span>{act.label}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Follow-up Action Chips */}
                    {msg.quickActions && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                        {msg.quickActions.map((qa, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(qa.query)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
                          >
                            {qa.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* AI Processing / Audio Wave Animation */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-cyan-400 text-xs font-mono bg-cyan-950/30 border border-cyan-500/20 px-3 py-2 rounded-xl w-fit"
                >
                  <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>ANALYZING DIESEL TELEMETRY</span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-cyan-400 animate-pulse"></span>
                    <span className="w-1 h-4 bg-cyan-400 animate-pulse delay-75"></span>
                    <span className="w-1 h-2 bg-cyan-400 animate-pulse delay-150"></span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Futuristic Command Prompt Input Area */}
            <div className="relative z-10 p-3 bg-gradient-to-t from-black via-[#0b0a17] to-transparent border-t border-cyan-500/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-white/5 border border-cyan-500/30 rounded-2xl p-1.5 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all"
              >
                <div className="pl-3 text-cyan-400 font-mono text-sm font-bold pointer-events-none">
                  &gt;
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Ganpati AI about smoke, injectors, pricing, or booking..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none px-2 py-1.5"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-primary text-black flex items-center justify-center font-bold shadow-md hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer"
                  title="Send Command"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </form>

              {/* Bottom Telemetry Footer */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mt-2 px-1">
                <span>NEW SHREE GANPATI DIESEL • AI ASSISTANT</span>
                <span>BOSCH • DELPHI • DENSO COMPLIANT</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
