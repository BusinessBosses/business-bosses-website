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
  Mail,
  Store,
  MoreVertical,
  X,
  Plus,
  ChevronRight,
  ShieldCheck,
  Tag,
  DollarSign,
  Calendar,
  Layers,
  ShoppingBag,
  Info,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Globe,
  Award,
  Zap,
  CheckCircle2,
  UserCheck,
  Hourglass,
  Trash2,
} from 'lucide-react';
import { chatService, ChatMessage, Conversation } from '../../../services/chatService';
import { authService } from '../../../services/authService';
import { postService } from '../../../services/postService';
import { shopService, Shop } from '../../../services/shopService';
import { userService } from '../../../services/userService';
import { getUserProfileUrl } from '../../../common/functions/getUserProfileUrl';
import { formatCurrency, formatThousands } from '../../../common/functions/formatThousands';
import { toast } from 'react-toastify';

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

  // Desktop Side Details Panel
  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(true);
  const [partnerProfile, setPartnerProfile] = useState<any | null>(null);
  const [partnerShop, setPartnerShop] = useState<Shop | null>(null);
  const [loadingPartnerProfile, setLoadingPartnerProfile] = useState<boolean>(false);

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
    username?: string;
    partnerPhoto?: string;
    isSubscribed?: boolean;
    phone?: string;
    email?: string;
    bio?: string;
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
    const email = partner?.email;
    const bio = partner?.bio;
    const username = partner?.username;

    const existing = conversationMap.get(partnerId);
    const msgTime = new Date(msg.timestamp).getTime();
    const snippet = getMessageSnippet(msg);

    if (!existing) {
      conversationMap.set(partnerId, {
        partnerId,
        partnerName,
        username,
        partnerPhoto,
        isSubscribed,
        phone,
        email,
        bio,
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
      if (!existing.username && username) {
        existing.username = username;
      }
      if (isSubscribed) {
        existing.isSubscribed = true;
      }
      if (phone) {
        existing.phone = phone;
      }
      if (email) {
        existing.email = email;
      }
      if (bio) {
        existing.bio = bio;
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

  // Check request state:
  // hasMessages = thread has at least 1 message
  // iHaveReplied = currentUser has sent at least 1 message in this thread
  const hasMessages = currentThread.length > 0;
  const initialMessage = hasMessages ? currentThread[0] : null;
  const initialSenderUid = initialMessage?.senderUid;
  const isSenderOfInitial = initialSenderUid === myUid;
  const recipientHasReplied = hasMessages && currentThread.some((m) => m.senderUid !== initialSenderUid);
  const isPendingMessageRequest = hasMessages && !recipientHasReplied;

  // Auto-scroll when new message appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentThread]);

  // Load partner detailed profile and shop for desktop info panel
  useEffect(() => {
    if (!activePartnerId) {
      setPartnerProfile(null);
      setPartnerShop(null);
      return;
    }

    let isCancelled = false;
    const fetchPartnerDetails = async () => {
      setLoadingPartnerProfile(true);
      try {
        const [prof, sh] = await Promise.all([
          userService.getUserById(activePartnerId).catch(() => null),
          shopService.getUserShop(activePartnerId).catch(() => null),
        ]);
        if (!isCancelled) {
          setPartnerProfile(prof);
          setPartnerShop(sh);
        }
      } catch {
        // ignore
      } finally {
        if (!isCancelled) {
          setLoadingPartnerProfile(false);
        }
      }
    };

    fetchPartnerDetails();
    return () => {
      isCancelled = true;
    };
  }, [activePartnerId]);

  // Automatically select the first conversation on desktop if none selected
  useEffect(() => {
    if (!activePartnerId && typeof window !== 'undefined' && window.innerWidth >= 768) {
      if (displayedConversations.length > 0) {
        handleSelectConversation(displayedConversations[0]);
      }
    }
  }, [displayedConversations.length]);

  const handleSelectConversation = (conv: any) => {
    setActivePartnerId(conv.partnerId);
    setActivePartner(conv);

    // Mark messages from this sender as seen
    if (conv.unreadCount > 0) {
      conv.unreadCount = 0;
      chatService.markAsSeen(conv.partnerId).catch(() => {});
      setMessages((prev) =>
        prev.map((m) =>
          m.senderUid === conv.partnerId && m.receiverUid === myUid
            ? { ...m, seen: true }
            : m
        )
      );
    }
  };

  /**
   * Mobile parity: Accept Message Request
   * Sends "Request Accepted" message so thread transitions immediately into active Chats tab.
   */
  const handleAcceptRequest = async () => {
    if (!activePartnerId || sending) return;

    setSending(true);
    const text = 'Request Accepted';

    const tempMessage: ChatMessage = {
      messageId: `temp-${Date.now()}`,
      senderUid: myUid,
      receiverUid: activePartnerId,
      messageText: text,
      timestamp: Date.now(),
      seen: false,
    };

    setMessages((prev) => [...prev, tempMessage]);

    const targetConv = conversationMap.get(activePartnerId);
    if (targetConv) {
      targetConv.lastMessage = text;
      targetConv.lastTimestamp = Date.now();
      targetConv.iHaveReplied = true;
    }

    // Switch tab to active chats
    setActiveTab('chats');

    try {
      await chatService.sendMessage(activePartnerId, text);
      toast.success('Message request accepted!');
    } catch (err) {
      console.error(err);
      toast.error('Could not accept request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  /**
   * Mobile parity: Decline Message Request
   * Removes conversation from local state and triggers delete on backend.
   */
  const handleDeclineRequest = async () => {
    if (!activePartnerId) return;

    const partnerIdToDecline = activePartnerId;
    // Optimistically remove from state
    setMessages((prev) =>
      prev.filter(
        (m) =>
          !(
            (m.senderUid === partnerIdToDecline && m.receiverUid === myUid) ||
            (m.senderUid === myUid && m.receiverUid === partnerIdToDecline)
          )
      )
    );
    conversationMap.delete(partnerIdToDecline);
    setActivePartnerId(null);
    setActivePartner(null);

    toast.info('Message request declined.');

    try {
      await chatService.deleteChat(partnerIdToDecline);
    } catch (e) {
      // ignore
    }
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
      toast.error('Failed to upload image. Please try again.');
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
          <div className="bg-white text-slate-800 rounded-2xl p-4 border border-slate-200/90 shadow-xs max-w-sm my-1 text-left">
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
              className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#F21C29] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
          <div className="bg-white text-slate-800 rounded-2xl p-3.5 border border-slate-200/90 shadow-xs max-w-xs my-1 flex items-center justify-between gap-3 text-left">
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

    // 3. Request Accepted banner message
    if (text === 'Request Accepted') {
      return (
        <div className="flex items-center gap-2 font-bold py-0.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>Request Accepted</span>
        </div>
      );
    }

    // Regular message
    return <p className="leading-relaxed whitespace-pre-wrap break-words">{text}</p>;
  };

  const resolvedPartner = partnerProfile || activePartner;
  const partnerName = resolvedPartner?.name || resolvedPartner?.fullname || activePartner?.partnerName || 'Business Boss';
  const partnerUsername = resolvedPartner?.username || activePartner?.username;
  const partnerPhoto = resolvedPartner?.photoUrl || resolvedPartner?.profilePicture || activePartner?.partnerPhoto;
  const partnerBio = resolvedPartner?.bio || activePartner?.bio;
  const partnerPhone = resolvedPartner?.phone || resolvedPartner?.phoneNumber || activePartner?.phone;
  const partnerEmail = resolvedPartner?.email || activePartner?.email;
  const partnerIsSubscribed = Boolean(resolvedPartner?.isSubscribed || resolvedPartner?.isBossPro || activePartner?.isSubscribed);

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-5rem)] flex flex-col">
      {/* Hidden file input for image attachment */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white rounded-2xl lg:rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-1 h-full min-h-0">
        
        {/* ============================================================== */}
        {/* COLUMN 1: Conversation List (Chats / Requests)                 */}
        {/* ============================================================== */}
        <div
          className={`w-full md:w-80 lg:w-[340px] xl:w-[360px] border-r border-slate-200/80 flex flex-col shrink-0 bg-white ${
            activePartnerId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Tabs */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 space-y-3">
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
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all placeholder:text-slate-400"
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
                className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'chats'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Chats</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    activeTab === 'chats' ? 'bg-red-50 text-[#F21C29]' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {activeChats.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'requests'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Requests</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    activeTab === 'requests' ? 'bg-red-50 text-[#F21C29]' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {requestChats.length}
                </span>
              </button>
            </div>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 no-scrollbar">
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
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  {activeTab === 'chats'
                    ? 'Your ongoing conversations with business partners and buyers will appear here.'
                    : 'Incoming messages from new inquiries will appear here until you reply or accept.'}
                </p>
              </div>
            ) : (
              displayedConversations.map((conv) => {
                const isSelected = conv.partnerId === activePartnerId;
                return (
                  <div
                    key={conv.partnerId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`flex items-center gap-3 p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50/70 border-l-4 border-l-[#F21C29]'
                        : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Partner Avatar with Badge */}
                    <div className="relative shrink-0">
                      {conv.partnerPhoto ? (
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200/90 relative">
                          <SafeImage
                            src={conv.partnerPhoto}
                            alt={conv.partnerName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-700 flex items-center justify-center font-black text-sm border border-slate-200">
                          {conv.partnerName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Subscribed Gold Star */}
                      {conv.isSubscribed && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-2xs"
                          title="Verified Pro Member"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Partner Info & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4
                          className={`text-xs sm:text-sm truncate ${
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
                      <span className="min-w-4 h-4 px-1 rounded-full bg-[#F21C29] text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs leading-none">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: Center Active Chat Thread                            */}
        {/* ============================================================== */}
        <div
          className={`flex-1 flex flex-col bg-[#F8FAFC] min-w-0 border-r border-slate-200/80 ${
            activePartnerId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activePartnerId && activePartner ? (
            <>
              {/* Thread Header */}
              <div className="p-3 sm:p-3.5 border-b border-slate-200/80 bg-white flex items-center justify-between shadow-2xs z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setActivePartnerId(null)}
                    className="md:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative shrink-0">
                    {partnerPhoto ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 relative">
                        <SafeImage
                          src={partnerPhoto}
                          alt={partnerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm border border-slate-200">
                        {partnerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {partnerIsSubscribed && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border border-white flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                        {partnerName}
                      </h3>
                      {partnerIsSubscribed && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Active on Business Bosses</span>
                      {partnerUsername && (
                        <span className="text-slate-400 font-normal">@{partnerUsername}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Header Action Tools */}
                <div className="flex items-center gap-1.5">
                  {partnerPhone && (
                    <a
                      href={`tel:${partnerPhone}`}
                      className="p-2 rounded-xl text-slate-600 hover:text-[#F21C29] hover:bg-red-50 transition-colors"
                      title={`Call ${partnerPhone}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                  <Link
                    href={getUserProfileUrl({ username: partnerUsername, uid: activePartnerId })}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    title="View Profile"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  {/* Toggle side details panel on desktop */}
                  <button
                    type="button"
                    onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                    className={`hidden lg:flex p-2 rounded-xl transition-colors cursor-pointer ${
                      showDetailsPanel
                        ? 'bg-red-50 text-[#F21C29] border border-red-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={showDetailsPanel ? 'Hide Contact Info' : 'Show Contact Info'}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message History Container */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {currentThread.length === 0 ? (
                  <div className="py-24 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 mx-auto flex items-center justify-center mb-2 shadow-xs">
                      <MessageSquare className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">Start the conversation</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                      Send a message, discuss deals, share proposals or attach specifications below.
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
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs transition-all ${
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

              {/* Message Composer or Message Request Accept Banner (Full Mobile Parity) */}
              {isPendingMessageRequest ? (
                isSenderOfInitial ? (
                  /* 1. Sender side: Message request pending */
                  <div className="p-4 bg-white border-t border-slate-200/80">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                        <Hourglass className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          Message Request Pending
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          You can send another message once {partnerName} accepts your request.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 2. Recipient side: Accept or Decline Request Action Banner */
                  <div className="p-4 bg-white border-t border-slate-200/80 shadow-lg animate-in slide-in-from-bottom-2 duration-150">
                    <div className="text-center mb-3">
                      <p className="text-sm font-bold text-slate-900">
                        {partnerName} sent you a message request.
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Accepting will allow {partnerName} to send you messages and view your direct activity.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      <button
                        type="button"
                        onClick={handleDeclineRequest}
                        disabled={sending}
                        className="py-2.5 px-4 rounded-xl border border-red-200 text-[#F21C29] hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAcceptRequest}
                        disabled={sending}
                        className="py-2.5 px-4 rounded-xl bg-[#F21C29] hover:bg-[#D01420] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* 3. Standard Message Input Composer */
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-3.5 bg-white border-t border-slate-200/80 flex items-center gap-2"
                >
                  {/* Image Attachment Trigger */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-[#F21C29] hover:bg-red-50 transition-all border border-slate-200/80 disabled:opacity-50 cursor-pointer"
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
                    className="h-10 px-4 rounded-xl bg-[#F21C29] hover:bg-[#D01420] disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
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
              )}
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

        {/* ============================================================== */}
        {/* COLUMN 3: Desktop Contact & Biz-Center Details Panel           */}
        {/* ============================================================== */}
        {showDetailsPanel && activePartnerId && activePartner && (
          <div className="hidden lg:flex w-72 xl:w-80 flex-col shrink-0 bg-white overflow-y-auto no-scrollbar border-l border-slate-100 p-5 space-y-5">
            {/* User Header Profile Card */}
            <div className="text-center space-y-2">
              <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shadow-xs">
                {partnerPhoto ? (
                  <SafeImage
                    src={partnerPhoto}
                    alt={partnerName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-2xl">
                    {partnerName.charAt(0).toUpperCase()}
                  </div>
                )}
                {partnerIsSubscribed && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-black text-base text-slate-900 leading-tight">
                  {partnerName}
                </h3>
                {partnerUsername && (
                  <p className="text-xs text-slate-400 mt-0.5">@{partnerUsername}</p>
                )}
              </div>

              {partnerIsSubscribed && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Verified Pro Member</span>
                </div>
              )}

              {partnerBio && (
                <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-3">
                  {partnerBio}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href={getUserProfileUrl({ username: partnerUsername, uid: activePartnerId })}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </Link>

              {partnerPhone ? (
                <a
                  href={`tel:${partnerPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#F21C29] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              ) : (
                <Link
                  href={`/marketplace?seller=${activePartnerId}`}
                  className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#F21C29] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop</span>
                </Link>
              )}
            </div>

            {/* Biz-Center Card (if user has a shop) */}
            {partnerShop ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-[#F21C29] flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      Biz-Center
                    </span>
                  </div>
                  {partnerShop.verificationStatus === 'approved' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {partnerShop.name}
                  </h4>
                  {partnerShop.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {partnerShop.description}
                    </p>
                  )}
                </div>

                {partnerShop.location && (
                  <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{partnerShop.location}</span>
                  </p>
                )}

                <Link
                  href={getUserProfileUrl({ username: partnerUsername, uid: activePartnerId }) + '#biz-center'}
                  className="w-full py-2 px-3 rounded-xl bg-[#F21C29] hover:bg-[#D01420] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Visit Biz-Center</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-[#F21C29]" />
                  <span>Business Safety</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Keep communications, orders, and agreements inside Business Bosses to qualify for buyer protection.
                </p>
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-2.5 pt-1">
              <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Contact Information
              </h5>

              {partnerEmail && (
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{partnerEmail}</span>
                </div>
              )}

              {partnerPhone && (
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{partnerPhone}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Last active recently</span>
              </div>
            </div>

            {/* Marketplace Link */}
            <Link
              href="/marketplace"
              className="block p-3.5 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white group transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">
                  Explore Deals
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs font-bold leading-snug">
                Browse products and services on the marketplace
              </p>
            </Link>
          </div>
        )}

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
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
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
                    href={getUserProfileUrl({
                      username: selectedBuyerRequest.user?.username,
                      uid: selectedBuyerRequest.user?.uid || selectedBuyerRequest.userId,
                    })}
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
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
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
