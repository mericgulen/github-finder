const API_URL = 'https://api.github.com/users/';

const form = document.getElementById('form');
const inputSearch = document.getElementById('input-search');
const main = document.getElementById('main');

//* get user
async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);
    //*console.log(data);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    createErrorCard('User not found');
    //* console.log(err);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  //* get input value
  const userName = inputSearch.value;

  if (userName) {
    getUser(userName);
    inputSearch.value = '';
  }
});

function createUserCard(user) {
  const userName = user.name || user.login;
  const userBio = user.bio ? `<p>💡 ${user.bio}</p>` : '';

  const userCard = `
  <figure class="user-card">
  <img
    class="card-img"
    src= ${user.avatar_url}
    alt=${user.name}
  />
  <div class="card-info">
    <div class="card-title">
      <h2 class="card-name">${userName}</h2>
      <small>@${user.login}</small>
    </div>

    <p>${userBio}</p>
    <ul class="follow-list">
      <li>
        <i class="fa-solid fa-users"></i> ${user.followers} <strong>Followers</strong>
      </li>
      <li>${user.following} <strong>Following</strong></li>
      <li>
        <i class="fa-solid fa-bookmark"></i> ${user.public_repos}
        <strong>Repository</strong>
      </li>
    </ul>

    <div class="repos" id="repos"></div>
  </div>
</figure>
  `;
  main.innerHTML = userCard;
}

async function getRepos(username) {
  try {
    const { data } = await axios(API_URL + username + '/repos');
    //* console.log(data);
    addReposToCard(data);
  } catch (err) {
    createErrorCard('Repository not found');
  }
}

function addReposToCard(repos) {
  const repoEl = document.getElementById('repos');

  repos.slice(0, 3).forEach(repo => {
    const repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.target = '_blank';

    repoLink.innerHTML = `
      <i class="fa-solid fa-bookmark"></i>${repo.name}
    `;

    repoEl.appendChild(repoLink);
  });
}

function createErrorCard(message) {
  const cardError = `
    <figure class='user-card'>
      <h2>${message}</h2>
    </figure>
  `;

  main.innerHTML = cardError;
}
