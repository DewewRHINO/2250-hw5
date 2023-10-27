// https://jsonplaceholder.typicode.com/guide/

// For each <article> tag:

// Set the data-post-id attribute to the id field of the post.
// Create an <h2> with the contents of the title
// Create an <aside> and fill in the <span> by calling getUserName() and passing the userId
// Create the <p> tag by replacing "\n" characters with <br>
// For each <details> tag:
// Including the <summary>, <section>, <header>, and <h3> tags, but do not add any <aside>
// Add a toggle event listener to the <details> This is 90% done for you in my provided code.

async function downloadPosts(page = 1) {
  const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
  const response = await fetch(postsURL);
  const articles = await response.json();
  return articles;
}

async function downloadComments(postId) {
  const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  const response = await fetch(commentsURL);
  const comments = await response.json();
  return comments;
}

async function getUserName(userId) {
  const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(userURL);
  const user = await response.json();
  return user.name;
}

function getArticleId(comments) {
  const article = comments.previousElementSibling;
  const data = article.dataset;
  return data.postId;
}

function addArticle(post) { 
  let postID = post.id
  const mainElement = document.querySelector('main');

  var article = document.createElement("article");
  article.setAttribute("data-post-id", postID);
  article.setAttribute("id", postID);
  mainElement.appendChild(article);

  var heading = document.createElement("h2");
  var title = document.createTextNode(post.title);
  heading.appendChild(title);
  article.appendChild(heading);


  var userId = post.userId;
  // console.log(getUserName(userId));

  (async () => {
    const userName = await getUserName(userId);
    var aside = document.createElement("aside");
    var asideText = document.createTextNode(userName);
    aside.appendChild(asideText);
    article.appendChild(aside);

    var para = document.createElement("p");
    para.innerHTML = post.body.replace(/[\n\r]/g, '<br>');
    article.appendChild(para);

  })();

  var details = document.createElement("details");
  mainElement.appendChild(details);
  
  var summary = document.createElement("summary");
  var summaryText = document.createTextNode("See what our readers had to say...")
  summary.appendChild(summaryText)
  details.appendChild(summary);

  var section = document.createElement("section");
  details.appendChild(section);
  var header = document.createElement("header");
  section.appendChild(header)


  var header3 = document.createElement("h3");
  var headerText = document.createTextNode("Comments")
  header3.appendChild(headerText);
  header.appendChild(header3);

  


  downloadComments(userId).then(
    (comments) => {

      for (let i = 0; i < comments.length; i++) {
        var aside = document.createElement("aside");
        aside.innerHTML = comments[i].body.replace(/[\n\r]/g, '<br>');
        section.appendChild(aside);

        var user = document.createElement("p");
        var small = document.createElement("small");
        small.innerHTML = comments[i].name;
        user.appendChild(small);

        aside.appendChild(user);
      }
    }
  );

  

} 

const posts = await downloadPosts(3);
console.log(posts);

// const button = document.querySelector("article");
// button.setAttribute("data-post-id", data_post_id);
for (let i = 0; i < posts.length; i++) {
  addArticle(posts[i]);
}


const details = document.getElementsByTagName("details");
for (const detail of details) {
  detail.addEventListener("toggle", async (event) => {
    if (detail.open) {
      const asides = detail.getElementsByTagName("aside");
      const commentsWereDownloaded = asides.length > 0;
      if (!commentsWereDownloaded) {
        const articleId = getArticleId(detail);
        const comments = await downloadComments(articleId);
        console.log(comments);
      }
    }
  });
}