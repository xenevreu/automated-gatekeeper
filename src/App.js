import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import { listBlogs } from './graphql/queries.ts'
import { createBlog as createBlogMutation, deleteBlog as deleteBlogMutation } from './graphql/mutations.ts'
import { API, Storage } from 'aws-amplify'
import { WebcamCapture } from './components/Webcam/Webcam'

const initialFormState = {name: '', description: ''};

function App() {

  const webcam = React.useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file, {
      level: "protected",
      customPrefix: {
        protected: "protected/predictions/index-faces/"
      }
    });
    fetchBlogs();
  }

  async function fetchBlogs() {
    const apiData = await API.graphql({ query: listBlogs });
    const blogsFromApi = apiData.data.listBlogs.items;
    await Promise.all(blogsFromApi.map(async blog => {
      if (blog.image) {
        const image = await Storage.get(blog.image);
        blog.image = image;
      }
      return blog;
    })); 
    setBlogs(apiData.data.listBlogs.items);
  }

  async function createBlog() {
    if (!formData.name || !formData.description) return;
    try{
      const response = await API.graphql({ query: createBlogMutation, variables: { input: formData } });
      fetchBlogs();
      setFormData(initialFormState);
    } catch (e) {
      alert(e.errors[0].message);
    }
  }

  async function deleteBlog({id}) {
    const newBlogs = blogs.filter(note => note.id !== id);
    setBlogs(newBlogs);
    await API.graphql({ query: deleteBlogMutation, variables: { input: { id }} })
  }
  
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div className='App'>
            <h1>Hello {user.attributes.email}</h1>
            <button onClick={signOut}>Sign out v2</button><br/>
            <WebcamCapture />
            <input 
              onChange={e => setFormData({ ...formData, 'name': e.target.value })}
              placeholder="Blog name"
              value={formData.name}
            /><br/>
            <input 
              onChange={e => setFormData({ ...formData, 'description': e.target.value })}
              placeholder="Blog Brief description"
              value={formData.description}
            /><br/>
            <input type="file" onChange={onChange}/>
            <button onClick={createBlog}>Create Blog</button>
            <div style={{marginBottom: 30}}>
              {
                blogs.map(blog => (
                  <div key={blog.id || blog.name}>
                    <h2>{blog.name}</h2>
                    <h3>{blog.id}</h3>
                    <p>{blog.description}</p>
                    <button onClick={() => deleteBlog(blog)}>Delete blog</button>
                    {
                      blog.image && <img src={blog.image} style={{width: 200}}  />
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
