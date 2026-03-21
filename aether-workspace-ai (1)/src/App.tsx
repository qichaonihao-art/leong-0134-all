/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MessageSquare, 
  Settings, 
  Upload, 
  Play, 
  Plus, 
  Send, 
  ChevronRight, 
  LogOut,
  Cpu,
  Sparkles,
  ArrowLeft,
  Zap,
  Layers,
  Activity
} from 'lucide-react';

type View = 'LOGIN' | 'HOME' | 'VOICE' | 'CHAT';

export default function App() {
  const [view, setView] = useState<View>('LOGIN');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, image?: string}[]>([
    { role: 'ai', content: '你好！我是豆包助手，有什么我可以帮你的吗？' }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setView('HOME');
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { role: 'user', content: inputText }]);
    setInputText('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: '收到！正在为您处理多模态请求，请稍等片刻...' }]);
    }, 600);
  };

  // --- Views ---

  const LoginView = () => (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0F172A]">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[120px] rounded-full" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-4 z-10"
      >
        <div className="soft-card p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 soft-btn flex items-center justify-center mb-6">
              <Cpu className="text-violet-400 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gradient">KELONG AI</h1>
            <p className="text-white/40 mt-2 font-medium">下一代智能创作工作台</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">访问授权码</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入您的密码"
                className="w-full soft-inset p-4 text-white outline-none"
              />
            </div>
            <button type="submit" className="w-full soft-btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-3 text-lg">
              开启创作之旅 <ChevronRight size={20} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );

  const HomeView = () => (
    <div className="min-h-screen p-8 md:p-20 max-w-7xl mx-auto relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight">
            你好，<span className="text-gradient">创作者</span>
          </h1>
          <p className="text-white/40 mt-4 text-lg max-w-xl">
            欢迎回到您的 AI 创意中心。
          </p>
        </div>
        <button onClick={() => setView('LOGIN')} className="soft-btn flex items-center gap-3 p-4 px-6">
          <LogOut size={18} className="text-red-400" />
          <span className="font-semibold text-white/60">退出登录</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div 
          whileHover={{ y: -10 }}
          onClick={() => setView('VOICE')}
          className="soft-card p-10 group cursor-pointer relative overflow-hidden"
        >
          <div className="w-16 h-16 soft-btn flex items-center justify-center mb-8">
            <Mic className="text-violet-400" size={32} />
          </div>
          <h3 className="text-3xl font-bold mb-4">声音克隆</h3>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            上传一段音频，让 AI 学习您的独特音色。
          </p>
          <div className="inline-flex items-center px-6 py-3 rounded-xl bg-violet-500/10 text-violet-400 font-bold gap-2 group-hover:bg-violet-500 group-hover:text-white transition-all">
            立即开始 <Zap size={18} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10 }}
          onClick={() => setView('CHAT')}
          className="soft-card p-10 group cursor-pointer relative overflow-hidden"
        >
          <div className="w-16 h-16 soft-btn flex items-center justify-center mb-8">
            <MessageSquare className="text-cyan-400" size={32} />
          </div>
          <h3 className="text-3xl font-bold mb-4">豆包助手</h3>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            全能型多模态助手，支持文本与图片交互。
          </p>
          <div className="inline-flex items-center px-6 py-3 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold gap-2 group-hover:bg-cyan-500 group-hover:text-white transition-all">
            开启对话 <Sparkles size={18} />
          </div>
        </motion.div>
      </div>
    </div>
  );

  const VoiceView = () => (
    <div className="min-h-screen flex flex-col">
      <nav className="h-20 flex items-center justify-between px-8 glass-panel rounded-none z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('HOME')} className="soft-btn w-10 h-10 flex items-center justify-center">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-black flex items-center gap-3">声音克隆工作台</h2>
        </div>
        <button className="soft-btn p-3"><Settings size={22} /></button>
      </nav>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 p-8 max-w-[1600px] w-full mx-auto">
        <aside className="space-y-8">
          <section className="soft-card p-6 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">核心配置</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40">克隆模型</label>
                <select className="w-full soft-inset p-3 text-sm outline-none text-white bg-transparent">
                  <option className="bg-[#0F172A]">Kelong-HD-v2.5</option>
                  <option className="bg-[#0F172A]">Fast-Clone-v1</option>
                </select>
              </div>
            </div>
          </section>

          <section className="soft-card p-6 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">训练参数</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-3">
                  <span>相似度</span>
                  <span className="text-violet-400">92%</span>
                </div>
                <div className="soft-inset h-3 p-1">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </section>
        </aside>

        <div className="space-y-8">
          <div className="soft-card p-12 flex flex-col items-center justify-center min-h-[450px] border-dashed border-white/10">
            <div className="w-24 h-24 soft-btn flex items-center justify-center mb-8">
              <Upload className="text-violet-400" size={40} />
            </div>
            <h3 className="text-3xl font-black mb-4">上传样本</h3>
            <p className="text-white/40 text-center max-w-lg mb-10">支持 WAV, MP3 格式。建议时长 15-60s。</p>
            <button className="soft-btn-primary px-12 py-4 rounded-2xl font-bold">浏览文件</button>
          </div>
        </div>
      </main>
    </div>
  );

  const ChatView = () => (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <nav className="h-20 flex items-center justify-between px-8 glass-panel rounded-none z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('HOME')} className="soft-btn w-10 h-10 flex items-center justify-center">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-black flex items-center gap-3">豆包助手</h2>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 max-w-5xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 soft-btn flex items-center justify-center ${msg.role === 'user' ? 'bg-violet-500 text-white' : 'text-white/60'}`}>
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>
              <div className={`p-5 rounded-3xl text-lg leading-relaxed ${
                msg.role === 'user' 
                  ? 'soft-card-accent text-white' 
                  : 'soft-card text-white/90'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="soft-card p-3 flex items-end gap-3">
            <button className="w-12 h-12 soft-btn flex items-center justify-center text-white/40">
              <Plus size={24} />
            </button>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="问问我任何问题..."
              className="flex-1 bg-transparent border-none outline-none p-3 text-lg text-white placeholder:text-white/20 resize-none max-h-60 min-h-[56px]"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                inputText.trim() 
                  ? 'soft-btn-primary scale-105' 
                  : 'bg-white/5 text-white/20'
              }`}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0F172A] text-white min-h-screen selection:bg-violet-500/40">
      <AnimatePresence mode="wait">
        {view === 'LOGIN' && (
          <motion.div 
            key="login" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }} 
            transition={{ duration: 0.6 }}
          >
            <LoginView />
          </motion.div>
        )}
        {view === 'HOME' && (
          <motion.div 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <HomeView />
          </motion.div>
        )}
        {view === 'VOICE' && (
          <motion.div 
            key="voice" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            <VoiceView />
          </motion.div>
        )}
        {view === 'CHAT' && (
          <motion.div 
            key="chat" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            <ChatView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
