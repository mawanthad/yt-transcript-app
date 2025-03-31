const handleScrape = async () => {
  if (!url) return message.error("Please enter a YouTube URL");

  message.loading({ content: "Scraping in progress...", key: "scrape" });

  try {
    const res = await fetch("https://yt-backend-5lha.onrender.com/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (data.status === "success") {
      message.success({
        content: `🎉 Scraped ${data.count} videos!`,
        key: "scrape",
      });

      const record = {
        file: data.file,
        count: data.count,
        createdAt: Date.now(),
        uid: user.uid,
        email: user.email,
      };

      const docRef = await addDoc(collection(db, "scrapeHistory"), record);

      setHistory((prev) => [
        {
          key: docRef.id,
          ...record,
        },
        ...prev,
      ]);

      window.open(`https://yt-backend-5lha.onrender.com/files/${data.file}`, "_blank");
    } else if (data.status === "no_transcripts") {
      message.warning({
        content: "No transcripts found.",
        key: "scrape",
      });
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    message.error({
      content: `❌ Error: ${err.message}`,
      key: "scrape",
    });
  }
};
