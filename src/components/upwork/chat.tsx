"use client"

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ReactElement,
} from "react"
import { ArrowDown, ThumbsDown, ThumbsUp, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define Message type locally
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt?: Date
}

interface ChatPropsBase {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void
  messages: Array<Message>
  input: string
  className?: string
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>
  isGenerating: boolean
  stop?: () => void
  onRateResponse?: (
    messageId: string,
    rating: "thumbs-up" | "thumbs-down"
  ) => void
  setMessages?: (messages: any[]) => void
  transcribeAudio?: (blob: Blob) => Promise<string>
}

interface ChatPropsWithoutSuggestions extends ChatPropsBase {
  append?: never
  suggestions?: never
}

interface ChatPropsWithSuggestions extends ChatPropsBase {
  append: (message: { role: "user"; content: string }) => void
  suggestions: string[]
}

type ChatProps = ChatPropsWithoutSuggestions | ChatPropsWithSuggestions

// Simple MessageList component
const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-lg px-4 py-2",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Simple MessageInput component
const MessageInput = forwardRef<
  HTMLTextAreaElement,
  {
    value: string
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
    onSubmit: () => void
    disabled?: boolean
  }
>(({ value, onChange, onSubmit, disabled }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex gap-2">
      <Textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        className="min-h-[60px] resize-none"
      />
      <Button onClick={onSubmit} disabled={disabled || !value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
})
MessageInput.displayName = "MessageInput"

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  isGenerating,
  stop,
  className,
  append,
  suggestions,
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const onSubmit = useCallback(() => {
    if (input.trim() && !isGenerating) {
      handleSubmit()
    }
  }, [input, isGenerating, handleSubmit])

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && messages.length === 0 && (
        <div className="border-t p-4">
          <p className="mb-2 text-sm text-muted-foreground">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (append) {
                    append({ role: "user", content: suggestion })
                  }
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <MessageInput
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onSubmit={onSubmit}
          disabled={isGenerating}
        />
        {isGenerating && stop && (
          <Button
            variant="secondary"
            size="sm"
            onClick={stop}
            className="mt-2"
          >
            Stop generating
          </Button>
        )}
      </div>
    </div>
  )
}

export default Chat