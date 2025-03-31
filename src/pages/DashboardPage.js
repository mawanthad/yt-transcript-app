import React, { useEffect, useState } from "react";
import { Layout, Typography, Input, Button, message, Table } from "antd";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function DashboardPage({ user }) {
  const [url, setUrl] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const q = query(
        collection(db, "scrapeHistory"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));
      setHistory(results.sort((a, b) => b.createdAt - a.createdAt));
    };

    loadHistory();
  }, [user]);

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

  const columns = [
    {
      title: "🧾 File",
      dataIndex: "file",
      render: (text) => (
        <a href={`https://yt-backend-5lha.onrender.com/files/${text}`} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "🎬 Video Count",
      dataIndex: "count",
    },
    {
      title: "🕒 Scraped At",
      dataIndex: "createdAt",
      render: (timestamp) =>
        new Date(timestamp).toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#001529",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          🧠 YouTube Transcript Scraper
        </Title>
        <div style={{ color: "#fff" }}>
          👤 {user.displayName || user.email}
          <Button onClick={() => auth.signOut()} style={{ marginLeft: "1rem" }}>
            Logout
          </Button>
        </div>
      </Header>

      <Content style={{ padding: "2rem" }}>
        <Title level={4}>Enter YouTube Channel URL or @handle</Title>
        <Input
          placeholder="e.g. https://www.youtube.com/@veritasium"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ maxWidth: 600, marginBottom: "1rem" }}
        />
        <br />
        <Button type="primary" onClick={handleScrape}>
          Scrape Transcripts
        </Button>

        {history.length > 0 && (
          <>
            <Title level={4} style={{ marginTop: "2rem" }}>
              📜 Your Scrape History
            </Title>
            <Table columns={columns} dataSource={history} pagination={false} />
          </>
        )}
      </Content>

      <Footer style={{ textAlign: "center" }}>© 2025 YouTube Trail</Footer>
    </Layout>
  );
}

export default DashboardPage;


//mawa
//mawa