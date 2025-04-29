"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Input, Spinner, Chip } from "@heroui/react"
import SendIcon from "@/app/icons/send-icon"
import ChatBubbleIcon from "@/app/icons/chat-bubble-icon"
import { time } from "console"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
}

interface User {
  id: string
  username: string
  profileImageUrl: string
  isOnline: boolean
  lastActive?: string
}

interface Conversation {
  id: string
  user: User
  lastMessage?: Message
  unreadCount: number
}

export default function ChatPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string }>({ id: "", username: "" })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await fetch("http://localhost:8080/api/auth/isLoggedIn", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (!data.isLoggedIn) throw new Error()

        const meRes = await fetch("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const me = await meRes.json()
        setCurrentUser({ id: me.id.toString(), username: me.username })
        setIsLoggedIn(true)
        await loadConversations()
      } catch {
        localStorage.removeItem("token")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkLoginStatus()
  }, [router, searchParams])

  // Load conversations from API
  const loadConversations = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/matches/confirmed", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    const mapped: Conversation[] = data.map((user: any) => ({
      id: user.id.toString(),
      user: {
        id: user.id.toString(),
        username: user.username,
        profileImageUrl: `${API_URL}${user.profileImageUrl}`,
        isOnline: user.online,
        lastActive: user.lastActive
        ? new Date(user.lastActive).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          })
        : undefined,
    },
    unreadCount: user.unreadCount ?? 0,
    }))
    setConversations(mapped)

    const conversationId = searchParams?.get("id")
    if (conversationId) {
      await selectConversation(conversationId)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    const token = localStorage.getItem("token")
    console.log("enviando mensaje: ", {
      senderId: currentUser.id,
      receiverId: activeConversation,
    })

    const res = await fetch("http://localhost:8080/api/users/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senderId: currentUser.id,
        receiverId: activeConversation,
        content: newMessage.trim(),
      }),
    })

    if (res.ok) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: activeConversation,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
      }
      setMessages((prev) => [...prev, newMsg])
      setNewMessage("")
    } else {
      const error = await res.text()
      alert("Error al enviar mensaje: " + error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectConversation = async (conversationId: string) => {
    setActiveConversation(conversationId)
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:8080/api/users/messages/chat/${currentUser.id}/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })


    if (!res.ok) {
      console.error("Error cargando mensajes:", res.status, await res.text());
      alert("No se han podido cargar los mensajes. Código: " + res.status);
      return;
    }
    const msgs = await res.json()
    const mappedMessages: Message[] = msgs.map((m: any) => ({
      id : String(m.id),
      senderId: String(m.senderId),
      receiverId: String(m.receiverId),
      content: m.content,
      timestamp: m.timestamp,
      isRead: m.isRead,
    }))
    setMessages(mappedMessages)
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
    )
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString()
    }
  }

  const viewProfile = (userId: string) => {
    router.push(`/profile-view/${userId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6 gap-3">
        <ChatBubbleIcon size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">Mensajes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations list */}
        <Card className="lg:col-span-1 h-full bg-[var(--card)]">
          <CardHeader className="pb-0">
            <h2 className="text-xl font-semibold">Conversaciones</h2>
          </CardHeader>
          <CardBody className="overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No tienes conversaciones aún</div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${activeConversation === conversation.id
                        ? "bg-primary/10"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar
                        src={conversation.user.profileImageUrl}
                        className="h-12 w-12"
                        alt={`Avatar de ${conversation.user.username}`}
                      />
                      {conversation.user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.user.username}</h3>
                        {conversation.unreadCount > 0 && (
                          <Chip size="sm" color="primary" variant="solid">
                            {conversation.unreadCount}
                          </Chip>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conversation.user.isOnline ? "En línea" : conversation.user.lastActive}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Chat area */}
        <Card className="lg:col-span-2 h-full flex flex-col bg-[var(--card)]">
          {activeConversation ? (
            <>
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <div className="flex items-center">
                  {(() => {
                    const conversation = conversations.find((c) => c.id === activeConversation)
                    if (!conversation) return null

                    return (
                      <>
                        <div className="relative">
                          <Avatar
                            src={conversation.user.profileImageUrl}
                            className="h-10 w-10"
                            alt={`Avatar de ${conversation.user.username}`}
                          />
                          {conversation.user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{conversation.user.username}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.user.isOnline ? "En línea" : conversation.user.lastActive}
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <Button
                  color="primary"
                  variant="light"
                  size="sm"
                  onPress={() => {
                    const conversation = conversations.find((c) => c.id === activeConversation)
                    if (conversation) {
                      viewProfile(conversation.user.id)
                    }
                  }}
                >
                  Ver perfil
                </Button>
              </CardHeader>
              <Divider />
              <CardBody className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === currentUser.id
                    const showDate =
                      index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp)

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] ${isCurrentUser ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"} rounded-2xl px-4 py-2`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${isCurrentUser ? "text-primary-100" : "text-gray-500 dark:text-gray-400"}`}
                            >
                              {formatMessageTime(message.timestamp)}
                              {isCurrentUser && <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </CardBody>
              <Divider />
              <CardBody className="p-4">
                <div className="flex gap-2">
                  <Input
                    fullWidth
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <Button isIconOnly color="primary" onPress={handleSendMessage} isDisabled={!newMessage.trim()}>
                    <SendIcon />
                  </Button>
                </div>
              </CardBody>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <ChatBubbleIcon size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">Tus mensajes</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Selecciona una conversación para comenzar a chatear
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}