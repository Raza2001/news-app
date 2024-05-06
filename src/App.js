import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`);
        const newPosts = response.data.hits;
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [page]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="container-fluid" onScroll={handleScroll} style={{ height: '100vh', overflowY: 'scroll' }}>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Created At</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.objectID} className={index % 2 === 0 ? 'table-primary' : 'table-info'}>
              <td>{post.title}</td>
              <td>{post.url}</td>
              <td>{post.created_at}</td>
              <td>{post.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
