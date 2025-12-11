import axios from "axios";

const TELEGRAM_BASE = process.env.TELEGRAM_BOT_TOKEN
  ? `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
  : null;
const QUICK_COMMERCE_BASE = process.env.QUICK_COMMERCE_BOT
  ? `https://api.telegram.org/bot${process.env.QUICK_COMMERCE_BOT}`
  : null;

export const sendTelegram = async (
  message: string,
  chatId: string | null = null
): Promise<boolean> => {
  if (!TELEGRAM_BASE) {
    console.warn("TELEGRAM_BOT_TOKEN missing - skipping default Telegram send");
    return false;
  }

  try {
    const url = `${TELEGRAM_BASE}/sendMessage`;
    const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;
    if (!targetChatId) {
      console.error("Telegram chat ID not configured");
      return false;
    }

    await axios.post(
      url,
      {
        chat_id: targetChatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: false,
        disable_notification: false,
      },
      { timeout: 10_000 }
    );
    return true;
  } catch (err: any) {
    console.error("Telegram send error:", err.message);
    if (err.response) {
      console.error("Response:", err.response.data);
    }
    return false;
  }
};

export const sendQuickCommerceTelegram = async (
  text: string,
  chatId: string | null = null
): Promise<boolean> => {
  if (!QUICK_COMMERCE_BASE) {
    console.warn(
      "QUICK_COMMERCE_BOT missing - falling back to default Telegram sender"
    );
    return await sendTelegram(text, chatId);
  }

  try {
    const url = `${QUICK_COMMERCE_BASE}/sendMessage`;
    const targetChatId = chatId || process.env.QUICK_COMMERCE_ID;
    if (!targetChatId) {
      console.warn(
        "QUICK_COMMERCE_ID missing - falling back to default Telegram sender"
      );
      return await sendTelegram(text, chatId);
    }

    await axios.post(
      url,
      {
        chat_id: targetChatId,
        text,
        parse_mode: "Markdown",
        disable_notification: false,
      },
      { timeout: 10_000 }
    );
    return true;
  } catch (err: any) {
    console.error("Quick Commerce Telegram send error:", err.message);
    return await sendTelegram(text, chatId);
  }
};
