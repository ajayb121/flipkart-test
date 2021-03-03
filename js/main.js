let emailData = [];
let emailDesc = "";

function getDateEl(date) {
  const strDate = date.toLocaleString().split(", ")[0];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ampm;
  return `<div>${strDate} ${strTime}</div>`;
}

function showList(list) {
  const listEl = document.getElementById("list");
  let innerList = "";
  list.forEach(({
    from: { email, name },
    subject,
    short_description,
    id,
    date,
  }) => {
    const avatarEl = `<div>${name[0]}</div>`;
    const fromEl = `<div>From: <span>${name}</span><span><${email}></span>`;
    const subjectEl = `<div>Subject: <span>${subject}</span></div>`;
    const descriptionEl = `<div>Subject: <span>${short_description}</span></div>`;
    const dateObj = new Date(date);
    const dateEl = getDateEl(dateObj);
    const inner = document.createElement('div');
    inner.id = id;
    inner.innerHTML = `${avatarEl}
      ${fromEl}
      ${subjectEl}
      ${descriptionEl}
      ${dateEl}`;
    innerList += inner.outerHTML;
  });
  listEl.innerHTML = innerList;
}

function getEmailData() {
  const unreadLabelEl = document.getElementById("unread");
  fetch("https://flipkart-email-mock.now.sh/")
    .then(response => response.json())
    .then(data => {
      unreadLabelEl.className = "selectedLabel";
      emailData = data.list.map(el => ({
        ...el,
        isFavourite: false,
        isRead: false,
      }
      ));
      showList(emailData);
    })
}

function initEmailDisplay() {
  getEmailData();
}

initEmailDisplay();

function updateView(data, body) {
  //avatar, subject, date
  //mark as favourite
  const emailBodyEl = document.getElementById("emailBody");
  if(!body) {
    emailBodyEl.innerHTML = "";
  } else {
    const {
      from: { email, name },
      subject,
      short_description,
      id,
      date,
    } = data;
    const avatarEl = `<div>${name[0]}</div>`;
    const subjectEl = `<div>${subject}</div>`;
    const dateObj = new Date(date);
    const dateEl = getDateEl(dateObj);
    const markAsFavEl = `<div onclick="selectFavourite(event)">Mark as Favourite</div>`;
    const inner = document.createElement('div');
    inner.id = id;
    inner.innerHTML = `${avatarEl}
      ${subjectEl}
      ${dateEl}
      ${markAsFavEl}
      ${body}`;
    emailBodyEl.innerHTML = inner.outerHTML;
  }  
}

function selectFavourite(event) {
  // debugger;
}

document.getElementById("list").addEventListener("click", (event) => {
  const id = event.target.parentNode.parentNode.id || event.target.parentNode.parentNode.parentNode.id;
  if (id) {
    showEmail(id);
  }
});

function showEmail(id) {
  fetch(`https://flipkart-email-mock.now.sh/?id=${id}`)
    .then(response => response.json())
    .then(data => {
      const index = emailData.findIndex(el => el.id === id);
      emailData[index].isRead = true;
      emailDesc = data.body;
      updateView(emailData[index], data.body);
    })
}

function updateFilter(value) {
  const parentEl = document.getElementsByClassName("labelContainer")[0];
  Object.values(parentEl.children).map((el) => {
    el.className = "";
  })
  document.getElementById(value).className = "selectedLabel";
  emailDesc = "";
  updateView({}, emailDesc);
  if(value === "unread") {
    showList(emailData);
  } else if(value === "read") {
    showList(emailData.filter((el) => el.isRead));
  } else {
    showList(emailData.filter((el) => el.isFavourite));
  }
}

