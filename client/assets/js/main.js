function LoginUser(e) {
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#password").val();
  const data = {
    email: email,
    password: password,
  };
  $.ajax({
    url: "http://localhost:3000/user/login",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        const token = response.token;
        debugger;
        localStorage.setItem("token", token);
                window.location.href = "/musteri";
      } else if (xhr.status === 401) {
        // Unauthorized, invalid credentials
        alert("Invalid Credentials");
      } else {
        // Handle other status codes as needed
        alert("An error occurred. Status code: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 401) {
        // Unauthorized, invalid credentials
        alert("Invalid Credentials");
      } else {
        // Handle other status codes as needed
        alert("An error occurred. Status code: " + xhr.status);
      }
    },
  });
}

function LoginCompany() {
  const email = $("#email").val();
  const password = $("#password").val();
  const data = {
    email: email,
    password: password,
  };
  $.ajax({
    url: "http://localhost:3000/company/login",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (data) {
      data.status;
      if (data == "OK") {
        window.location.href = "/firma";
      } else {
        alert("Invalid Credentials");
      }
    },
  });
}
