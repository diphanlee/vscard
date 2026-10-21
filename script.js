const profile = {
  name: "이승아",
  job: "게임 사업 PM",
  email: "email@example.com",
  phone: "010.1234.5678"
};

const nameElement =
  document.querySelector(".name");

const jobElement =
  document.querySelector(".job");

const emailElement =
  document.getElementById("email");

const phoneElement =
  document.getElementById("phone");

const emailButton =
  document.getElementById("emailButton");

const copyButton =
  document.getElementById("copyButton");


function setTextValue(
  element,
  value,
  placeholder
) {
  if (!value) {
    element.textContent = placeholder;
    element.classList.add("placeholder");
    return;
  }

  element.textContent = value;
  element.classList.remove("placeholder");
}


setTextValue(
  nameElement,
  profile.name,
  "이름을 입력하세요"
);


setTextValue(
  jobElement,
  profile.job,
  "직군을 입력하세요"
);


if (profile.email) {
  emailElement.textContent =
    profile.email;

  emailElement.href =
    `mailto:${profile.email}`;

  emailElement.classList.remove(
    "placeholder"
  );

  emailElement.removeAttribute(
    "aria-disabled"
  );

  emailButton.disabled = false;
}


if (profile.phone) {
  phoneElement.textContent =
    profile.phone;

  phoneElement.href =
    `tel:${profile.phone.replace(
      /[^0-9+]/g,
      ""
    )}`;

  phoneElement.classList.remove(
    "placeholder"
  );

  phoneElement.removeAttribute(
    "aria-disabled"
  );
}


if (
  profile.email ||
  profile.phone
) {
  copyButton.disabled = false;
}


emailButton.addEventListener(
  "click",
  () => {
    if (!profile.email) return;

    window.location.href =
      `mailto:${profile.email}`;
  }
);


copyButton.addEventListener(
  "click",
  async () => {

    const contactText = [
      profile.name,
      profile.job,
      profile.email,
      profile.phone
    ]
      .filter(Boolean)
      .join("\n");

    if (!contactText) return;

    try {
      await navigator.clipboard.writeText(
        contactText
      );

      const originalText =
        copyButton.textContent;

      copyButton.textContent =
        "복사 완료";

      window.setTimeout(
        () => {
          copyButton.textContent =
            originalText;
        },
        1500
      );

    } catch (error) {
      console.error(
        "연락처 복사에 실패했습니다.",
        error
      );
    }
  }
);