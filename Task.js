const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();


app.get('/api/blog-stats', async (req, res) => {
  try {

    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    const blogData = response.data;
    const totalBlogs = blogData.length;
    const longestBlog = _.maxBy(blogData, 'title.length');
    const blogsWithPrivacy = blogData.filter(blog => blog.title.toLowerCase().includes('privacy'));
    const uniqueTitles = _.uniqBy(blogData, 'title');
    const statistics = {
      totalBlogs,
      longestBlog: longestBlog ? longestBlog.title : null,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueTitles: uniqueTitles.map(blog => blog.title),
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching and analyzing blog data:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.get('/api/blog-search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required.' });
  }

  const results = _.filter(blogData, blog => blog.title.toLowerCase().includes(query.toLowerCase()));

  res.json(results);
});

app.listen(5000, () => {
  console.log("Server started at 5000");
});
