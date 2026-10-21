
const profile = {
  name: "이승아",
  job: "게임 사업 PM",
  email: "email@example.com",
  phone: "010.1234.5678"
};

const nameElement = document.querySelector(".name");
const jobElement = document.querySelector(".job");
const emailElement = document.getElementById("email");
const phoneElement = document.getElementById("phone");
const emailButton = document.getElementById("emailButton");
const copyButton = document.getElementById("copyButton");

function setTextValue(element, value, placeholder) {
  if (!element) return;
  element.textContent = value || placeholder;
  element.classList.toggle("placeholder", !value);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = text;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("클립보드 복사가 지원되지 않습니다.");
    }
  } finally {
    temporaryInput.remove();
  }
}

const feedbackTimers = new WeakMap();

function showCopyFeedback(element, message = "복사 완료!") {
  if (!element) return;

  const existingTimer = feedbackTimers.get(element);
  if (existingTimer) clearTimeout(existingTimer);

  if (!element.dataset.originalText) {
    element.dataset.originalText = element.textContent;
  }

  element.textContent = message;

  const timer = window.setTimeout(() => {
    element.textContent = element.dataset.originalText;
    delete element.dataset.originalText;
    feedbackTimers.delete(element);
  }, 1500);

  feedbackTimers.set(element, timer);
}

setTextValue(nameElement, profile.name, "이름을 입력하세요");
setTextValue(jobElement, profile.job, "직군을 입력하세요");

if (emailElement) {
  setTextValue(emailElement, profile.email, "이메일을 입력하세요");

  if (profile.email) {
    emailElement.href = `mailto:${profile.email}`;
    emailElement.removeAttribute("aria-disabled");
    emailElement.title = "클릭하면 이메일 주소가 복사됩니다";

    emailElement.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        await copyToClipboard(profile.email);
        showCopyFeedback(emailElement);
      } catch (error) {
        console.error("이메일 복사에 실패했습니다.", error);
        window.alert("이메일 복사에 실패했습니다. 주소를 직접 복사해 주세요.");
      }
    });
  } else {
    emailElement.removeAttribute("href");
    emailElement.setAttribute("aria-disabled", "true");
  }
}

if (phoneElement) {
  setTextValue(phoneElement, profile.phone, "전화번호를 입력하세요");

  if (profile.phone) {
    phoneElement.href = `tel:${profile.phone.replace(/[^0-9+]/g, "")}`;
    phoneElement.removeAttribute("aria-disabled");
  } else {
    phoneElement.removeAttribute("href");
    phoneElement.setAttribute("aria-disabled", "true");
  }
}

if (emailButton) {
  emailButton.disabled = !profile.email;

  emailButton.addEventListener("click", () => {
    if (profile.email) {
      window.location.href = `mailto:${profile.email}`;
    }
  });
}

if (copyButton) {
  copyButton.disabled = !(profile.email || profile.phone);

  copyButton.addEventListener("click", async () => {
    const contactText = [
      profile.name,
      profile.job,
      profile.email,
      profile.phone
    ].filter(Boolean).join("\n");

    if (!contactText) return;

    try {
      await copyToClipboard(contactText);
      showCopyFeedback(copyButton, "복사 완료");
    } catch (error) {
      console.error("연락처 복사에 실패했습니다.", error);
      window.alert("연락처 복사에 실패했습니다. 다시 시도해 주세요.");
    }
  });
}
