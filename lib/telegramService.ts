import axios from "axios";

export const sendTelegram = async (message: string): Promise<boolean> => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram credentials not configured");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(
      url,
      {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: false,
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

