import React, { useEffect, useState } from "react";

const App = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomWords = async () => {
    try {
      const response = await fetch("https://random-word-api.herokuapp.com/word?number=10");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching random words:", error);
      return [];
    }
  };

  const fetchWordDetails = async (word) => {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();
      return {
        word,
        definition: data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found",
      };
    } catch {
      return { word, definition: "Definition not available" };
    }
  };

  const notifyUser = () => {
    if (window.electronAPI?.notify) {
      window.electronAPI.notify({
        title: "🧠 Word Learning Time!",
        body: "Click to learn 10 new words!",
      });
    }
  };

  const fetchWords = async () => {
    setLoading(true);
    const randomWords = await fetchRandomWords();
    const results = await Promise.all(randomWords.map(fetchWordDetails));
    setWords(results);
    setLoading(false);
    notifyUser();
  };

  useEffect(() => {
    fetchWords();

    const interval = setInterval(() => {
      fetchWords();
    }, 86400000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📘 Daily 10 Words (Every day)</h1>
      {loading ? <p>Loading words...</p> : (
        <ul>
          {words.map((item, index) => (
            <li key={index}>
              <strong>{item.word}</strong>: {item.definition}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
