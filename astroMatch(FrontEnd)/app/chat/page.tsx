"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Input, Spinner, Chip } from "@heroui/react"
import SendIcon from "@/app/icons/send-icon"
import ChatBubbleIcon from "@/app/icons/chat-bubble-icon"

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
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string }>({
    id: "current-user",
    username: "You",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

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
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (data.isLoggedIn) {
          setIsLoggedIn(true)
          // Load conversations
          loadDemoData()

          // Check if there's a conversation ID in the URL
          const conversationId = searchParams?.get("id")
          if (conversationId) {
            setActiveConversation(conversationId)
          }
        } else {
          localStorage.removeItem("token")
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking login status:", error)
        localStorage.removeItem("token")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkLoginStatus()
  }, [router, searchParams])

  // Load demo data
  const loadDemoData = () => {
    // Demo conversations
    const demoConversations: Conversation[] = [
      {
        id: "1",
        user: {
          id: "user1",
          username: "Laura",
          profileImageUrl: "/placeholder.svg?height=100&width=100",
          isOnline: true,
        },
        unreadCount: 2,
      },
      {
        id: "2",
        user: {
          id: "user2",
          username: "Carlos",
          profileImageUrl: "/placeholder.svg?height=100&width=100",
          isOnline: false,
          lastActive: "Hace 3 horas",
        },
        unreadCount: 0,
      },
      {
        id: "3",
        user: {
          id: "user3",
          username: "Sofía",
          profileImageUrl: "/placeholder.svg?height=100&width=100",
          isOnline: true,
        },
        unreadCount: 5,
      },
      {
        id: "4",
        user: {
          id: "user4",
          username: "Miguel",
          profileImageUrl: "/placeholder.svg?height=100&width=100",
          isOnline: false,
          lastActive: "Hace 1 día",
        },
        unreadCount: 0,
      },
    ]

    // Demo messages for conversation 1
    const demoMessages: Record<string, Message[]> = {
      "1": [
        {
          id: "msg1",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "¡Hola! ¿Cómo estás hoy?",
          timestamp: "2023-06-15T10:30:00Z",
          isRead: true,
        },
        {
          id: "msg2",
          senderId: currentUser.id,
          receiverId: "user1",
          content: "¡Hola Laura! Estoy muy bien, gracias por preguntar. ¿Y tú?",
          timestamp: "2023-06-15T10:32:00Z",
          isRead: true,
        },
        {
          id: "msg3",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "Todo genial. Me encantó ver que tenemos tanta compatibilidad astrológica.",
          timestamp: "2023-06-15T10:35:00Z",
          isRead: true,
        },
        {
          id: "msg4",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "¿Te gustaría quedar algún día para tomar un café?",
          timestamp: "2023-06-15T10:36:00Z",
          isRead: false,
        },
        {
          id: "msg5",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "Conozco un lugar muy bonito en el centro.",
          timestamp: "2023-06-15T10:37:00Z",
          isRead: false,
        },
      ],
      "2": [
        {
          id: "msg6",
          senderId: "user2",
          receiverId: currentUser.id,
          content: "Hey, vi que te gusta la música. ¿Qué tipo de música escuchas?",
          timestamp: "2023-06-14T18:20:00Z",
          isRead: true,
        },
        {
          id: "msg7",
          senderId: currentUser.id,
          receiverId: "user2",
          content: "¡Hola Carlos! Me gusta de todo un poco, pero especialmente el rock y el indie. ¿Y tú?",
          timestamp: "2023-06-14T18:25:00Z",
          isRead: true,
        },
        {
          id: "msg8",
          senderId: "user2",
          receiverId: currentUser.id,
          content: "¡Genial! También me encanta el rock. ¿Has escuchado el nuevo álbum de Arctic Monkeys?",
          timestamp: "2023-06-14T18:30:00Z",
          isRead: true,
        },
      ],
      "3": [
        {
          id: "msg9",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "¡Hola! Acabo de ver que tenemos un 95% de compatibilidad. ¡Eso es increíble!",
          timestamp: "2023-06-15T09:10:00Z",
          isRead: false,
        },
        {
          id: "msg10",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "Me encantaría conocerte mejor.",
          timestamp: "2023-06-15T09:11:00Z",
          isRead: false,
        },
        {
          id: "msg11",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "¿Qué te parece si hablamos un poco sobre nuestros intereses?",
          timestamp: "2023-06-15T09:12:00Z",
          isRead: false,
        },
        {
          id: "msg12",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "Yo adoro el arte y la fotografía.",
          timestamp: "2023-06-15T09:13:00Z",
          isRead: false,
        },
        {
          id: "msg13",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "También me encanta viajar. ¿Has viajado mucho?",
          timestamp: "2023-06-15T09:14:00Z",
          isRead: false,
        },
      ],
      "4": [
        {
          id: "msg14",
          senderId: currentUser.id,
          receiverId: "user4",
          content: "Hola Miguel, vi que te gusta el deporte. Yo también soy bastante deportista.",
          timestamp: "2023-06-13T14:20:00Z",
          isRead: true,
        },
        {
          id: "msg15",
          senderId: "user4",
          receiverId: currentUser.id,
          content: "¡Hola! Sí, me encanta. Practico fútbol y natación principalmente. ¿Qué deportes te gustan a ti?",
          timestamp: "2023-06-13T14:30:00Z",
          isRead: true,
        },
        {
          id: "msg16",
          senderId: currentUser.id,
          receiverId: "user4",
          content: "Me gusta correr y el yoga. También juego al tenis de vez en cuando.",
          timestamp: "2023-06-13T14:35:00Z",
          isRead: true,
        },
      ],
    }

    setConversations(demoConversations)

    // Set messages for active conversation if any
    if (activeConversation && demoMessages[activeConversation]) {
      setMessages(demoMessages[activeConversation])
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const conversation = conversations.find((c) => c.id === activeConversation)
    if (!conversation) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: conversation.user.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectConversation = (conversationId: string) => {
    setActiveConversation(conversationId)

    // In a real app, you would fetch messages for this conversation from the API
    // For demo, we'll use our demo data
    const demoMessages: Record<string, Message[]> = {
      "1": [
        {
          id: "msg1",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "¡Hola! ¿Cómo estás hoy?",
          timestamp: "2023-06-15T10:30:00Z",
          isRead: true,
        },
        {
          id: "msg2",
          senderId: currentUser.id,
          receiverId: "user1",
          content: "¡Hola Laura! Estoy muy bien, gracias por preguntar. ¿Y tú?",
          timestamp: "2023-06-15T10:32:00Z",
          isRead: true,
        },
        {
          id: "msg3",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "Todo genial. Me encantó ver que tenemos tanta compatibilidad astrológica.",
          timestamp: "2023-06-15T10:35:00Z",
          isRead: true,
        },
        {
          id: "msg4",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "¿Te gustaría quedar algún día para tomar un café?",
          timestamp: "2023-06-15T10:36:00Z",
          isRead: false,
        },
        {
          id: "msg5",
          senderId: "user1",
          receiverId: currentUser.id,
          content: "Conozco un lugar muy bonito en el centro.",
          timestamp: "2023-06-15T10:37:00Z",
          isRead: false,
        },
      ],
      "2": [
        {
          id: "msg6",
          senderId: "user2",
          receiverId: currentUser.id,
          content: "Hey, vi que te gusta la música. ¿Qué tipo de música escuchas?",
          timestamp: "2023-06-14T18:20:00Z",
          isRead: true,
        },
        {
          id: "msg7",
          senderId: currentUser.id,
          receiverId: "user2",
          content: "¡Hola Carlos! Me gusta de todo un poco, pero especialmente el rock y el indie. ¿Y tú?",
          timestamp: "2023-06-14T18:25:00Z",
          isRead: true,
        },
        {
          id: "msg8",
          senderId: "user2",
          receiverId: currentUser.id,
          content: "¡Genial! También me encanta el rock. ¿Has escuchado el nuevo álbum de Arctic Monkeys?",
          timestamp: "2023-06-14T18:30:00Z",
          isRead: true,
        },
      ],
      "3": [
        {
          id: "msg9",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "¡Hola! Acabo de ver que tenemos un 95% de compatibilidad. ¡Eso es increíble!",
          timestamp: "2023-06-15T09:10:00Z",
          isRead: false,
        },
        {
          id: "msg10",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "Me encantaría conocerte mejor.",
          timestamp: "2023-06-15T09:11:00Z",
          isRead: false,
        },
        {
          id: "msg11",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "¿Qué te parece si hablamos un poco sobre nuestros intereses?",
          timestamp: "2023-06-15T09:12:00Z",
          isRead: false,
        },
        {
          id: "msg12",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "Yo adoro el arte y la fotografía.",
          timestamp: "2023-06-15T09:13:00Z",
          isRead: false,
        },
        {
          id: "msg13",
          senderId: "user3",
          receiverId: currentUser.id,
          content: "También me encanta viajar. ¿Has viajado mucho?",
          timestamp: "2023-06-15T09:14:00Z",
          isRead: false,
        },
      ],
      "4": [
        {
          id: "msg14",
          senderId: currentUser.id,
          receiverId: "user4",
          content: "Hola Miguel, vi que te gusta el deporte. Yo también soy bastante deportista.",
          timestamp: "2023-06-13T14:20:00Z",
          isRead: true,
        },
        {
          id: "msg15",
          senderId: "user4",
          receiverId: currentUser.id,
          content: "¡Hola! Sí, me encanta. Practico fútbol y natación principalmente. ¿Qué deportes te gustan a ti?",
          timestamp: "2023-06-13T14:30:00Z",
          isRead: true,
        },
        {
          id: "msg16",
          senderId: currentUser.id,
          receiverId: "user4",
          content: "Me gusta correr y el yoga. También juego al tenis de vez en cuando.",
          timestamp: "2023-06-13T14:35:00Z",
          isRead: true,
        },
      ],
    }

    if (demoMessages[conversationId]) {
      setMessages(demoMessages[conversationId])
    } else {
      setMessages([])
    }

    // Update unread count
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
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
        <Card className="lg:col-span-1 h-full">
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
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      activeConversation === conversation.id
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
        <Card className="lg:col-span-2 h-full flex flex-col">
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

