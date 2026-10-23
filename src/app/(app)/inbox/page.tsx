'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Search,
  Send,
  Image as ImageIcon,
  Check,
  CheckCheck,
  ArrowLeft,
  Sparkles,
  User,
  Loader2,
  Clock,
  Briefcase,
  FileText,
  ExternalLink,
  Download,
} from 'lucide-react';
import { chatService, ChatMessage, Conversation } from '../../../services/chatService';
import { authService } from '../../../services/authService';

export default function InboxPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [activePartner, setActivePartner] = useState<any>(null);
  const [inputText, setInputText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    if (!authService.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }
    const uid = authService.getUserId();
    const profile = await authService.getCurrentUser();
    setCurrentUser(profile || { uid });
    loadChats();
  };

  const loadChats = async () => {
    setLoading(true);
    try {
      const data = await chatService.getChats(0, 100);
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const myUid = currentUser?.uid || currentUser?.id || '';

  // Group messages into conversations (matching mobile ChatController logic)
  const conversationMap = new Map<string, {
    partnerId: string;
    partnerName: string;
    partnerPhoto?: string;
    isSubscribed?: boolean;
    lastMessage: string;
    lastTimestamp: number | string;
    unreadCount: number;
    iHaveReplied: boolean;
  }>();

  const getMessageSnippet = (msg: ChatMessage) => {
    if (msg.image && !msg.messageText) return '📷 Sent an image';
    const text = msg.messageText || '';
    if (text.startsWith('BUYER_REQUEST::')) {
      try {
        const parsed = JSON.parse(text.replace('BUYER_REQUEST::', ''));
        return `📋 Buyer Request: ${parsed.title || 'Request'}`;
      } catch {
        return '📋 Buyer Request';
      }
    }
    if (text.startsWith('JOB_CV::')) {
      try {
        const parsed = JSON.parse(text.replace('JOB_CV::', ''));
        return `📄 Job Application: ${parsed.name || 'CV'}`;
      } catch {
        return '📄 Job Application / CV';
      }
    }
    return text || (msg.image ? '📷 Sent an image' : '');
  };

  messages.forEach((msg) => {
    const partnerId = msg.senderUid === myUid ? msg.receiverUid : msg.senderUid;
    
    // In backend ChatEntity.getAllChats, the other person is attached as msg.user
    // Fall back to msg.receiver or msg.sender if msg.user is not set
    const partner = (msg as any).user || (msg.senderUid === myUid ? msg.receiver : msg.sender);
    
    // Also try to extract user name from embedded BUYER_REQUEST if partner object has no name
    let fallbackName = '';
    if (msg.messageText?.startsWith('BUYER_REQUEST::')) {
      try {
        const parsed = JSON.parse(msg.messageText.replace('BUYER_REQUEST::', ''));
        if (msg.senderUid !== myUid && parsed.user?.name) {
          fallbackName = parsed.user.name;
        } else if (msg.senderUid !== myUid && parsed.user?.username) {
          fallbackName = parsed.user.username;
        }
      } catch {}
    }

    const partnerName =
      partner?.name?.trim() ||
      partner?.username?.trim() ||
      fallbackName ||
      (msg.senderUid === myUid ? 'Boss Chat' : 'Business Boss');

    const partnerPhoto =
      partner?.photoUrl ||
      (() => {
        if (msg.messageText?.startsWith('BUYER_REQUEST::')) {
          try {
            const parsed = JSON.parse(msg.messageText.replace('BUYER_REQUEST::', ''));
            if (msg.senderUid !== myUid && parsed.user?.photoUrl) {
              return parsed.user.photoUrl;
            }
          } catch {}
        }
        return undefined;
      })();

    const isSubscribed = Boolean(partner?.isSubscribed);

    const existing = conversationMap.get(partnerId);
    const msgTime = new Date(msg.timestamp).getTime();
    const snippet = getMessageSnippet(msg);

    if (!existing) {
      conversationMap.set(partnerId, {
        partnerId,
        partnerName,
        partnerPhoto,
        isSubscribed,
        lastMessage: snippet,
        lastTimestamp: msg.timestamp,
        unreadCount: !msg.seen && msg.receiverUid === myUid ? 1 : 0,
        iHaveReplied: msg.senderUid === myUid,
      });
    } else {
      // If the existing conversation entry has a fallback/generic name, update it with better info
      if (
        (existing.partnerName === 'Business Boss' || existing.partnerName === 'Boss Chat' || existing.partnerName === 'User' || existing.partnerName === 'Chat') &&
        partnerName !== 'Business Boss' &&
        partnerName !== 'Boss Chat'
      ) {
        existing.partnerName = partnerName;
      }
      if (!existing.partnerPhoto && partnerPhoto) {
        existing.partnerPhoto = partnerPhoto;
      }
      if (isSubscribed) {
        existing.isSubscribed = true;
      }

      if (msg.senderUid === myUid) {
        existing.iHaveReplied = true;
      }
      if (!msg.seen && msg.receiverUid === myUid) {
        existing.unreadCount += 1;
      }
      const existingTime = new Date(existing.lastTimestamp).getTime();
      if (msgTime > existingTime) {
        existing.lastMessage = snippet;
        existing.lastTimestamp = msg.timestamp;
      }
    }
  });

  const allConversations = Array.from(conversationMap.values()).sort(
    (a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
  );

  // Active Chats: Conversations where I have replied or started
  // Requests: Incoming messages where I have NOT replied yet (exact mobile parity)
  const activeChats = allConversations.filter((c) => c.iHaveReplied);
  const requestChats = allConversations.filter((c) => !c.iHaveReplied);

  const displayedConversations = (activeTab === 'chats' ? activeChats : requestChats).filter(
    (c) => c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Messages in currently open chat thread
  const currentThread = messages
    .filter(
      (m) =>
        (m.senderUid === myUid && m.receiverUid === activePartnerId) ||
        (m.senderUid === activePartnerId && m.receiverUid === myUid)
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentThread]);

  const handleSelectConversation = (conv: any) => {
    setActivePartnerId(conv.partnerId);
    setActivePartner(conv);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId || sending) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    const tempMessage: ChatMessage = {
      messageId: `temp-${Date.now()}`,
      senderUid: myUid,
      receiverUid: activePartnerId,
      messageText: text,
      timestamp: Date.now(),
      seen: false,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      await chatService.sendMessage(activePartnerId, text);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderMessageBubbleContent = (msg: ChatMessage, isMine: boolean) => {
    const text = msg.messageText || '';

    // 1. BUYER_REQUEST:: message card (Parity with Flutter mobile _buildBuyerRequestCard)
    if (text.startsWith('BUYER_REQUEST::')) {
      try {
        const rawJson = text.replace('BUYER_REQUEST::', '');
        const reqData = JSON.parse(rawJson);

        return (
          <div className="bg-white text-slate-800 rounded-xl p-3 border border-red-200 shadow-xs max-w-sm my-1 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F21C29] mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Buyer Request</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
              {reqData.title}
            </h4>
            {(reqData.budget_start != null || reqData.budget != null) && (
              <p className="text-[11px] font-semibold text-slate-600 mt-1">
                Budget: {reqData.currency || '$'}{reqData.budget_start != null ? reqData.budget_start : reqData.budget}{reqData.budget_end ? ` - ${reqData.currency || '$'}${reqData.budget_end}` : ''} • {reqData.category || 'General'}
              </p>
            )}
            {reqData.description && (
              <p className="text-[11px] text-slate-500 line-clamp-3 mt-1 whitespace-pre-wrap">
                {reqData.description}
              </p>
            )}
          </div>
        );
      } catch (e) {
        // Fallback
      }
    }

    // 2. JOB_CV:: attachment card (Parity with Flutter mobile _buildCvCard)
    if (text.startsWith('JOB_CV::')) {
      try {
        const rawJson = text.replace('JOB_CV::', '');
        const cvData = JSON.parse(rawJson);
        const name = cvData.name || 'CV';
        const url = cvData.url;

        return (
          <div className="bg-white text-slate-800 rounded-xl p-3 border border-red-200 shadow-xs max-w-xs my-1 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#F21C29] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#F21C29] block">
                  CV attached
                </span>
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {name}
                </span>
              </div>
            </div>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                title="Download / View CV"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        );
      } catch (e) {
        // Fallback
      }
    }

    // Regular message
    return <p>{text}</p>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 h-[calc(100vh-5rem)]">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex h-full">
        {/* Left Panel: Conversation List (Hidden on mobile when chat is active) */}
        <div
          className={`w-full md:w-96 border-r border-slate-100 flex flex-col shrink-0 ${
            activePartnerId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Inbox Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#F21C29]" />
                <span>Inbox</span>
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm outline-none focus:border-red-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Active Chats vs Requests Tabs (Mobile Parity) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'chats'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Chats ({activeChats.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'requests'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Requests ({requestChats.length})
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#F21C29]" />
                <p className="text-xs font-semibold">Loading messages...</p>
              </div>
            ) : displayedConversations.length === 0 ? (
              <div className="py-16 text-center text-slate-400 px-6">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#F21C29]" />
                <p className="text-sm font-bold text-slate-700">No conversations yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  {activeTab === 'chats'
                    ? 'Your direct messages and active discussions will appear here.'
                    : 'Incoming messages from new users will show up as requests.'}
                </p>
              </div>
            ) : (
              displayedConversations.map((conv) => {
                const isSelected = conv.partnerId === activePartnerId;
                return (
                  <div
                    key={conv.partnerId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-red-50/60 border-l-4 border-l-[#F21C29]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {conv.partnerPhoto ? (
                        <img
                          src={conv.partnerPhoto}
                          alt={conv.partnerName}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
                          {conv.partnerName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {conv.isSubscribed && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">
                          {conv.partnerName}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {formatTimestamp(conv.lastTimestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#F21C29] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Active Chat Thread */}
        <div
          className={`flex-1 flex flex-col bg-slate-50/40 ${
            activePartnerId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activePartnerId && activePartner ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActivePartnerId(null)}
                    className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    {activePartner.partnerPhoto ? (
                      <img
                        src={activePartner.partnerPhoto}
                        alt={activePartner.partnerName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                        {activePartner.partnerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                      {activePartner.partnerName}
                    </h3>
                    <p className="text-[11px] text-slate-400">Direct Chat</p>
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {currentThread.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <p className="text-xs">Say hello to start the conversation!</p>
                  </div>
                ) : (
                  currentThread.map((msg, i) => {
                    const isMine = msg.senderUid === myUid;
                    return (
                      <div
                        key={msg.messageId || i}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] sm:max-w-[65%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isMine
                              ? 'bg-[#F21C29] text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                          }`}
                        >
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Attachment"
                              className="rounded-xl mb-2 max-h-60 w-full object-cover"
                            />
                          )}
                          {renderMessageBubbleContent(msg, isMine)}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                              isMine ? 'text-white/70' : 'text-slate-400'
                            }`}
                          >
                            <span>{formatTimestamp(msg.timestamp)}</span>
                            {isMine &&
                              (msg.seen ? (
                                <CheckCheck className="w-3 h-3 text-white" />
                              ) : (
                                <Check className="w-3 h-3 text-white/70" />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm outline-none focus:border-red-400 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="w-10 h-10 rounded-xl bg-[#F21C29] hover:bg-[#D01420] disabled:bg-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-1">Select a Conversation</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Choose an active chat or message request from the left panel to read and send messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
