'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SafeImage from '../../../components/common/SafeImage';
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
  Phone,
  MoreVertical,
  X,
  Plus,
  ChevronRight,
  ShieldCheck,
  Tag,
  DollarSign,
  Calendar,
  Layers,
} from 'lucide-react';
import { chatService, ChatMessage, Conversation } from '../../../services/chatService';
import { authService } from '../../../services/authService';
import { postService } from '../../../services/postService';

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
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [selectedBuyerRequest, setSelectedBuyerRequest] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  // Helper snippet for preview in conversation tile
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

  // Group messages into conversations (matching mobile ChatController logic)
  const conversationMap = new Map<string, {
    partnerId: string;
    partnerName: string;
    partnerPhoto?: string;
    isSubscribed?: boolean;
    phone?: string;
    lastMessage: string;
    lastTimestamp: number | string;
    unreadCount: number;
    iHaveReplied: boolean;
  }>();

  messages.forEach((msg) => {
    const partnerId = msg.senderUid === myUid ? msg.receiverUid : msg.senderUid;
    const partner = (msg as any).user || (msg.senderUid === myUid ? msg.receiver : msg.sender);

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
    const phone = partner?.phone || partner?.phoneNumber;

    const existing = conversationMap.get(partnerId);
    const msgTime = new Date(msg.timestamp).getTime();
    const snippet = getMessageSnippet(msg);

    if (!existing) {
      conversationMap.set(partnerId, {
        partnerId,
        partnerName,
        partnerPhoto,
        isSubscribed,
        phone,
        lastMessage: snippet,
        lastTimestamp: msg.timestamp,
        unreadCount: !msg.seen && msg.receiverUid === myUid ? 1 : 0,
        iHaveReplied: msg.senderUid === myUid,
      });
    } else {
      if (
        (existing.partnerName === 'Business Boss' ||
          existing.partnerName === 'Boss Chat' ||
          existing.partnerName === 'User' ||
          existing.partnerName === 'Chat') &&
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
      if (phone) {
        existing.phone = phone;
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

  // Parity with mobile ChatScreen tabs:
  // "Chats" = threads where user has replied/conversed
  // "Requests" = threads initiated by others where user hasn't replied yet
  const activeChats = allConversations.filter((c) => c.iHaveReplied);
  const requestChats = allConversations.filter((c) => !c.iHaveReplied);

  const displayedConversations = (activeTab === 'chats' ? activeChats : requestChats).filter(
    (c) =>
      c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
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

    // Optimistically update conversation snippet & move to 'chats' if it was in 'requests'
    const targetConv = conversationMap.get(activePartnerId);
    if (targetConv) {
      targetConv.lastMessage = text;
      targetConv.lastTimestamp = Date.now();
      targetConv.iHaveReplied = true;
    }

    try {
      await chatService.sendMessage(activePartnerId, text);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePartnerId || uploadingImage) return;

    setUploadingImage(true);
    try {
      const uploadedUrl = await postService.uploadImage(file);
      if (uploadedUrl) {
        const tempMessage: ChatMessage = {
          messageId: `temp-img-${Date.now()}`,
          senderUid: myUid,
          receiverUid: activePartnerId,
          image: uploadedUrl,
          timestamp: Date.now(),
          seen: false,
        };
        setMessages((prev) => [...prev, tempMessage]);

        await chatService.sendMessage(activePartnerId, '', uploadedUrl);
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24 && date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffHours < 48) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderMessageBubbleContent = (msg: ChatMessage, isMine: boolean) => {
    const text = msg.messageText || '';

    // 1. BUYER_REQUEST:: card (Parity with Flutter mobile _buildBuyerRequestCard & details modal)
    if (text.startsWith('BUYER_REQUEST::')) {
      try {
        const rawJson = text.replace('BUYER_REQUEST::', '');
        const reqData = JSON.parse(rawJson);

        return (
          <div className="bg-white text-slate-800 rounded-2xl p-4 border border-slate-200/90 shadow-sm max-w-sm my-1 text-left">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F21C29]">
                <Briefcase className="w-4 h-4" />
                <span>Buyer Request Inquiry</span>
              </div>
              {reqData.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {reqData.category}
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
              {reqData.title}
            </h4>

            {(reqData.budget_start != null || reqData.budget != null) && (
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#F21C29] mt-2 bg-red-50/70 px-2.5 py-1.5 rounded-lg border border-red-100">
                <DollarSign className="w-3.5 h-3.5" />
                <span>
                  Budget: {reqData.currency || '$'}{reqData.budget_start != null ? reqData.budget_start : reqData.budget}
                  {reqData.budget_end ? ` - ${reqData.currency || '$'}${reqData.budget_end}` : ''}
                </span>
              </div>
            )}

            {reqData.description && (
              <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                {reqData.description}
              </p>
            )}

            <button
              type="button"
              onClick={() => setSelectedBuyerRequest(reqData)}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#F21C29] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>View Full Request Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
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
        const name = cvData.name || 'Job Applicant CV';
        const url = cvData.url;

        return (
          <div className="bg-white text-slate-800 rounded-2xl p-3.5 border border-slate-200/90 shadow-sm max-w-xs my-1 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center shrink-0 border border-red-100">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#F21C29] block">
                  Attached CV / Resume
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
                className="p-2 rounded-xl bg-slate-100 hover:bg-[#F21C29] hover:text-white text-slate-700 transition-all shrink-0"
                title="Download / View CV"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        );
      } catch (e) {
        // Fallback
      }
    }

    // Regular message
    return <p className="leading-relaxed whitespace-pre-wrap break-words">{text}</p>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4 h-[calc(100vh-6rem)]">
      {/* Hidden file input for image attachment */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden flex h-full">
        {/* ============================================================== */}
        {/* LEFT PANEL: Conversation List (Chats / Requests)               */}
        {/* ============================================================== */}
        <div
          className={`w-full md:w-96 border-r border-slate-100 flex flex-col shrink-0 bg-white ${
            activePartnerId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Tabs */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[#F21C29]" />
                  <span>Inbox</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct messages and business inquiries
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-[#F21C29]">
                {allConversations.length} total
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Segmented Chats vs Requests Toggle (Parity with Mobile Flutter App) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'chats'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Chats</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === 'chats' ? 'bg-red-50 text-[#F21C29]' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {activeChats.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'requests'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Requests</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === 'requests' ? 'bg-red-50 text-[#F21C29]' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {requestChats.length}
                </span>
              </button>
            </div>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#F21C29]" />
                <p className="text-xs font-semibold">Loading messages...</p>
              </div>
            ) : displayedConversations.length === 0 ? (
              <div className="py-20 text-center text-slate-400 px-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-700">No {activeTab} found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {activeTab === 'chats'
                    ? 'Your ongoing conversations with business partners and buyers will appear here.'
                    : 'Incoming messages from new inquiries will appear here until you reply.'}
                </p>
              </div>
            ) : (
              displayedConversations.map((conv) => {
                const isSelected = conv.partnerId === activePartnerId;
                return (
                  <div
                    key={conv.partnerId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`flex items-center gap-3.5 p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50/70 border-l-4 border-l-[#F21C29]'
                        : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Partner Avatar with Badge */}
                    <div className="relative shrink-0">
                      {conv.partnerPhoto ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200/90 relative">
                          <SafeImage
                            src={conv.partnerPhoto}
                            alt={conv.partnerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-600 flex items-center justify-center font-black text-sm border border-slate-200">
                          {conv.partnerName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Subscribed Gold Star */}
                      {conv.isSubscribed && (
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-2xs"
                          title="Verified Pro Member"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Partner Info & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`text-sm truncate ${
                            isSelected ? 'font-black text-slate-900' : 'font-bold text-slate-800'
                          }`}
                        >
                          {conv.partnerName}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">
                          {formatTimestamp(conv.lastTimestamp)}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate ${
                          conv.unreadCount > 0
                            ? 'font-bold text-slate-900'
                            : 'text-slate-500'
                        }`}
                      >
                        {conv.lastMessage || 'Sent an attachment'}
                      </p>
                    </div>

                    {/* Unread Pill */}
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#F21C29] text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: Active Chat Thread                                */}
        {/* ============================================================== */}
        <div
          className={`flex-1 flex flex-col bg-[#F8FAFC] ${
            activePartnerId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activePartnerId && activePartner ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-white flex items-center justify-between shadow-2xs z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setActivePartnerId(null)}
                    className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative shrink-0">
                    {activePartner.partnerPhoto ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 relative">
                        <SafeImage
                          src={activePartner.partnerPhoto}
                          alt={activePartner.partnerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm border border-slate-200">
                        {activePartner.partnerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {activePartner.isSubscribed && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border border-white flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                        {activePartner.partnerName}
                      </h3>
                      {activePartner.isSubscribed && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Active on Business Bosses</span>
                    </p>
                  </div>
                </div>

                {/* Header Action Tools */}
                <div className="flex items-center gap-1.5">
                  {activePartner.phone && (
                    <a
                      href={`tel:${activePartner.phone}`}
                      className="p-2 rounded-xl text-slate-600 hover:text-[#F21C29] hover:bg-red-50 transition-colors"
                      title={`Call ${activePartner.phone}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                  <Link
                    href={`/profile?id=${activePartner.partnerId}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Profile</span>
                  </Link>
                </div>
              </div>

              {/* Message History Container */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {currentThread.length === 0 ? (
                  <div className="py-24 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 mx-auto flex items-center justify-center mb-2 shadow-xs">
                      <MessageSquare className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">Start the conversation</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Send a message, schedule a consultation, or discuss inquiries below.
                    </p>
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
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs transition-all ${
                            isMine
                              ? 'bg-[#F21C29] text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                          }`}
                        >
                          {/* Attached Image */}
                          {msg.image && (
                            <div className="rounded-xl overflow-hidden mb-2 border border-black/5 bg-black/5">
                              <a
                                href={msg.image}
                                target="_blank"
                                rel="noreferrer"
                                className="block hover:opacity-95 transition-opacity"
                              >
                                <img
                                  src={msg.image}
                                  alt="Attachment"
                                  className="w-full max-h-72 object-cover rounded-xl"
                                />
                              </a>
                            </div>
                          )}

                          {/* Message Content / Formatted Card */}
                          {renderMessageBubbleContent(msg, isMine)}

                          {/* Meta: Timestamp + Delivery ticks */}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1.5 text-[9px] font-medium ${
                              isMine ? 'text-white/80' : 'text-slate-400'
                            }`}
                          >
                            <span>{formatTimestamp(msg.timestamp)}</span>
                            {isMine &&
                              (msg.seen ? (
                                <CheckCheck className="w-3 h-3 text-white" />
                              ) : (
                                <Check className="w-3 h-3 text-white/80" />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2"
              >
                {/* Image Attachment Trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-[#F21C29] hover:bg-red-50 transition-all border border-slate-200/80 disabled:opacity-50"
                  title="Attach an image"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#F21C29]" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="h-10 px-4 rounded-xl bg-[#F21C29] hover:bg-[#D01420] disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Empty State when no conversation selected */
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">
                Select a Conversation
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Choose an active chat or incoming message request from the left panel to begin communicating.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* BUYER REQUEST DETAIL MODAL (Matching mobile bottom sheet parity)*/}
      {/* ============================================================== */}
      {selectedBuyerRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Buyer Request Details
                  </h3>
                  <p className="text-[11px] text-slate-400">Original Inquiry Information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBuyerRequest(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Request Title
                </span>
                <h4 className="text-base font-black text-slate-900 leading-snug">
                  {selectedBuyerRequest.title}
                </h4>
              </div>

              {/* Budget & Category Pills */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#F21C29]" />
                    <span>Budget Range</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {selectedBuyerRequest.currency || '$'}
                    {selectedBuyerRequest.budget_start != null
                      ? selectedBuyerRequest.budget_start
                      : selectedBuyerRequest.budget || 'Open'}
                    {selectedBuyerRequest.budget_end
                      ? ` - ${selectedBuyerRequest.currency || '$'}${selectedBuyerRequest.budget_end}`
                      : ''}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                    <Tag className="w-3.5 h-3.5 text-[#F21C29]" />
                    <span>Category</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 truncate">
                    {selectedBuyerRequest.category || 'General Business'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedBuyerRequest.description && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                    Description & Specifications
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedBuyerRequest.description}
                  </div>
                </div>
              )}

              {/* Buyer Information */}
              {selectedBuyerRequest.user && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  {selectedBuyerRequest.user.photoUrl ? (
                    <img
                      src={selectedBuyerRequest.user.photoUrl}
                      alt={selectedBuyerRequest.user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {(selectedBuyerRequest.user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-black text-slate-900 truncate">
                      {selectedBuyerRequest.user.name || selectedBuyerRequest.user.username || 'Buyer'}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate">
                      {selectedBuyerRequest.user.email || 'Request Author'}
                    </p>
                  </div>
                  <Link
                    href={`/profile?id=${selectedBuyerRequest.user.uid || selectedBuyerRequest.userId}`}
                    className="text-xs font-bold text-[#F21C29] hover:underline shrink-0"
                  >
                    View
                  </Link>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBuyerRequest(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
