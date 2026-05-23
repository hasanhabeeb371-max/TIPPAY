import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Phone, User, Check, CheckCheck } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function WhatsChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello! I am your Tipay Delivery Assistant. How can I help you today?\n\nType or tap one of the commands below to interact:\n• */status* - Check active order status\n• */track* - Get delivery agent details\n• */menu* - Today's hot deals\n• */cancel* - Cancel active order",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [awaitingCancel, setAwaitingCancel] = useState(false);

  const { activeOrder, cancelOrder } = useOrders();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputText("");

    // Simulate bot thinking
    setTimeout(() => {
      const q = text.toLowerCase();

      if (awaitingCancel) {
        if (q === "yes" || q.includes("confirm")) {
          if (activeOrder) {
            cancelOrder(activeOrder.id);
            addBotMessage(`Your order *${activeOrder.id}* has been successfully cancelled. A refund will be initiated shortly. ❌`);
          } else {
            addBotMessage("No active orders found to cancel.");
          }
          setAwaitingCancel(false);
        } else {
          addBotMessage("Cancellation aborted. Your order is still active.");
          setAwaitingCancel(false);
        }
        return;
      }

      if (q.includes("/status")) {
        if (activeOrder) {
          addBotMessage(
            `📦 *Order Status Update*\n\nOrder ID: *${activeOrder.id}*\nRestaurant: *${activeOrder.restaurantName}*\nStatus: *${activeOrder.status}*\nEstimated Delivery: *${activeOrder.estimatedDelivery}*`
          );
        } else {
          addBotMessage("You do not have any active orders at the moment. Order delicious food from the homepage first! 🍕");
        }
      } else if (q.includes("/track")) {
        if (activeOrder) {
          if (activeOrder.deliveryAgent) {
            addBotMessage(
              `🛵 *Rider Information*\n\nAgent Name: *${activeOrder.deliveryAgent.name}*\nContact: *${activeOrder.deliveryAgent.phone}*\nStatus: En route to delivery location.`
            );
          } else {
            addBotMessage("Your order is being prepared. A delivery rider will be assigned shortly! 👨‍🍳");
          }
        } else {
          addBotMessage("No active order found. Please place an order to track.");
        }
      } else if (q.includes("/menu")) {
        addBotMessage(
          "🔥 *Today's Hot Deals* 🔥\n\n1. *Subway*: Buy 1 Get 1 FREE (on wraps)\n2. *Burger King*: Flat 50% Off (Code: BK50)\n3. *Pizza Hut*: Free Personal Pan Pizza on orders above ₹400\n\nBrowse full menus on the Home Screen! 🛵"
        );
      } else if (q.includes("/cancel")) {
        if (activeOrder) {
          if (activeOrder.status === "Picked Up" || activeOrder.status === "Delivered") {
            addBotMessage("Sorry, your order is already out for delivery or delivered and cannot be cancelled.");
          } else {
            addBotMessage(`⚠️ Are you sure you want to cancel order *${activeOrder.id}*?\n\nType *YES* to confirm cancellation.`);
            setAwaitingCancel(true);
          }
        } else {
          addBotMessage("You have no active orders to cancel.");
        }
      } else {
        addBotMessage(
          "I didn't quite get that. Please select one of the quick commands below:\n\n• */status* - Check status\n• */track* - Rider details\n• */menu* - Hot deals\n• */cancel* - Cancel order"
        );
      }
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] transition-all"
        >
          {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
          {!isOpen && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground animate-bounce">
              1
            </span>
          )}
        </motion.button>
      </div>

      {/* WhatsApp Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-36 right-4 z-50 w-[310px] md:w-[340px] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl flex flex-col h-[400px]">
            {/* Header */}
            <div className="bg-[#075E54] text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-bold">
                    T
                  </div>
                  <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-[#25D366] border border-[#075E54]"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold flex items-center gap-1">
                    Tipay Assistant
                    <span className="text-[10px] bg-white/20 px-1 rounded text-[#25D366] font-normal">Verified</span>
                  </h4>
                  <p className="text-[10px] text-white/70">Online · Business Account</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#ece5dd]"
              style={{
                backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                backgroundSize: "contain",
              }}
            >
              {messages.map((m, idx) => {
                const isBot = m.sender === "bot";
                return (
                  <div
                    key={idx}
                    className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs shadow-sm ${
                        isBot
                          ? "bg-white text-gray-800 rounded-tl-none"
                          : "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-gray-500">
                        <span>{m.time}</span>
                        {!isBot && <CheckCheck size={10} className="text-[#34b7f1]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="bg-card px-2.5 py-1.5 border-t border-border/40 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {["/status", "/track", "/menu", "/cancel"].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleSend(cmd)}
                  className="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-semibold text-accent-foreground hover:bg-accent/25 shrink-0"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="bg-muted/30 p-2 border-t border-border/40 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#075E54]"
              />
              <button
                onClick={() => handleSend()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#075E54] text-white shrink-0 hover:bg-[#054c43]"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
