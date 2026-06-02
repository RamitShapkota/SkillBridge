import { useState, useEffect } from "react";
import axios from "axios";

interface Joke {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [jokes, setJokes] = useState<Joke[]>([]);

  useEffect(() => {
    axios
      .get<Joke[]>("/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1 className="bg-amber-500">Full Stack Application done by Ramit</h1>

      <p>JOKES: {jokes.length}</p>

      {jokes.map((joke) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  );
}

export default App;