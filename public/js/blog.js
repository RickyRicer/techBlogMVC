$(document).ready(function () {
  const commentBtn = $('#commentBtn');
  const editBlogBtn = $('#editBlogBtn');
  const commentField = $('#commentField');
  const targetBlog = $('#targetBlog');
  const blog_id = targetBlog[0].dataset.id;
  const errorText = $('#error');
  const newTitle = $('#newTitle');
  const newContent = $('#newContent');
  let error = '';

  commentBtn.on('click', async (event) => {
    event.preventDefault();
    event.target.innerText = `Loading...`;
    const text = commentField.val().trim();
    if (text) {
      await $.post('/api/comment', {
        text: commentField.val().trim(),
        blog_id,
      }).then((response) => {
        window.location.href = `/blog/${blog_id}`;
      }).catch((error) => {
        errorText.text(`${response.error}`);
      });
    } else {
      errorText.text(`Error submitting comment.
      Make sure you\'ve typed something!`);
    }
  });

  editBlogBtn.on('click', async function (event) {
    event.preventDefault();
    event.target.innerText = `Loading...`;
    await $.ajax({
      url: `/api/blog/${blog_id}`,
      method: 'PUT',
      data: JSON.stringify({
        title: newTitle.val().trim(),
        content: newContent.val().trim(),
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (response) {
        alert(`Blog updated!`)
        window.location.reload();
      },
      error: function (jqXHR) {
        error = jqXHR.statusText;
        console.log(error);
      }
    });
  });
});
